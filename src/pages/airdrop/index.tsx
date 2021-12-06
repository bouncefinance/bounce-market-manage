import React, { useRef, useState } from 'react';
import { PageContainer } from '@ant-design/pro-layout';
import ProTable from '@ant-design/pro-table';
import type { ProColumns } from '@ant-design/pro-table';
import { Button, Tooltip, Typography } from 'antd';
import { isPre } from '@/tools/const';
import Image from '@/components/Image';
import { Link, useRequest } from 'umi';
import moment from 'moment';
import ExcelJS from 'exceljs';
import FileSaver from 'file-saver';
import QRCode from 'qrcode.react';
import { DownloadOutlined, PlusOutlined } from '@ant-design/icons';
import type { AirdropState, IQueryAllAirdropResponse } from '@/services/airdrop/types';
import { exportAirdropUserinfo, queryAllAirdrop } from '@/services/airdrop';

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

  const { run: getUserInfo } = useRequest(
    (id: number) => {
      return exportAirdropUserinfo({ dropsid: id });
    },
    { manual: true },
  );

  const handleDownloadBtnClick = (id: number) => {
    const workbook = new ExcelJS.Workbook(); // 创建文件
    const sheet = workbook.addWorksheet('sheet 1'); // 创建表
    sheet.columns = [
      // 设置表头
      {
        header: 'name',
        key: 'usernames',
        width: 20,
        style: { font: { size: 14 } },
      }, // 表头，对应数据属性为`key`值
      {
        header: 'image',
        key: 'useravatar',
        width: 150,
        style: { font: { size: 14 } },
      },
      {
        header: 'NFT name',
        key: 'nftname',
        width: 40,
        style: { font: { size: 14 } },
      },
      {
        header: 'token ID',
        key: 'tokenid',
        width: 10,
        style: { font: { size: 14 } },
      },
      {
        header: 'nft image',
        key: 'nftimgurl',
        width: 150,
        style: { font: { size: 14 } },
      },
      {
        header: 'password',
        key: 'verifycode',
        width: 40,
        style: { font: { size: 14 } },
      },
    ];

    getUserInfo(id).then((res) => {
      if (res) {
        sheet.addRows(res);

        workbook.xlsx.writeBuffer().then((result) => {
          const blob = new Blob([result], {
            type: 'applicationi/xlsx',
          });
          FileSaver.saveAs(blob, `airdrop ${id}.xlsx`);
        });
      }
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
      dataIndex: 'totalminted',
      title: 'Minted',
    },
    {
      dataIndex: 'created_at',
      title: '创建时间',
      render: (ts: any) => {
        return moment(ts).format('YYYY-MM-DD HH:mm');
      },
    },
    {
      dataIndex: 'opendate',
      title: '开抢时间',
      render: (unixTimeStamp: any) => {
        return unixTimeStamp === 0 ? '--' : moment(unixTimeStamp * 1000).format('YYYY-MM-DD HH:mm');
      },
    },
    {
      title: 'QR Code',
      render: (_, record) => {
        return (
          <QRCode
            id="qrcode"
            value={`https://${isPre && 'stage.'}fangible.com/airdrop/${record.id}/landing`}
            // value={`https://fangible.com/airdrop/11/landing`}
            size={100}
          />
        );
      },
    },
    {
      title: 'Action',
      render: (_, record) => {
        return (
          <Button
            onClick={() => {
              handleDownloadBtnClick(record.id);
            }}
          >
            <DownloadOutlined />
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
