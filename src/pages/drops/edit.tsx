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
} from 'antd';
import ImageUploader from '@/components/ImageUploader';
import { useState } from 'react';
import styles from './index.less';
import ColorPicker from '@/components/ColorPicker';
import { IAddDropParams, IAccountsResponse, INftResponse } from '@/services/drops/types';
import { addOneDrop } from '@/services/drops';
import { useRequest, history  } from 'umi';
import request from 'umi-request';
import { FormInstance } from 'antd/lib/form';

import AddNftTable from '@/pages/drops/AddNftTable';
import OperateNftTable from '@/pages/drops/OperateNftTable';

import placeholderImg from '@/assets/images/placeholderImg.svg';

const { Column } = Table;
const { Search } = Input;

const getAccountList = function (
  filter: 1 | 2 | 3 = 1,
  offset: number,
  limit: number = 5,
  // likename?: string,
  accountaddress?: string,
  // tokenid?: number,
) {
  return request.post('/api/bouadmin/main/auth/getaccountsbylikename', {
    data: {
      filter,
      limit,
      offset,
      // likename,
      accountaddress,
      // tokenid,
    },
  });
};

const DropEdit: React.FC = () => {
  const [coverImage, setCoverImage] = useState<any>(null);
  const [selectedAccount, setSelectedAccount] = useState<IAccountsResponse>();
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const [addNftModalVisible, setAddNftModalVisible] = useState(false);
  const [selectedRowKeysIn1Page, setSelectedRowKeysIn1Page] = useState<number[]>([]);
  const [selectedNftList, setSelectedNftList] = useState<INftResponse[]>([]);

  console.log("history: ", history )

  useEffect(() => {
    setSelectedNftList([]);
  }, [selectedAccount]);

  const {
    data: accountData,
    // loading: itemLoading,
    // pagination: itemPagination,
    // params: itemParams,
    tableProps: accountTableProps,
    run: searchAccount,
    // refresh: reloadAccount,
  } = useRequest(
    ({ pageSize: limit, current: offset }, filter, searchText) => {
      return getAccountList(filter, (offset - 1) * limit, limit, searchText);
    },
    {
      paginated: true,
      cacheKey: 'accounts',
      defaultParams: [{ pageSize: 5, current: 1 }],
      formatResult(data: any) {
        return {
          list: data.data,
          total: data.total,
        };
      },
    },
  );

  const rowSelection = {
    onChange: (selectedRowKeys: React.Key[], selectedRows: any[]) => {
      setSelectedAccount({ ...selectedRows[0] });
      setDropdownVisible(false);
      console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows[0]);
    },
  };

  const menuEl = useRef(null);
  const formRef = useRef<FormInstance>(null);

  const menu = (
    <Menu ref={menuEl}>
      <Table
        rowSelection={{
          type: 'radio',
          ...rowSelection,
        }}
        rowKey="id"
        {...accountTableProps}
        size="small"
        style={{ width: 500 }}
      >
        <Column
          title="Avatar"
          dataIndex="imgurl"
          key="imgurl"
          width={110}
          align={'center'}
          render={(imgurl) => (
            <Image
              src={imgurl}
              width={64}
              height={64}
              style={{ objectFit: 'contain' }}
              fallback={placeholderImg}
            />
          )}
        />

        <Column
          title="User name"
          dataIndex="username"
          key="username"
          align={'center'}
          ellipsis={{ showTitle: false }}
          render={(username) =>
            username ? (
              <Tooltip placement="topLeft" title={username}>
                <span>{username}</span>
              </Tooltip>
            ) : (
              '--'
            )
          }
        />

        <Column
          title="Address"
          dataIndex="accountaddress"
          key="accountaddress"
          width={120}
          align={'center'}
          render={(accountaddress) => (
            <Tooltip placement="topLeft" title={accountaddress}>
              <span>{`${accountaddress.slice(0, 6)}...${accountaddress.slice(-4)}`}</span>
            </Tooltip>
          )}
        />
      </Table>
    </Menu>
  );

  const handleEdit = (data: any) => {
    console.log(data);
    if (!selectedAccount) return;
    const params: IAddDropParams = {
      accountaddress: selectedAccount.accountaddress,
      website: data.website,
      twitter: data.twitter,
      Instagram: data.instagram,
      title: data.title,
      description: data.description,
      bgcolor: data.bgcolor,
      coverimgurl: data.cover.url,
      poolids: selectedNftList.map((nft) => {
        return nft.id;
      }),
      ordernum: selectedNftList.map((value, index) => {
        return index;
      }),
      dropdate: data.dropdate.unix(),
    };
    console.log('params: ', params);
    addOneDrop(params).then((res) => {
      if (res.code === 1) {
        message.success('Added Successfully');
      } else message.error('Add failed');
    });
  };

  const handleReset = () => {
    setSelectedNftList([]);
    setCoverImage(null);
    setSelectedAccount(undefined);
    setSelectedRowKeysIn1Page([]);
    formRef.current!.resetFields();
  };

  return (
    <PageContainer>
      <Space direction={'vertical'} style={{ width: '100%' }}>
        <Input.Group compact>
          <Search
            allowClear
            enterButton
            style={{ width: '82%' }}
            onSearch={(value) => {
              searchAccount({ current: 1, pageSize: 5 }, 2, value);
              setDropdownVisible(true);
              console.log('accountData: ', accountData);
            }}
            // onChange={() => {}}
            // onBlur={() => {
            //   setDropdownVisible(false);
            // }}
          />
        </Input.Group>
        <Dropdown visible={dropdownVisible} overlay={menu}>
          <span></span>
        </Dropdown>
      </Space>
      <Card>
        <Form ref={formRef} labelCol={{ span: 6 }} wrapperCol={{ span: 14 }} onFinish={handleEdit}>
          <Form.Item name="Account" label="Account">
            {selectedAccount ? (
              <List
                itemLayout="horizontal"
                dataSource={[selectedAccount]}
                renderItem={(item) => (
                  <List.Item key={item?.id}>
                    <List.Item.Meta
                      avatar={<Image src={item?.imgurl} width={50} fallback={placeholderImg} />}
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
          <Form.Item name="cover" label="Cover">
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
          <Form.Item name="bgcolor" label="Background Color">
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
            <DatePicker showTime />
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
            // name="nfts"
            label="Drop NFTs List"
            // rules={[{ required: true, message: 'Drop NFTs List cannot be empty' }]}
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
                setSelectedNftList={setSelectedNftList}
                selectedRowKeys={selectedRowKeysIn1Page}
                setSelectedRowKeys={setSelectedRowKeysIn1Page}
              />
            </Space>
          </Form.Item>
          <Form.Item wrapperCol={{ offset: 7, span: 8 }} style={{ textAlign: 'right' }}>
            <Button type="primary" htmlType="submit">
              Submit
            </Button>
            <Button
              htmlType="submit"
              style={{ margin: '0 8px' }}
              onClick={() => {
                handleReset();
              }}
            >
              Reset
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
            console.log('ok');
            setAddNftModalVisible(false);
          }}
          onCancel={() => {
            console.log('cancel');
            setAddNftModalVisible(false);
          }}
        >
          <AddNftTable
            userAddress={selectedAccount?.accountaddress || ''}
            selectedNftList={selectedNftList}
            setSelectedNftList={setSelectedNftList}
            selectedRowKeys={selectedRowKeysIn1Page}
            setSelectedRowKeys={setSelectedRowKeysIn1Page}
          />
        </Modal>
      </Card>
    </PageContainer>
  );
};
export default DropEdit;
