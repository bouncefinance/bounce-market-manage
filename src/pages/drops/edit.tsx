import moment from 'moment';
import styles from './index.less';
import React, { useEffect, useState } from 'react';
import { PageContainer } from '@ant-design/pro-layout';
import {
  Button,
  Card,
  Form,
  Input,
  DatePicker,
  Modal,
  message,
  Space,
  List,
  Select,
  Empty,
  Tag,
} from 'antd';
import Image from '@/components/Image';
import ImageUploader from '@/components/ImageUploader';
import ColorPicker from '@/components/ColorPicker';
import { useRequest, history } from 'umi';
import { addOneDrop } from '@/services/drops';
import { getAccountByAddress } from '@/services/user';
import type { IUserItem } from '@/services/user/types';
import AddNftTable from '@/pages/drops/AddNftTable';
import OperateNftTable from '@/pages/drops/OperateNftTable';
import type { IAddDropParams, IPoolResponse } from '@/services/drops/types';

const { Option } = Select;

type BGType = 'cover' | 'bgcolor';

// console.log('history.location.query: ', history.location.query?.id);
const targetDropId = history.location.query?.id;

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
  const seconds = moment().seconds();
  // 当日只能选择当前时间之后的时间点
  if (date && moment(date).date() === moment().date()) {
    return {
      disabledHours: () => range(0, 24).splice(0, hours),
      disabledMinutes: () => range(0, 60).splice(0, minutes + 1),
      disabledSeconds: () => range(0, 60).splice(0, seconds + 1),
    };
  }
  return {
    disabledHours: () => [],
    disabledMinutes: () => [],
    disabledSeconds: () => [],
  };
};

