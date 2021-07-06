import React, { useRef } from 'react';
import { PageContainer } from '@ant-design/pro-layout';
import ProTable, { ProColumns } from '@ant-design/pro-table';
import { EditFilled, ExclamationCircleOutlined, PlusOutlined } from '@ant-design/icons';
import { Button, message, Space, Tooltip, Typography, Image, Modal } from 'antd';
import { getDrops, deleteOneDrop } from '@/services/drops';
import { DropsState, IDropsResponse } from '@/services/drops/types';
import moment from 'moment';
import { useState } from 'react';
import { Link } from 'umi';

const { confirm } = Modal;

interface ActionType {
  reload: (resetPageIndex?: boolean) => void;
  reloadAndRest: () => void;
  reset: () => void;
  clearSelected?: () => void;
  startEditable: (rowKey: any) => boolean;
  cancelEditable: (rowKey: any) => boolean;
}

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

interface ActionType {
  reload: (resetPageIndex?: boolean) => void;
}

const DropsPage: React.FC = () => {
  const [state, setState] = useState<DropsState>(1);

  const ref = useRef<ActionType>();

  const handleDelete = (dropsid: number) => {
    confirm({
      icon: <ExclamationCircleOutlined />,
      title: 'Do you want to delete this item?',
      onOk() {
        deleteOneDrop(dropsid).then((res) => {
          if (res.code === 1) {
            message.success('Delete Success');
            ref?.current?.reload();
          }
        });
      },
    });
  };

  const handleCloseDrop = (dropsid: number) => {
    confirm({
      title: <span style={{fontSize: 14}}>{'Close Drop'}</span>,
      // icon: <ExclamationCircleOutlined />,
      content: (
        <>
          <span style={{fontSize: 20}}>{'Confirm that you want to close this Drop？'}</span>
          <span style={{ fontSize: 20, color: 'red' }}>{'This operation cannot withdraw.'}</span>
        </>
      ),
      onOk() {
        deleteOneDrop(dropsid).then((res) => {
          if (res.code === 1) {
            message.success('Delete Success');
            ref?.current?.reload();
          }
        });
      },
    });
  };

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
      render: (ts: any) => {
        return moment(ts * 1000).format('YYYY-MM-DD hh:mm');
      },
    },
    {
      dataIndex: 'operact',
      width: 100,
      render(_, item) {
        return (
          <Space>
            {/* <Button
              danger
              onClick={() => {
                handleCloseDrop(item.id);
              }}
            >
              Close Drop
            </Button> */}
            {/* <Link to={`/drops/edit/?id=${item.id}`}>
              <Button icon={<EditFilled />} />
            </Link> */}
            <Button
              danger
              onClick={() => {
                handleDelete(item.id);
              }}
            >
              Delete
            </Button>
          </Space>
        );
      },
    },
  ];

  return (
    <PageContainer
      onTabChange={(key: any) => {
        setState(Number(key) as DropsState);
      }}
      tabList={tabs}
    >
      <ProTable
        actionRef={ref as any}
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
