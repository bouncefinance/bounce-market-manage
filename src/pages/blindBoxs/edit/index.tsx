import ImageUploader from '@/components/ImageUploader';
import { addBlindBox, queryOneBlindBox, updateBlindBox } from '@/services/blindBoxs';
import type { IAddBlindBoxParams, IUpdateBlindBoxParams } from '@/services/blindBoxs/types';
import { getBrandByContract } from '@/services/brand';
import type { IBrandResponse } from '@/services/brand/types';
import { CURRENCY } from '@/tools/const';
// import useRequest from '@ahooksjs/use-request';
import { PageContainer } from '@ant-design/pro-layout';
import {
  Card,
  Form,
  DatePicker,
  Input,
  Select,
  Divider,
  Empty,
  List,
  Image,
  Button,
  message,
} from 'antd';
import moment from 'moment';
import React, { useEffect, useState } from 'react';
import { useRequest, useLocation, history } from 'umi';

// type SearchType = 'contract' | 'name';

const { TextArea } = Input;
const { Option } = Select;

function range(start: any, end: any) {
  const result = [];
  for (let i = start; i < end; i += 1) {
    result.push(i);
  }
  return result;
}
const disabledDate = (currentDate: any) =>
  currentDate && currentDate < moment().subtract(1, 'day').endOf('day');

const disabledTime = (date: any) => {
  const hours = moment().hours();
  const minutes = moment().minutes();
  // 当日只能选择当前时间之后的时间点
  if (date && moment(date).date() === moment().date()) {
    if (moment(date).hour() === moment().hour())
      return {
        disabledHours: () => range(0, 24).splice(0, hours),
        disabledMinutes: () => range(0, 60).splice(0, minutes + 1),
      };
    return {
      disabledHours: () => range(0, 24).splice(0, hours),
    };
  }
  return {
    disabledHours: () => [],
    disabledMinutes: () => [],
  };
};

const typeTemplate = 'Please input a valid ${type}';
const validateMessages = {
  required: '${label} is required!',
  types: {
    url: typeTemplate,
  },
};

export type IEditBlindBoxProps = {};

