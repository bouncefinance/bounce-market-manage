import React, { useRef, useState } from 'react';
import { PageContainer } from '@ant-design/pro-layout';
import ProTable from '@ant-design/pro-table';
import type { ProColumns } from '@ant-design/pro-table';
import { Button, message, Tooltip, Typography, Modal } from 'antd';
import Image from '@/components/Image';
import { Link } from 'umi';
import moment from 'moment';
import { ExclamationCircleOutlined, PlusOutlined } from '@ant-design/icons';
import type {
  AirdropState,
  IDelAirdropParams,
  IQueryAllAirdropResponse,
} from '@/services/airdrop/types';
import { delAirdrop, queryAllAirdrop } from '@/services/airdrop';

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

const AirDrop: React.FC = () => {
  const ref = useRef<ActionType>();
  const [airdropState, setAirdropState] = useState<AirdropState>(1);

  const handleDelete = (params: IDelAirdropParams) => {
    confirm({
      title: <span style={{ fontSize: 14 }}>{'Delete'}</span>,
      icon: <ExclamationCircleOutlined />,
      content: (
        <>
          <span style={{ fontSize: 20 }}>{'Are you sure you want to delete this airdrop ? '}</span>
          <span style={{ fontSize: 20, color: 'red' }}>{'This operation cannot be undone.'}</span>
        </>
      ),
      onOk() {
        delAirdrop(params).then((res) => {
          if (res.code === 1) {
            message.success('Deleted Successfully');
            ref?.current?.reload();
          }
        });
      },
    });
  };

  const columns: ProColumns<IQueryAllAirdropResponse>[] = [
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
      title: 'Airdrop name',
    },
    {
      dataIndex: 'nfts',
      title: 'Supply',
    },
    {
      dataIndex: 'created_at',
      title: '创建时间',
      render: (ts: any) => {
        return moment(ts).format('YYYY-MM-DD HH:mm');
      },
    },
    {
      title: 'Action',
      width: 100,
      render: (_, item) => {
        return (
          <Button
            danger
            onClick={() => {
              handleDelete({ id: item.id });
            }}
          >
            Delete
          </Button>
        );
      },
    },
  ];

  return (
    <PageContainer
      onTabChange={(key: string) => {
        setAirdropState(Number(key) as AirdropState);
      }}
      tabList={tabs}
      tabBarExtraContent={
        <Link key="add" to="/airdrop/edit">
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
        params={{ state: airdropState }}
        request={async ({ pageSize: limit, current: offset, ...rest }) => {
          const { data, total } = await queryAllAirdrop({
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

export default AirDrop;
