import React, { useState, useRef, useEffect } from 'react';
import { DownOutlined, ExclamationCircleOutlined, UserOutlined } from '@ant-design/icons';
import { PageContainer } from '@ant-design/pro-layout';
import {
  Modal,
  Table,
  Tag,
  Space,
  Switch,
  Select,
  Avatar,
  Image,
  Tooltip,
  Button,
  Card,
  message,
  Input,
  Menu,
  Dropdown,
} from 'antd';
import { useRequest } from 'umi';
import request from 'umi-request';
import ImgCropUpload from '@/pages/drops/imgCropUpload';
import { SketchPicker } from 'react-color'

const { confirm } = Modal;
const { Option } = Select;
const { Search } = Input;

const { Column, ColumnGroup } = Table;

import placeholderImg from '@/assets/images/placeholderImg.svg';
interface IAccountData {
  id: number;
  bounceid: number;
  email: string;
  bandimgurl: string;
  accountaddress: string;
  username: string;
  fullnam: string;
  bio: string;
  imgurl: string;
  created_at: string;
  updated_at: string;
}
interface IPoolData {
  poolid: number;
  fileurl: string;
  likecount: number;
  pooltype: number; // 1: fixed swap, 2: English auction
  poolweight: number;
  price: string;
  state: number;
  token0: string;
  token1: string;
  tokenid: number;
  username: string;
  itemname: string;
  category: string;
  channel: string;
}

const getAccountList = function (likename: string = '', offset: number, limit: number = 5) {
  return request.post('/api/bouadmin/main/auth/getaccountsbylikename', {
    data: {
      likename,
      limit,
      offset,
    },
  });
};

const handleDeleteAccount = async function (id: number, reload: () => void) {
  const deleteAccount = async (id: number) => {
    const res = await request.post('/api/bouadmin/main/auth/delaccount', {
      data: {
        id,
      },
    });
    if (res.code === 1) {
      message.success('Deleted successfully');
    } else {
      message.error('Delete failed');
    }
  };

  confirm({
    // title: 'Delete',
    icon: <ExclamationCircleOutlined />,
    title: 'Do you Want to delete this item?',
    onOk() {
      deleteAccount(id).then(() => {
        reload();
      });
    },
    onCancel() {},
  });
};

// function showPromiseConfirm(value: string) {
//   confirm({
//     title: `Do you want to ${value} these items?`,
//     icon: <ExclamationCircleOutlined />,
//     content: 'When clicked the OK button, this dialog will be closed after 1 second',
//     onOk() {
//       return new Promise((resolve, reject) => {
//         setTimeout(Math.random() > 0.5 ? resolve : reject, 1000);
//       }).catch(() => console.log('Oops errors!'));
//     },
//     onCancel() {},
//   });
// }

const index: React.FC = () => {
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const [selectedPool, setSelectedPool] = useState<IPoolData[]>();
  const menuEl = useRef(null);

  useEffect(() => {
    console.log('menuEl: ', menuEl);
  }, [menuEl]);

  const {
    data: accountData,
    // loading: itemLoading,
    // pagination: itemPagination,
    // params: itemParams,
    tableProps: accountTableProps,
    run: searchAccount,
    refresh: reloadAccount,
  } = useRequest(
    ({ pageSize: limit, current: offset }, searchText) => {
      return getAccountList(searchText, (offset - 1) * limit, limit);
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

  // rowSelection object indicates the need for row selection
  const rowSelection = {
    onChange: (selectedRowKeys: React.Key[], selectedRows: IAccountData[]) => {
      console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
    },
    getCheckboxProps: (record: IAccountData) => ({
      disabled: record.username === 'Disabled User', // Column configuration not to be checked
      name: record.username,
    }),
  };

  const menu = (
    <Menu style={{ width: 700 }} ref={menuEl}>
      <Table
        rowKey="id"
        {...accountTableProps}
        rowSelection={{
          type: 'radio',
          ...rowSelection,
        }}
        size="middle"
        // style={{ width: 700 }}
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
              placeholder={
                <Image
                  preview={false}
                  src={placeholderImg}
                  width={64}
                  height={64}
                  style={{ background: 'white' }}
                />
              }
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

  return (
    <PageContainer>
      <Space direction={'vertical'} style={{ width: '100%' }}>
        <Input.Group compact>
          <Dropdown
            /* visible={dropdownVisible} */
            overlay={menu}
            trigger={['click']}
          >
            {/* <a className="ant-dropdown-link" onClick={(e) => e.preventDefault()}>
              Hover me <DownOutlined />
            </a> */}
            <Search
              allowClear
              enterButton
              style={{ width: '82%' }}
              onSearch={(value) => {
                searchAccount({ current: 1, pageSize: 5 }, value);
                setDropdownVisible(true);
                console.log('accountData: ', accountData);
              }}
              onChange={() => {}}
            />
          </Dropdown>
        </Input.Group>

        <Card bordered={false}>
          <Space direction={'vertical'}>
            <Table title={() => 'Drop NFTs List *'} rowKey="id" dataSource={selectedPool}>
              <Column
                title="Image"
                dataIndex="fileurl"
                key="fileurl"
                width={110}
                align={'center'}
                render={(fileurl, record: IPoolData) => {
                  console.log('record: ', record);
                  return record?.category === 'image' ? (
                    <Image
                      src={fileurl}
                      style={{ objectFit: 'contain' }}
                      width={64}
                      height={64}
                      placeholder={
                        <Image
                          preview={false}
                          src={placeholderImg}
                          width={64}
                          height={64}
                          style={{ background: 'white' }}
                        />
                      }
                    />
                  ) : (
                    <video src={fileurl} width={70} height={70} controls={false} />
                  );
                }}
              />

              <Column
                title="Name"
                dataIndex="itemname"
                key="itemname"
                align={'center'}
                ellipsis={{ showTitle: false }}
                render={(itemname) => {
                  return (
                    <Tooltip placement="topLeft" title={itemname}>
                      {itemname}
                    </Tooltip>
                  );
                }}
              />

              <Column title="Id" dataIndex="id" key="id" width={110} align={'center'} />

              <Column
                title="Contract Address"
                dataIndex="contractaddress"
                key="contractaddress"
                align={'center'}
                render={(contractaddress, record) => {
                  return (
                    <Tooltip placement="top" title={<span>{contractaddress}</span>}>
                      {`${contractaddress.slice(0, 6)}...${contractaddress.slice(-4)}`}
                    </Tooltip>
                  );
                }}
              />
            </Table>

            <span>upload cover on PC</span>
            <ImgCropUpload text="+ upload" aspect={4 / 3} />

            <span>upload cover on PC</span>
            <ImgCropUpload text="+ upload" aspect={4 / 7} />

            <span>background color</span>
            <SketchPicker />
          </Space>
        </Card>
      </Space>
    </PageContainer>
  );
};

export default index;
