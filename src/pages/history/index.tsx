import React from 'react';
import { ExclamationCircleOutlined } from '@ant-design/icons';
import { PageContainer } from '@ant-design/pro-layout';
import {
  Card,
  List,
  Image,
  Tag,
  Tabs,
  Input,
  Space,
  message,
  Modal,
  Button,
  Tooltip,
  Table,
} from 'antd';
import { useRequest } from 'umi';
import request from 'umi-request';

const { TabPane } = Tabs;
const { Search } = Input;
const { confirm } = Modal;
const { Column, ColumnGroup } = Table;

const data = [
  {
    key: '1',
    firstName: 'John',
    lastName: 'Brown',
    age: 32,
    address: 'New York No. 1 Lake Park',
    tags: ['nice', 'developer'],
  },
  {
    key: '2',
    firstName: 'Jim',
    lastName: 'Green',
    age: 42,
    address: 'London No. 1 Lake Park',
    tags: ['loser'],
  },
  {
    key: '3',
    firstName: 'Joe',
    lastName: 'Black',
    age: 32,
    address: 'Sidney No. 1 Lake Park',
    tags: ['cool', 'teacher'],
  },
];

const index: React.FC = () => {
  return (
    <PageContainer>
      <Card bordered={false}>
        <h1>History Page</h1>
        <Table dataSource={data}>
          <ColumnGroup title="Name">
            <Column
              title="First Name"
              dataIndex="firstName"
              key="firstName"
              filters={[
                {
                  text: 'Joe',
                  value: 'Joe',
                },
                {
                  text: 'Jim',
                  value: 'Jim',
                },
                {
                  text: 'Submenu',
                  value: 'Submenu',
                  children: [
                    {
                      text: 'Green',
                      value: 'Green',
                    },
                    {
                      text: 'Black',
                      value: 'Black',
                    },
                  ],
                },
              ]}
              onFilter={(value, record) => record.firstName.indexOf(value) === 0}
            />
            <Column title="Last Name" dataIndex="lastName" key="lastName" />
          </ColumnGroup>
          
          <Column
            title="Age"
            dataIndex="age"
            key="age"
            sorter={(a, b) => {
              console.log(a, b);
              return a.age - b.age;
            }}
          />

          <Column title="Address" dataIndex="address" key="address" />

        </Table>
      </Card>
    </PageContainer>
  );
};

export default index;
