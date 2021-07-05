import React from 'react';
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

  const menu0 = (
    <Menu>
      <Menu.Item>
        <a target="_blank" rel="noopener noreferrer" href="https://www.antgroup.com">
          1st menu item
        </a>
      </Menu.Item>
      <Menu.Item icon={<DownOutlined />} disabled>
        <a target="_blank" rel="noopener noreferrer" href="https://www.aliyun.com">
          2nd menu item (disabled)
        </a>
      </Menu.Item>
      <Menu.Item disabled>
        <a target="_blank" rel="noopener noreferrer" href="https://www.luohanacademy.com">
          3rd menu item (disabled)
        </a>
      </Menu.Item>
      <Menu.Item danger>a danger item</Menu.Item>
    </Menu>
  );

  const menu = (
    <Menu>
      <Table rowKey="id" {...accountTableProps } size='small' style={{width: 500}}>
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
          {/* <Select
          defaultValue="ID"
          onChange={(value) => {
            // setSearchType(value);
          }}
          style={{ width: 80 }}
        >
          <Option value="ID">ID</Option>
          <Option value="Name">Name</Option>
        </Select> */}

          <Search
            allowClear
            enterButton
            style={{ width: '82%' }}
            onSearch={(value) => {
              searchAccount({ current: 1, pageSize: 5 }, value);
              console.log('accountData: ', accountData);
              // setSearchResultList(undefined);
              // if (value !== '')
              //   if (searchType === 'Name') {
              //     setSearchResultList(
              //       pools.filter((pool) => {
              //         return pool.itemname.includes(value);
              //       }),
              //     );
              //   } else {
              //     setSearchResultList(
              //       pools.filter((pool) => {
              //         return pool.poolid === parseInt(value);
              //       }),
              //     );
              //   }
            }}
            onChange={() => {
              // setNewPoolItem(undefined);
            }}
          />
        </Input.Group>
        <Dropdown visible overlay={menu}>
            <span></span>
        </Dropdown>
        <Card bordered={false}></Card>
      </Space>
    </PageContainer>
  );
};

export default index;