const EditBlindBox: React.FC<IEditBlindBoxProps> = ({}) => {
  const [form] = Form.useForm();
  const location = useLocation();
  const boxId = location['query']?.id || '';

  const [selectedBrand, setSelectedBrand] = useState<IBrandResponse>();
  // const [searchType, setSearchType] = useState<SearchType>('contract');
  // const [brandData, setBrandData] = useState<IBrandResponse | IBrandResponse[]>();
  // const [brandLoading, setBrandLoading] = useState<boolean>(false);
  // const [searchBrand, setSearchBrand] = useState();

  const { data: boxData, run: searchOneBlindBox } = useRequest(
    (id: number) => {
      return queryOneBlindBox({ id: Number(id) });
    },
    {
      manual: true,
      defaultParams: [boxId],
    },
  );

  const {
    data: brandData,
    loading: brandLoading,
    run: searchBrand,
  } = useRequest(
    (contractAddress) => {
      return getBrandByContract(contractAddress);
    },
    {
      manual: true,
      // cacheKey: 'accounts',
    },
  );

  // const {
  //   data: brandDataByName,
  //   loading: brandLoadingByName,
  //   run: searchBrandByName,
  // } = useRequest(
  //   ({ pageSize: limit, current: offset }, searchText) =>
  //     getBrandsListByName({ likestr: searchText, offset: (offset - 1) * limit, limit }),
  //   {
  //     manual: true,
  //     // paginated: true,
  //     // defaultParams: [{ pageSize: 6, current: 1 }],
  //   },
  // );

  // useEffect(() => {
  //   if (searchType === 'contract') {
  //     setBrandData(brandDataByContract);
  //     setBrandLoading(brandLoadingByContract);
  //   }
  //   if (searchType === 'name') {
  //     setBrandData(brandDataByName);
  //     setBrandLoading(brandLoadingByContract);
  //   }
  // }, [searchType]);

  useEffect(() => {
    if (boxId.length > 0) {
      searchOneBlindBox(boxId);
    }
  }, [boxId]);

  useEffect(() => {
    if (boxData) {
      searchBrand(boxData?.collection);

      const boxImg = {
        uid: 0,
        name: 'image file',
        status: 'done',
        thumbUrl: boxData.blindcoverimgurl || '',
        url: boxData.blindcoverimgurl || '',
      };

      const dropImg = {
        uid: 1,
        name: 'image file',
        status: 'done',
        thumbUrl: boxData.coverimgurl || '',
        url: boxData.coverimgurl || '',
      };

      form.setFieldsValue({
        name: boxData.title,
        dropdate: moment(boxData.dropdate * 1000),
        opendate: moment(boxData.opendate * 1000),
        blindcoverimgurl: boxData.blindcoverimgurl ? boxImg : null,
        drop_description: boxData.description,
        channel: boxData.channel,
        category: boxData.category,
        supply: boxData.nfts,
        price: boxData.price,
        maxbuycount: boxData.maxbuycount,
        tokenimgs: boxData.tokenimgs,
        box_description: boxData.nftdescription,
        instagram: boxData.instagram,
        twitter: boxData.twitter,
        website: boxData.website,
        coverimgurl: boxData.coverimgurl ? dropImg : null,
      });
    }
  }, [boxData]);

  useEffect(() => {
    if (brandData) {
      setSelectedBrand(brandData);
    }
  }, [brandData]);

  const handleAdd = (data: any) => {
    if (!selectedBrand) return;

    const params: IAddBlindBoxParams = {
      accountaddress: selectedBrand?.creator,
      blindcoverimgurl: data.blindcoverimgurl.url,
      blindname: data.name,
      category: data.category,
      channel: data.channel,
      collection: selectedBrand?.contractaddress,
      coverimgurl: data.coverimgurl.url,
      nftdescription: data.box_description,
      dropdate: data.dropdate.unix(),
      instagram: data.instagram,
      maxbuycount: Number(data.maxbuycount),
      description: data.drop_description,
      opendate: data.opendate.unix(),
      price: data.price,
      tokenimgs: data.tokenimgs,
      totalsupply: Number(data.supply),
      twitter: data.twitter,
      website: data.website,
    };

    addBlindBox(params).then((res) => {
      if (res.code === 1) {
        message.success('Added Successfully');
        history.push('/blindboxs');
      } else if (res.msg?.includes('timestamp')) message.error('Time is over due');
      else if (res.msg?.includes('Duplicate entry'))
        message.error('Collection cannot be duplicate.');
      else if (res.msg?.includes('tokenimgs length'))
        message.error('Tokenimgs length and Total supply should be same.');
      else message.error('Add failed');
    });
  };

  const handleEdit = (data: any) => {
    if (!selectedBrand || !boxId) return;

    const params: IUpdateBlindBoxParams = {
      id: Number(boxId),
      blindcoverimgurl: data.blindcoverimgurl.url,
      blindname: data.name,
      category: data.category,
      channel: data.channel,
      coverimgurl: data.coverimgurl.url,
      description: data.drop_description,
      instagram: data.instagram,
      nftdescription: data.box_description,
      tokenimgs: data.tokenimgs,
      twitter: data.twitter,
      website: data.website,
    };

    updateBlindBox(params).then((res) => {
      if (res.code === 1) {
        message.success('Edited Successfully');
        history.push('/blindboxs');
      } else if (res.msg?.includes('timestamp')) message.error('Drop time is over due');
      else message.error('Add failed');
    });
  };

  const handleReset = () => {
    setSelectedBrand(undefined);
    form.resetFields();
  };

  const options = (
    <Option value={brandData?.contractaddress || ''}>
      <List.Item.Meta
        avatar={<Image src={brandData?.imgurl} width={50} />}
        title={<span>{brandData?.brandname}</span>}
        description={<span>{brandData?.contractaddress}</span>}
      />
    </Option>
  );

  return (
    <PageContainer>
      <Card>
        <Form
          form={form}
          labelCol={{ span: 6 }}
          wrapperCol={{ span: 14 }}
          onFinish={boxId ? handleEdit : handleAdd}
          validateMessages={validateMessages}
          validateTrigger={['onSubmit', 'onBlur']}
        >
          <Form.Item noStyle>
            <h1>Add blind box</h1>
          </Form.Item>

          <Form.Item label="collection合约">
            {!boxId && (
              // <>
              //   <Select
              //     defaultValue="contract"
              //     onSelect={(value) => {
              //       setSearchType(value);
              //     }}
              //   >
              //     <Option value="contract">Contect</Option>
              //     <Option value="name">Name</Option>
              //   </Select>
              // </>

              <Select
                // open
                loading={brandLoading}
                optionLabelProp={'value'}
                defaultActiveFirstOption={false}
                showSearch
                value={selectedBrand?.contractaddress}
                placeholder="Input Address"
                onSearch={(value) => {
                  if (value) {
                    searchBrand(value);
                  }
                }}
                onChange={() => {
                  setSelectedBrand(brandData);
                }}
                notFoundContent={<Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />}
              >
                {options}
              </Select>
            )}

            {selectedBrand ? (
              <List
                itemLayout="horizontal"
                dataSource={[selectedBrand]}
                renderItem={(brand) => (
                  <List.Item key={brand.id}>
                    <List.Item.Meta
                      avatar={<Image src={brand.imgurl} width={50} height={50} />}
                      title={<span>{brand.brandname}</span>}
                      description={brand.contractaddress}
                    />
                  </List.Item>
                )}
              />
            ) : null}
          </Form.Item>

          <Form.Item name="dropdate" label="盲盒开启的时间" rules={[{ required: true }]}>
            <DatePicker
              disabled={boxId}
              inputReadOnly
              format={'YYYY-MM-DD HH:mm'}
              showTime={{ defaultValue: moment().add(1, 'minute') }}
              showNow={false}
              disabledDate={disabledDate}
              disabledTime={disabledTime}
            />
          </Form.Item>

          <Form.Item name="opendate" label="盲盒开售的时间" rules={[{ required: true }]}>
            <DatePicker
              disabled={boxId}
              inputReadOnly
              format={'YYYY-MM-DD HH:mm'}
              showTime={{ defaultValue: moment().add(1, 'minute') }}
              showNow={false}
              disabledDate={disabledDate}
              disabledTime={disabledTime}
            />
          </Form.Item>

          <Form.Item label="盲盒封面">
            <Form.Item
              name="blindcoverimgurl"
              noStyle
              rules={[{ required: true, message: 'Cover cannot be empty' }]}
            >
              <ImageUploader maxCount={1} limit={4 * 1024 * 1024} />
            </Form.Item>
            <span>Support jpg, png, gif, jpeg, jp2. Max size: 10MB.</span>
          </Form.Item>

          <Form.Item name="name" label="盲盒name" rules={[{ required: true }]}>
            <Input />
          </Form.Item>

          <Form.Item name="box_description" label="盲盒description">
            <TextArea rows={4} />
          </Form.Item>

          <Form.Item name="channel" label="Channel" initialValue="art" rules={[{ required: true }]}>
            <Select>
              <Option value="art">Art</Option>
              <Option value="sports">Sports</Option>
              <Option value="comic">Comic</Option>
              <Option value="collectible">Collectible</Option>
              <Option value="music">Music</Option>
              <Option value="performer">Performer</Option>
              <Option value="metaverse">Metaverse</Option>
              <Option value="games">Games</Option>
            </Select>
          </Form.Item>

          <Form.Item
            name="category"
            label="Category: "
            initialValue="image"
            rules={[{ required: true }]}
          >
            <Select>
              <Option value="image">Image</Option>
              <Option value="video">Video</Option>
            </Select>
          </Form.Item>

          <Form.Item
            name="supply"
            label="Total Supply"
            // validateTrigger={['onSubmit']}
            rules={[
              { required: true },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  console.log('maxbuycount: ', getFieldValue('maxbuycount'));
                  if (
                    !value ||
                    !getFieldValue('maxbuycount') ||
                    getFieldValue('maxbuycount') <= value
                  ) {
                    return Promise.resolve();
                  }
                  return Promise.reject(
                    new Error('Total supply cannot be smaller than total max buy count.'),
                  );
                },
              }),
            ]}
          >
            <Input type="number" disabled={boxId} />
          </Form.Item>

          <Form.Item name="price" label="Price" rules={[{ required: true }]}>
            <Input suffix={CURRENCY[sessionStorage.symbol]} type="number" disabled={boxId} />
          </Form.Item>

          <Form.Item
            name="maxbuycount"
            label="最大购买数量"
            // validateTrigger={['onSubmit']}
            rules={[
              { required: true },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  console.log('supply: ', getFieldValue('supply'));
                  if (!value || !getFieldValue('supply') || getFieldValue('supply') >= value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(
                    new Error('Max buy count cannot be bigger than total supply.'),
                  );
                },
              }),
            ]}
          >
            <Input type="number" disabled={boxId} />
          </Form.Item>

          <Form.Item name="tokenimgs" label="盲盒image链接" rules={[{ required: true }]}>
            <TextArea rows={4} />
          </Form.Item>

          <Divider />

          <Form.Item noStyle>
            <h1>drops相关资料</h1>
          </Form.Item>

          <Form.Item name="drop_description" label="Description" rules={[{ required: true }]}>
            <TextArea rows={4} showCount maxLength={300} />
          </Form.Item>

          <Form.Item label="Links">
            <Form.Item name="instagram" rules={[{ type: 'url' }]}>
              <Input addonBefore="Instagram" />
            </Form.Item>

            <Form.Item name="twitter" rules={[{ type: 'url' }]}>
              <Input addonBefore="Twitter" />
            </Form.Item>

            <Form.Item name="website" rules={[{ type: 'url' }]}>
              <Input addonBefore="Website" />
            </Form.Item>
          </Form.Item>

          <Form.Item label="Cover">
            <Form.Item
              name="coverimgurl"
              noStyle
              rules={[{ required: true, message: 'Cover cannot be empty' }]}
            >
              <ImageUploader maxCount={1} limit={4 * 1024 * 1024} />
            </Form.Item>
            <span>Support jpg, png, gif, jpeg, jp2. Max size: 4MB.</span>
          </Form.Item>

          <Form.Item wrapperCol={{ offset: 7, span: 8 }} style={{ textAlign: 'right' }}>
            <Button
              htmlType="submit"
              style={{ margin: '0 8px' }}
              onClick={() => {
                handleReset();
              }}
            >
              Reset
            </Button>
            <Button type="primary" htmlType="submit">
              {boxId ? 'Save' : 'Create'}
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </PageContainer>
  );
};

export default EditBlindBox;
