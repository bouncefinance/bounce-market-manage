import React, { useRef } from 'react';
import type { FC } from 'react';
import { PageContainer } from '@ant-design/pro-layout';
import ProTable from '@ant-design/pro-table';
import type { ProColumns } from '@ant-design/pro-table';
import { ExclamationCircleOutlined, PlusOutlined } from '@ant-design/icons';
import { Button, message, Space, Tooltip, Typography, Modal } from 'antd';
import moment from 'moment';
import { useState } from 'react';
import { Link } from 'umi';
import Image from '@/components/Image';
import { delBlindBox, queryAllBlindBox } from '@/services/blindBoxs';
import type {
  BlindBoxState,
  IDelBlindBoxParams,
  IQueryAllBlindBoxResponse,
} from '@/services/blindBoxs/types';
import { CURRENCY } from '@/tools/const';

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
    tab: 'Coming Soon',
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

// interface ActionType {
//   reload: (resetPageIndex?: boolean) => void;
// }

const BlindBoxsPage: FC = () => {
  const [state, setState] = useState<BlindBoxState>(1);

  const ref = useRef<ActionType>();

  const handleDelete = (boxId: IDelBlindBoxParams) => {
    confirm({
      title: <span style={{ fontSize: 14 }}>{'Delete'}</span>,
      icon: <ExclamationCircleOutlined />,
      content: (
        <>
          <span style={{ fontSize: 20 }}>
            {'Are you sure you want to delete this blind box ? '}
          </span>
          <span style={{ fontSize: 20, color: 'red' }}>{'This operation cannot be undone.'}</span>
        </>
      ),
      onOk() {
        delBlindBox(boxId).then((res) => {
          if (res.code === 1) {
            message.success('Deleted Successfully');
            ref?.current?.reload();
          }
        });
      },
    });
  };

  const columns: ProColumns<IQueryAllBlindBoxResponse>[] = [
    {
      dataIndex: 'id',
      title: 'ID',
      width: 60,
    },
    {
      dataIndex: 'coverimgurl',
      title: 'Cover',
      render: (src: any) => {
        return <Image width={40} height={40} src={src} preview />;
      },
    },
    {
      dataIndex: 'collection',
      title: 'Collection',
      render: (text: any) => (
        <Typography.Paragraph style={{ margin: 0 }} copyable={{ text }}>
          <Tooltip title={text}>{text.replace(/^(.{6}).*(.{4})$/, '$1...$2')}</Tooltip>
        </Typography.Paragraph>
      ),
    },
    {
      dataIndex: 'title',
      title: '盲盒name',
      width: 100,
    },
    {
      dataIndex: 'nfts',
      title: 'Items',
    },
    {
      dataIndex: 'price',
      title: 'Price',
      render: (text: any) => <span>{`${text} ${CURRENCY[sessionStorage.symbol]}`}</span>,
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
      dataIndex: 'dropdate',
      title: 'Drop Date',
      render: (ts: any) => {
        return moment(ts * 1000).format('YYYY-MM-DD HH:mm');
      },
    },
    {
      dataIndex: 'opendate',
      title: 'Sale Date',
      render: (ts: any) => {
        return moment(ts * 1000).format('YYYY-MM-DD HH:mm');
      },
    },
    {
      title: 'Action',
      width: 100,
      render(_, item) {
        return (
          <Space>
            <Link to={`/blindboxs/edit/?id=${item.id}`}>
              <Button>Edit</Button>
            </Link>
            {state === 1 && (
              <Button
                danger
                onClick={() => {
                  handleDelete({ id: item.id });
                }}
              >
                Delete
              </Button>
            )}
          </Space>
        );
      },
    },
  ];

  return (
    <PageContainer
      onTabChange={(key: string) => {
        setState(Number(key) as BlindBoxState);
      }}
      tabList={tabs}
      tabBarExtraContent={
        <Link key="add" to="/blindboxs/edit">
          <Button icon={<PlusOutlined />} type="primary">
            Add
          </Button>
        </Link>
      }
    >
      <ProTable
        actionRef={ref as any}
        rowKey="id"
        search={false}
        columns={columns}
        params={{ state }}
        request={async ({ pageSize: limit, current: offset, ...rest }) => {
          const { data, total } = await queryAllBlindBox({
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
      />
    </PageContainer>
  );
};

export default BlindBoxsPage;
