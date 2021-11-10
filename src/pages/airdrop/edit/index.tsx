import ImageUploader from '@/components/ImageUploader';
import { addAirdrop } from '@/services/airdrop';
import type { IAddAirdropParams, IUserInfo, ModalAction } from '@/services/airdrop/types';
import { getBrandByContract } from '@/services/brand';
import type { IBrandResponse } from '@/services/brand/types';
import { PageContainer } from '@ant-design/pro-layout';
import {
  Card,
  Form,
  Input,
  Select,
  Divider,
  Empty,
  List,
  Image,
  Button,
  message,
  Table,
} from 'antd';
import moment from 'moment';
import React, { useEffect, useState } from 'react';
import { useRequest, history } from 'umi';
import UserInfoModal from './UserInfoModal';

// type SearchType = 'contract' | 'name';

const { TextArea } = Input;
const { Option } = Select;

// eslint-disable-next-line no-template-curly-in-string
const typeTemplate = 'Please input a valid ${type}';
const validateMessages = {
  // eslint-disable-next-line no-template-curly-in-string
  required: '${label} is required!',
  types: {
    url: typeTemplate,
  },
};

const EditAirdrop: React.FC = () => {
  const [form] = Form.useForm();

  const [selectedBrand, setSelectedBrand] = useState<IBrandResponse>();
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);
  const [modalAction, setModalAction] = useState<ModalAction>('add');

  const [userIndex, setUserIndex] = useState<number>(-1);
  const [userInfoArr, setUserInfoArr] = useState<IUserInfo[]>([]);

  useEffect(() => {
    console.log('userIndex: ', userIndex);
  }, [userIndex]);

  useEffect(() => {
    console.log('userInfoArr: ', userInfoArr);
  }, [userInfoArr]);

  useEffect(() => {
    console.log('modalAction: ', modalAction);
  }, [modalAction]);

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

  const handleAdd = (data: any) => {
    if (!selectedBrand) return;

    const params: IAddAirdropParams = {
      airdropname: data.airdropname,
      category: data.category,
      channel: data.channel,
      collection: selectedBrand?.contractaddress,
      coverimgurl: data.coverimgurl.url,
      description: data.description,
      dropdate: moment().add(1, 'm').unix(),
      nftdescription: '',
      tokenimgs: data.tokenimgs,
      totalsupply: Number(data.supply),
      userinfos: userInfoArr,
    };

    // console.log('params: ', params);

    addAirdrop(params).then((res) => {
      if (res.code === 1) {
        message.success('Added Successfully');
        history.push('/blindairdrops');
      } else if (res.msg?.includes('timestamp')) message.error('Time is over due');
      else if (res.msg?.includes('Duplicate entry'))
        message.error('Collection cannot be duplicate.');
      else if (res.msg?.includes('tokenimgs length'))
        message.error('Total supply should be same with tokenimgs length and users amount.');
      else message.error('Add failed');
    });
  };

  const handleAddUserBtnClick = () => {
    setUserIndex(userInfoArr.length);
    setModalAction('add');
    setIsModalVisible(true);
  };

  const handleReset = () => {
    setSelectedBrand(undefined);
    form.resetFields();
  };

  const handleEditBtnClick = (index: number) => {
    setUserIndex(index);
    setModalAction('edit');
    setIsModalVisible(true);
  };

  const handleDeleteBtnClick = (targetIndex: number) => {
    setUserInfoArr(
      userInfoArr.filter((_, index) => {
        return index !== targetIndex;
      }),
    );
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

  const columns = [
    {
      dataIndex: 'usernames',
      title: 'name',
    },
    {
      dataIndex: 'useravatars',
      title: 'image',
      render: (src: any) => {
        return <Image width={40} height={40} src={src} preview />;
      },
    },
    {
      width: 170,
      render: (_: any, __: any, index: number) => {
        return (
          <>
            <Button
              style={{ marginRight: 8 }}
              onClick={() => {
                handleEditBtnClick(index);
              }}
            >
              Edit
            </Button>
            <Button
              danger
              onClick={() => {
                handleDeleteBtnClick(index);
              }}
            >
              delete
            </Button>
          </>
        );
      },
    },
  ];

  return (
    <PageContainer>
      <Card>
        <Form
          form={form}
          labelCol={{ span: 6 }}
          wrapperCol={{ span: 14 }}
          onFinish={handleAdd}
          validateMessages={validateMessages}
          validateTrigger={['onSubmit', 'onBlur']}
        >
          <Form.Item noStyle>
            <h1>Add airdrop</h1>
          </Form.Item>

          <Form.Item label="collection合约">
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

          <Form.Item label="上传封面">
            <Form.Item
              name="coverimgurl"
              noStyle
              rules={[{ required: true, message: 'Cover cannot be empty' }]}
            >
              <ImageUploader maxCount={1} limit={4 * 1024 * 1024} />
            </Form.Item>
            <span>Support jpg, png, gif, jpeg, jp2. Max size: 10MB.</span>
          </Form.Item>

          <Form.Item name="airdropname" label="name" rules={[{ required: true }]}>
            <Input />
          </Form.Item>

          <Form.Item name="description" label="description">
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
            // rules={[
            //   { required: true },
            //   ({ getFieldValue }) => ({
            //     validator(_, value) {
            //       if (
            //         !value ||
            //         !getFieldValue('maxbuycount') ||
            //         getFieldValue('maxbuycount') <= value
            //       ) {
            //         return Promise.resolve();
            //       }
            //       return Promise.reject(
            //         new Error('Total supply cannot be smaller than total max buy count.'),
            //       );
            //     },
            //   }),
            // ]}
          >
            <Input type="number" />
          </Form.Item>

          <Form.Item name="tokenimgs" label="image链接" rules={[{ required: true }]}>
            <TextArea rows={4} />
          </Form.Item>

          <Divider />

          <Form.Item noStyle>
            <h1>airdrop list</h1>
          </Form.Item>

          <Form.Item noStyle>
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 16 }}>
              <Button onClick={handleAddUserBtnClick}>Add user</Button>
            </div>
            <Table columns={columns} dataSource={userInfoArr} />
          </Form.Item>

          <Form.Item
            wrapperCol={{ offset: 6, span: 8 }}
            style={{ textAlign: 'right', marginTop: 16 }}
          >
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
              Create
            </Button>
          </Form.Item>
        </Form>
      </Card>

      <UserInfoModal
        modalAction={modalAction}
        userIndex={userIndex}
        isModalVisible={isModalVisible}
        setIsModalVisible={setIsModalVisible}
        userInfoArr={userInfoArr}
        setUserInfoArr={setUserInfoArr}
      />
    </PageContainer>
  );
};

export default EditAirdrop;
