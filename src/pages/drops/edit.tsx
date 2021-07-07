import React, { useEffect, useRef } from 'react';
import { PageContainer } from '@ant-design/pro-layout';
import {
  Button,
  Card,
  Form,
  Input,
  Image,
  DatePicker,
  Modal,
  message,
  Menu,
  Table,
  Space,
  Tooltip,
  Dropdown,
  List,
  Avatar,
  Select,
  Empty,
  Tag,
} from 'antd';
import ImageUploader from '@/components/ImageUploader';
import { useState } from 'react';
import styles from './index.less';
import ColorPicker from '@/components/ColorPicker';
import { IAddDropParams, IAccountsResponse, INftResponse } from '@/services/drops/types';
import { addOneDrop, getAccountByAddress, getonedropsdetail } from '@/services/drops';
import { useRequest, history } from 'umi';
import { FormInstance } from 'antd/lib/form';
import moment from 'moment';

import AddNftTable from '@/pages/drops/AddNftTable';
import OperateNftTable from '@/pages/drops/OperateNftTable';

import { ImgErrorUrl } from '@/tools/const';

const { Column } = Table;
const { Search } = Input;
const { Meta } = Card;
const { Option } = Select;

// console.log('history.location.query: ', history.location.query?.id);
const targetDropId = history.location.query?.id;

function range(start: any, end: any) {
  const result = [];
  for (let i = start; i < end; i++) {
    result.push(i);
  }
  return result;
}

const disabledDate = (currentDate: any) => currentDate && currentDate < moment().subtract(1, 'day');
const disabledTime = () => {
  const hours = moment().hours();
  const minutes = moment().minutes();
  // 当日只能选择当前时间之后的时间点
  return {
    disabledHours: () => range(0, 24).splice(0, hours),
    disabledMinutes: () => range(0, 60).splice(0, minutes + 1),
  };
};

const DropEdit: React.FC = () => {
  const [coverImage, setCoverImage] = useState<any>(null);
  const [selectedAccount, setSelectedAccount] = useState<IAccountsResponse>();
  const [addNftModalVisible, setAddNftModalVisible] = useState(false);
  const [tempSelectedKeys, setTempSelectedKeys] = useState<number[]>([]);
  const [selectedKeys, setSelectedKeys] = useState<number[]>([]);
  const [tempSelectedNftList, setTempSelectedNftList] = useState<INftResponse[]>([]);
  const [selectedNftList, setSelectedNftList] = useState<INftResponse[]>([]);
  const [selectedAccountAddress, setSelectedAccountAddress] = useState('');

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

  const menuEl = useRef(null);

  const handleEdit = (data: any) => {
    console.log('data.dropdate.unix()', data.dropdate.unix());
    if (!selectedAccount) return;
    const params: IAddDropParams = {
      accountaddress: selectedAccount.accountaddress,
      website: data.website,
      twitter: data.twitter,
      Instagram: data.instagram,
      title: data.title,
      description: data.description,
      bgcolor: data.bgcolor,
      coverimgurl: data.cover?.url,
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
    // formRef.current!.resetFields();
  };

  const onFill = () => {
    form.setFieldsValue({
      note: 'Hello world!',
      gender: 'male',
    });
  };

  const options = accountData?.list?.map((account: IAccountsResponse) => {
    return (
      <Option key={account.id} value={account.accountaddress} disabled={account.identity === 1}>
        <List
          itemLayout="horizontal"
          dataSource={[account]}
          renderItem={(item: IAccountsResponse) => (
            <List.Item key={item?.id}>
              <List.Item.Meta
                avatar={
                  <Image
                    src={item?.imgurl}
                    width={50}
                    height={50}
                    style={{ objectFit: 'contain' }}
                    fallback={ImgErrorUrl}
                  />
                }
                title={
                  <Space>
                    <span>{item?.username}</span>
                    {item?.identity === 1 ? (
                      <Tag color="error">Unverfied</Tag>
                    ) : (
                      <Tag color="blue">{'Verfied'}</Tag>
                    )}
                  </Space>
                }
                description={<span>{item?.accountaddress}</span>}
              />
            </List.Item>
          )}
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
                placeholder={'Input Address'}
                onSearch={(value) => {
                  if (value) searchAccount(value);
                }}
                onChange={(value) => {
                  setSelectedAccountAddress(value);
                  setSelectedAccount(
                    accountData?.list?.find((account: IAccountsResponse) => {
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
                      avatar={
                        <Image
                          src={item?.imgurl}
                          width={50}
                          height={50}
                          style={{ objectFit: 'contain' }}
                          fallback={ImgErrorUrl}
                        />
                      }
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
            name="cover"
            label="Cover"
            rules={[
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (value || getFieldValue('bgcolor')) {
                    return Promise.resolve();
                  }
                  return Promise.reject(
                    new Error('The Cover and Background Color cannot both be remote.'),
                  );
                },
              }),
            ]}
          >
            <ImageUploader
              maxCount={1}
              onChange={(file, items) => {
                setCoverImage(file);
              }}
            />
          </Form.Item>
          <Form.Item label="Preview">
            {coverImage && (
              <div className={styles['cover-image']}>
                <div className={styles['preview']}>
                  <Image
                    width={300}
                    height={100}
                    src={coverImage?.thumbUrl || coverImage?.url}
                    preview={false}
                  />
                </div>
                <div className={styles['preview']}>
                  <Image
                    width={80}
                    height={100}
                    src={coverImage?.thumbUrl || coverImage?.url}
                    preview={false}
                  />
                </div>
              </div>
            )}
          </Form.Item>
          <Form.Item
            name="bgcolor"
            label="Background Color"
            rules={[
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (value || getFieldValue('cover')) {
                    return Promise.resolve();
                  }
                  return Promise.reject(
                    new Error('The Cover and Background Color cannot both be remote.'),
                  );
                },
              }),
            ]}
          >
            <ColorPicker value="#000" />
          </Form.Item>
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
                  console.log(selectedNftList);
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
