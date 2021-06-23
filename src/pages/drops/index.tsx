import React from 'react';
import { ExclamationCircleOutlined, UserOutlined } from '@ant-design/icons';
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

const getAccountList = function (likename: string = '', offset: number, limit: number = 7) {
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
    // data: itemData,
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
      defaultParams: [{ pageSize: 7, current: 1 }],
      formatResult(data: any) {
        return {
          list: data.data,
          total: data.total,
        };
      },
    },
  );

  return (
    <PageContainer>
      <Space direction={'vertical'} style={{ width: '100%' }}>
        <Search
          placeholder="input search text"
          allowClear
          onSearch={(value) => searchAccount({ current: 1, pageSize: 7 }, value)}
          style={{ width: '75%' }}
          size="middle"
        />
        <Card bordered={false}>
          <Table {...accountTableProps}>
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

            <Column
              title="Email"
              dataIndex="email"
              key="email"
              align={'center'}
              ellipsis={{ showTitle: false }}
              render={(email) =>
                email ? (
                  <Tooltip placement="topLeft" title={email}>
                    <span>{email}</span>
                  </Tooltip>
                ) : (
                  '--'
                )
              }
            />

            <Column
              title="Identity"
              dataIndex="Identity"
              key="Identity"
              align={'center'}
              render={() => (
                <Select
                  defaultValue="User"
                  style={{ width: 124 }}
                  onChange={(value) => {
                    console.log(value);
                  }}
                >
                  <Option value="User">User</Option>
                  <Option value="verifiedUser">Verified User</Option>
                </Select>
              )}
            />

            <Column
              title="Hide Creation"
              key="hide"
              width={110}
              align={'center'}
              render={() => (
                <Switch
                  loading={false}
                  defaultChecked={false}
                  checkedChildren="hiden"
                  unCheckedChildren="show"
                  onChange={(checked: boolean, event: Event) => {
                    // console.log("event: ", event)
                  }}
                />
              )}
            />

            <Column
              title="Disable"
              key="disable"
              width={100}
              align={'center'}
              render={() => (
                <Switch
                  loading={false}
                  defaultChecked={false}
                  checkedChildren="disable"
                  unCheckedChildren="active"
                  onChange={(checked: boolean, event: Event) => {
                    // console.log("event: ", event)
                  }}
                />
              )}
            />

            <Column
              title="Delete"
              key="delete"
              width={110}
              align={'center'}
              render={(record: IAccountData) => (
                <Button
                  danger
                  key="list-loadmore-delete"
                  onClick={() => {
                    handleDeleteAccount(record.id, reloadAccount);
                  }}
                >
                  Delete
                </Button>
              )}
            />
          </Table>
        </Card>
      </Space>
    </PageContainer>
  );
};

export default index;
