import React from 'react';
import { ExclamationCircleOutlined, UserOutlined } from '@ant-design/icons';
import { PageContainer } from '@ant-design/pro-layout';
import { Modal, Table, Tag, Space, Switch, Select, Avatar, Image, Tooltip, Button } from 'antd';
import { useRequest } from 'umi';
import request from 'umi-request';

const { confirm } = Modal;
const { Option } = Select;

const { Column, ColumnGroup } = Table;

interface IAccountData {
  key: string;
  avator: string;
  userName: string;
  age: number;
  address: string;
  Email: string;
  creation: number;
}

const data = [
  {
    key: '1',
    avator: 'https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png',
    userName: 'John',
    age: 32,
    address: '0x26604A35B97D395a9711D839E89b44EFcc549B21',
    Email: '12345@gmail.com',
    creation: 10,
  },
  {
    key: '2',
    avator: 'https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png',
    userName: 'Jim',
    age: 42,
    address: '0x26604A35B97D395a9711D839E89b44EFcc549B21',
    Email: '12345@gmail.com',
    creation: 10,
  },
  {
    key: '3',
    avator: 'https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png',
    userName: 'Joe',
    age: 32,
    address: '0x26604A35B97D395a9711D839E89b44EFcc549B21',
    Email: '12345@gmail.com',
    creation: 10,
  },
];

function showPromiseConfirm(value: string) {
  confirm({
    title: `Do you want to ${value} these items?`,
    icon: <ExclamationCircleOutlined />,
    content: 'When clicked the OK button, this dialog will be closed after 1 second',
    onOk() {
      return new Promise((resolve, reject) => {
        setTimeout(Math.random() > 0.5 ? resolve : reject, 1000);
      }).catch(() => console.log('Oops errors!'));
    },
    onCancel() {},
  });
}

const index: React.FC = () => {
  return (
    <PageContainer>
      <Table dataSource={data}>
        <Column
          title="Avatar"
          dataIndex="avator"
          key="avator"
          render={(avator) => (
            <Avatar
              shape="square"
              size={64}
              //   src={<Image src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png" />}
              src={<Image src={avator} />}
            />
          )}
        />

        <Column title="User name" dataIndex="userName" key="userName" />

        <Column
          title="Address"
          dataIndex="address"
          key="address"
          render={(address) => (
            <Tooltip placement="topLeft" title={address}>
              <span>{`${address.slice(0, 6)}...${address.slice(-4)}`}</span>
            </Tooltip>
          )}
        />

        <Column title="Email" dataIndex="Email" key="Email" />

        <Column title="Creation" dataIndex="creation" key="creation" />

        <Column
          title="Identity"
          dataIndex="Identity"
          key="Identity"
          render={() => (
            <Select
              defaultValue="User"
              style={{ width: 120 }}
              onChange={(value) => {
                console.log(value);
              }}
            >
              <Option value="User">User</Option>
              <Option value="Administor">Administor</Option>
            </Select>
          )}
        />

        <Column
          title="Hide Creation"
          key="hide"
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
          render={() => (
            <Switch
              loading={false}
              defaultChecked={false}
              checkedChildren="disable"
              unCheckedChildren="active"
              onChange={(checked: boolean) => {}}
            />
          )}
        />
      </Table>
    </PageContainer>
  );
};

export default index;