const DropEdit: React.FC = () => {
  const [coverImage, setCoverImage] = useState<any>(null);
  const [selectedAccount, setSelectedAccount] = useState<IUserItem>();
  const [addNftModalVisible, setAddNftModalVisible] = useState(false);
  const [tempSelectedKeys, setTempSelectedKeys] = useState<number[]>([]);
  const [selectedKeys, setSelectedKeys] = useState<number[]>([]);
  const [tempSelectedNftList, setTempSelectedNftList] = useState<IPoolResponse[]>([]);
  const [selectedNftList, setSelectedNftList] = useState<IPoolResponse[]>([]);
  const [selectedAccountAddress, setSelectedAccountAddress] = useState('');
  const [backgroundType, setBackgroundType] = useState<BGType>('cover');

  useEffect(() => {
    setSelectedNftList([]);
  }, [selectedAccount]);

  // getAccountByAddress
  const {
    data: accountData,
    loading: accountLoading,
    run: searchAccount,
  } = useRequest(
    (accountaddress) => {
      return getAccountByAddress({
        accountaddress,
      });
    },
    {
      manual: true,
      cacheKey: 'accounts',
      formatResult(data: any) {
        return {
          list: data.data,
          total: data.total,
        };
      },
    },
  );

  // console.log('accountData: ', accountData);

  // getonedropsdetail = ({ offset, limit, dropsid, poolstate }: IGetDropDetailParams) => {
  //   return post<IDropDetailResponse[]>(Apis.getonedropsdetail, {
  //     offset,
  //     limit,
  //     dropsid,
  //     poolstate,
  //   });
  // };

  const handleEdit = (data: any) => {
    console.log('data: ', data);
    if (!selectedAccount) return;
    const params: IAddDropParams = {
      accountaddress: selectedAccount.accountaddress,
      website: data.website,
      twitter: data.twitter,
      Instagram: data.instagram,
      title: data.title,
      description: data.description,
      bgcolor: data?.bgcolor,
      coverimgurl: data?.cover?.url,
      poolids: selectedNftList.map((nft) => {
        return nft.id;
      }),
      ordernum: new Array(selectedNftList.length).fill(0).map((_, index) => {
        return index;
      }),
      dropdate: data.dropdate.unix(),
    };

    addOneDrop(params).then((res) => {
      if (res.code === 1) {
        message.success('Added Successfully');
      } else message.error('Add failed');
    });

    history.push('/drops');
  };

  const [form] = Form.useForm();

  const handleReset = () => {
    setSelectedNftList([]);
    setCoverImage(null);
    setSelectedAccount(undefined);
    setSelectedKeys([]);
    form.resetFields();
  };

  // const onFill = () => {
  //   form.setFieldsValue({
  //     note: 'Hello world!',
  //     gender: 'male',
  //   });
  // };

  const options = accountData?.list?.map((account: IUserItem) => {
    return (
      <Option key={account.id} value={account.accountaddress} disabled={account.identity === 1}>
        <List.Item.Meta
          avatar={<Image src={account?.imgurl} width={50} height={50} />}
          title={
            <Space>
              <span>{account?.username}</span>
              {account?.identity === 1 ? (
                <Tag color="error">Unverfied</Tag>
              ) : (
                <Tag color="blue">Verfied</Tag>
              )}
            </Space>
          }
          description={<span>{account?.accountaddress}</span>}
        />
      </Option>
    );
  });

  return (
    <PageContainer>
      <Card>
        <Form
          form={form}
          /* ref={formRef} */ labelCol={{ span: 6 }}
          wrapperCol={{ span: 14 }}
          onFinish={handleEdit}
        >
          <Form.Item label="Account">
            {!targetDropId && (
              <Select
                // open
                loading={accountLoading}
                optionLabelProp={'value'}
                defaultActiveFirstOption={false}
                showSearch
                value={selectedAccountAddress}
                placeholder="Input Address"
                onSearch={(value) => {
                  if (value) searchAccount(value);
                }}
                onChange={(value) => {
                  setSelectedAccountAddress(value);
                  setSelectedAccount(
                    accountData?.list?.find((account: IUserItem) => {
                      return account.accountaddress === value;
                    }),
                  );
                }}
                notFoundContent={<Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />}
              >
                {options}
              </Select>
            )}

            {selectedAccount ? (
              <List
                itemLayout="horizontal"
                dataSource={[selectedAccount]}
                renderItem={(item) => (
                  <List.Item key={item?.id}>
                    <List.Item.Meta
                      avatar={<Image src={item?.imgurl} width={50} height={50} />}
                      title={<span>{item?.username}</span>}
                      description={item?.accountaddress}
                    />
                  </List.Item>
                )}
              />
            ) : (
              <></>
            )}
          </Form.Item>

          <Form.Item
            label="Background"
            rules={[
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (value || getFieldValue(backgroundType)) {
                    return Promise.resolve();
                  }
                  return Promise.reject(
                    new Error(
                      `${
                        backgroundType === 'cover' ? 'Cover' : 'Background color'
                      } cannot be empty`,
                    ),
                  );
                },
              }),
            ]}
          >
            <Space direction="vertical">
              <Select
                style={{ width: 160 }}
                defaultValue={backgroundType}
                onSelect={(value: BGType) => {
                  setBackgroundType(value);
                }}
              >
                <Option value="cover">Cover</Option>
                <Option value="bgcolor">Background Color</Option>
              </Select>
              {backgroundType === 'cover' && (
                <Form.Item name="cover" noStyle>
                  <ImageUploader
                    maxCount={1}
                    onChange={(file) => {
                      setCoverImage(file);
                    }}
                  />
                </Form.Item>
              )}
              {backgroundType === 'bgcolor' && (
                <Form.Item name="bgcolor" noStyle>
                  <ColorPicker value="#000" />
                </Form.Item>
              )}
            </Space>
          </Form.Item>

          {backgroundType === 'cover' && (
            <Form.Item label="Preview">
              {coverImage && (
                <div className={styles['cover-image']}>
                  <div className={styles.preview}>
                    <Image width={240} height={100} src={coverImage?.thumbUrl || coverImage?.url} />
                  </div>
                  <div className={styles.preview}>
                    <Image width={73} height={100} src={coverImage?.thumbUrl || coverImage?.url} />
                  </div>
                </div>
              )}
            </Form.Item>
          )}
          <Form.Item
            name="title"
            label="Title"
            rules={[{ required: true, message: 'Title cannot be empty' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="description"
            label="Description"
            rules={[{ required: true, message: 'Description cannot be empty' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="dropdate"
            label="Drop Date"
            rules={[{ required: true, message: 'Drop date cannot be empty' }]}
          >
            <DatePicker
              format={'YYYY-MM-DD HH:mm'}
              showTime
              showNow={false}
              disabledDate={disabledDate}
              disabledTime={disabledTime}
            />
          </Form.Item>
          <Form.Item label="Social Link">
            <Form.Item name="instagram">
              <Input addonBefore="Instagram" />
            </Form.Item>
            <Form.Item name="twitter">
              <Input addonBefore="Twitter" />
            </Form.Item>
            <Form.Item name="website">
              <Input addonBefore="Website" />
            </Form.Item>
          </Form.Item>
          <Form.Item
            name="nfts"
            label="Drop NFTs List"
            rules={[
              () => ({
                validator() {
                  if (selectedNftList.length > 0) {
                    return Promise.resolve();
                  }
                  return Promise.reject(new Error('The Drop NFTs List cannot be empty.'));
                },
              }),
            ]}
          >
            <Space direction="vertical">
              <Button
                onClick={() => {
                  setAddNftModalVisible(true);
                }}
              >
                Add
              </Button>
              <OperateNftTable
                selectedNftList={selectedNftList}
                setTempSelectedNftList={setTempSelectedNftList}
                setSelectedNftList={setSelectedNftList}
                selectedKeys={selectedKeys}
                setSelectedKeys={setSelectedKeys}
                tempSelectedKeys={tempSelectedKeys}
                setTempSelectedKeys={setTempSelectedKeys}
              />
            </Space>
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
              Create
            </Button>
          </Form.Item>
        </Form>

        <Modal
          destroyOnClose
          title="Select NFTs"
          width={800}
          bodyStyle={{ padding: 20 }}
          visible={addNftModalVisible}
          onOk={() => {
            setAddNftModalVisible(false);
            setSelectedNftList(tempSelectedNftList);
            setSelectedKeys(tempSelectedKeys);
            // setTempSelectedKeys([])
            // setTempSelectedNftList([])
          }}
          onCancel={() => {
            setAddNftModalVisible(false);
            setTempSelectedNftList(selectedNftList);
            setTempSelectedKeys(selectedKeys);
          }}
        >
          <AddNftTable
            userAddress={selectedAccount?.accountaddress || ''}
            tempSelectedNftList={tempSelectedNftList}
            setTempSelectedNftList={setTempSelectedNftList}
            tempSelectedKeys={tempSelectedKeys}
            setTempSelectedKeys={setTempSelectedKeys}
            selectedKeys={selectedKeys}
            // setSelectedKeys={setSelectedKeys}
          />
        </Modal>
      </Card>
    </PageContainer>
  );
};
export default DropEdit;
