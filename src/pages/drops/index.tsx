import React from 'react';
import { PageContainer } from '@ant-design/pro-layout';
import ProTable, { ProColumns } from '@ant-design/pro-table';
import { EditFilled, PlusOutlined } from '@ant-design/icons';
import { Button, Space, Tooltip, Typography } from 'antd';
import { getDrops } from '@/services/drops';
import { DropsState, IDropsResponse } from '@/services/drops/types';
import { Image } from 'antd';
import moment from 'moment';
import { useState } from 'react';
import { Link } from 'umi';

const tabs = [
  {
    tab: 'Coming soon',
    key: 1,
  },
  {
    tab: 'Live',
    key: 2,
  },
  {
    tab: 'Previous',
    key: 3,
  },
];
const columns: ProColumns<IDropsResponse>[] = [
  {
    dataIndex: 'id',
    title: 'ID',
    width: 60,
  },
  {
    dataIndex: 'coverimgurl',
    title: 'Cover',
    render: (src: any) => <Image width={40} preview={false} src={src} />,
  },
  {
    dataIndex: 'title',
    title: 'Title',
    width: 100,
  },
  {
    dataIndex: 'accountaddress',
    title: 'Artist Account',
    render: (text: any) => (
      <Typography.Paragraph style={{ margin: 0 }} copyable={{ text }}>
        <Tooltip title={text}>{text.replace(/^(.{6}).*(.{4})$/, '$1...$2')}</Tooltip>
      </Typography.Paragraph>
    ),
  },

  {
    dataIndex: 'nfts',
    title: 'Items',
  },
  {
    dataIndex: 'dropdate',
    title: 'Drop Date',
    render: (ts: any) => moment(ts).format('YYYY-MM-DD hh:mm'),
  },
  {
    dataIndex: 'operact',
    width: 100,
    render(_, item) {
      return (
        <Space>
          <Button icon={<EditFilled />} />
          <Button danger>Delete</Button>
        </Space>
      );
    },
  }, 
];
const DropsPage: React.FC = () => {
  const [state, setState] = useState<DropsState>(1);
  return (
    <PageContainer
      onTabChange={(key: any) => {
        setState(Number(key) as DropsState);
      }}
      tabList={tabs}
    >
      <ProTable
        rowKey="id"
        search={false}
        columns={columns}
        params={{ state }}
        request={async ({ pageSize: limit, current: offset, ...rest }) => {
          const { data, total } = await getDrops({
            offset,
            limit,
            ...rest,
          });
          return {
            success: true,
            total,
            data,
          };
        }}
        options={{
          search: {
            style: { width: 300 },
            name: 'accountaddress',
            placeholder: 'Input address',
          },
        }}
        toolBarRender={() => [
          <Link to="/drops/edit">
            <Button key="button" icon={<PlusOutlined />} type="primary">
              Add
            </Button>
          </Link>,
        ]}
      ></ProTable>
    </PageContainer>
  );
};

export default DropsPage;
