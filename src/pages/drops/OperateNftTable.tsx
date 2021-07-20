import React from 'react';
import { Table, Typography, Tooltip, Space, Button } from 'antd';
import Image from '@/components/Image';
import type { IPoolResponse } from '@/services/pool/types';
import { CaretDownOutlined, CaretUpOutlined, DeleteOutlined } from '@ant-design/icons';

interface IOperateNftTableProps {
  selectedPoolList: IPoolResponse[];
  setTempSelectedPoolList: any;
  setSelectedPoolList: any;
  selectedKeys: number[];
  setSelectedKeys: any;
  tempSelectedKeys: number[];
  setTempSelectedKeys: any;
}

const AddNftTable: React.FC<IOperateNftTableProps> = ({
  selectedPoolList,
  setTempSelectedPoolList,
  setSelectedPoolList,
  selectedKeys,
  setSelectedKeys,
  setTempSelectedKeys,
}: IOperateNftTableProps) => {
  const firstSelectedPoolId = selectedPoolList[0]?.id;
  const lastSelectedPoolId = selectedPoolList[selectedPoolList.length - 1]?.id;

  const moveUp = (currentPoolId: number) => {
    const currentPool = selectedPoolList.find((pool) => pool.id === currentPoolId);
    let currentPoolIndex;
    if (currentPool) {
      currentPoolIndex = selectedPoolList.indexOf(currentPool);
      const tempList = [...selectedPoolList];
      const tempNft = tempList[currentPoolIndex];
      tempList[currentPoolIndex] = tempList[currentPoolIndex - 1];
      tempList[currentPoolIndex - 1] = tempNft;
      setSelectedPoolList(tempList);
    }
  };

  const moveDown = (currentPoolId: number) => {
    const currentPool = selectedPoolList.find((pool) => pool.id === currentPoolId);
    let currentPoolIndex;
    if (currentPool) {
      currentPoolIndex = selectedPoolList.indexOf(currentPool);
      const tempList = [...selectedPoolList];
      const tempNft = tempList[currentPoolIndex];
      tempList[currentPoolIndex] = tempList[currentPoolIndex + 1];
      tempList[currentPoolIndex + 1] = tempNft;
      setSelectedPoolList(tempList);
    }
  };

  const remove = (record: IPoolResponse) => {
    const targetKeyIndex = selectedPoolList.indexOf(record);
    const resulKeysList = selectedKeys.filter((key) => {
      return key !== selectedKeys[targetKeyIndex];
    });

    setSelectedKeys(resulKeysList);
    setTempSelectedKeys(resulKeysList);

    const resultNftList = selectedPoolList.filter((nft) => {
      return nft !== record;
    });
    setSelectedPoolList(resultNftList);
    setTempSelectedPoolList(resultNftList);
  };

  const columns = [
    {
      dataIndex: 'id',
      title: 'ID',
      width: 60,
    },
    {
      dataIndex: 'fileurl',
      title: 'Cover',
      width: 80,
      render: (src: any) => (
        <Image height={60} width={60} style={{ objectFit: 'contain' }} src={src} />
      ),
    },
    {
      dataIndex: 'itemname',
      title: 'Name',
      width: 100,
      ellipsis: true,
    },
    {
      dataIndex: 'creator',
      title: 'Creator Account',
      width: 122,
      render: (text: any) => (
        <Typography.Paragraph style={{ margin: 0, width: 120 }} copyable={{ text }}>
          <Tooltip title={text}>{text.replace(/^(.{6}).*(.{4})$/, '$1...$2')}</Tooltip>
        </Typography.Paragraph>
      ),
    },
    {
      dataIndex: 'standard',
      title: 'Auction Type',
      width: 110,
      render: (standard: any) => (
        <Typography.Paragraph style={{ margin: 0, width: 100 }}>
          {standard === 0 ? 'Fixed Swap' : 'English Auction'}
        </Typography.Paragraph>
      ),
    },
    {
      dataIndex: 'actions',
      title: 'Action',
      width: 122,
      render: (_: string, record: IPoolResponse) => (
        <Space>
          <Button
            disabled={record.id === firstSelectedPoolId}
            size="small"
            onClick={() => {
              moveUp(record.id);
            }}
          >
            <CaretUpOutlined />
          </Button>
          <Button
            size="small"
            disabled={record.id === lastSelectedPoolId}
            onClick={() => {
              moveDown(record.id);
            }}
          >
            <CaretDownOutlined />
          </Button>
          <Button
            size="small"
            onClick={() => {
              remove(record);
              setSelectedKeys(
                selectedKeys.filter((key) => {
                  return key !== record.id;
                }),
              );
            }}
          >
            <DeleteOutlined />
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <Table
      rowKey={(record: IPoolResponse) => {
        return record.id + record.standard + Date.now(); // 在这里加上一个时间戳就可以了
      }}
      bordered
      dataSource={selectedPoolList}
      columns={columns}
      size="small"
      // style={{ width: 800 }}
    />
  );
};

export default AddNftTable;
