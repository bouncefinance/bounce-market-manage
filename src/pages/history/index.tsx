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

interface history {
  key: string;
  functionModule: string;
  operation: string;
  operator: string;
  date: string;
}

const data: history[] = [
  {
    key: '1',
    functionModule: 'Account and items - Delete And Hide',
    operation: 'Hide item, item id: 123',
    operator: 'Notename(0xb24D...6f8b)',
    date: Date(),
  },
  {
    key: '2',
    functionModule: 'Account and items - Delete And Hide',
    operation: 'Hide item, item id: 123',
    operator: 'Notename(0xb24D...6f8b)',
    date: Date(),
  },
  {
    key: '3',
    functionModule: 'Account and items - Delete And Hide',
    operation: 'Hide item, item id: 123',
    operator: 'Notename(0xb24D...6f8b)',
    date: Date(),
  },
];

const index: React.FC = () => {
  return (
    <PageContainer>
      <Card bordered={false}>
        <h1>History Page</h1>
        <Table dataSource={data} rowKey="key">
          <Column title="Function Module" dataIndex="functionModule" key="functionModule" />
          <Column title="Operation" dataIndex="operation" key="operation" />
          <Column title="Operator" dataIndex="operator" key="operator" />
          <Column title="Date" dataIndex="date" key="date" />
        </Table>
      </Card>
    </PageContainer>
  );
};

export default index;
