import React from 'react';
import { Table, Typography, Tooltip, Space, Button } from 'antd';
import Image from '@/components/Image';
import type { IPoolResponse } from '@/services/drops/types';
import { CaretDownOutlined, CaretUpOutlined, DeleteOutlined } from '@ant-design/icons';

import { ImgErrorUrl } from '@/tools/const';

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
  const moveUp = (originIndex: number, targetIndex: number) => {
    const tempList = [...selectedPoolList];
    const tempNft = tempList[originIndex];
    tempList[originIndex] = tempList[targetIndex];
    tempList[targetIndex] = tempNft;
    setSelectedPoolList(tempList);
  };

  const moveDown = (originIndex: number, targetIndex: number) => {
    const tempList = [...selectedPoolList];
    const tempNft = tempList[originIndex];
    tempList[originIndex] = tempList[targetIndex];
    tempList[targetIndex] = tempNft;
    setSelectedPoolList(tempList);
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
      width: 70,
      render: (src: any) => (
        <Image
          height={60}
          width={60}
          style={{ objectFit: 'contain' }}
          preview={false}
          src={src}
          fallback={ImgErrorUrl}
        />
      ),
    },
    {
      dataIndex: 'itemname',
      title: 'Name',
      width: 100,
    },
    {
      dataIndex: 'creator',
      title: 'Artist Account',
      render: (text: any) => (
        <Typography.Paragraph style={{ margin: 0, width: 120 }} copyable={{ text }}>
          <Tooltip title={text}>{text.replace(/^(.{6}).*(.{4})$/, '$1...$2')}</Tooltip>
        </Typography.Paragraph>
      ),
    },
    {
      dataIndex: 'standard',
      title: 'Auction Type',
      render: (standard: any) => (
        <Typography.Paragraph style={{ margin: 0, width: 100 }}>
          {standard === 0 ? 'Fixed Swap' : 'English Auction'}
        </Typography.Paragraph>
      ),
    },
    {
      dataIndex: 'actions',
      title: 'Action',
      width: 100,
      render: (text: string, record: IPoolResponse, index: number) => (
        <Space>
          <Button
            disabled={index === 0}
            size="small"
            onClick={() => {
              moveUp(index, index - 1);
            }}
          >
            <CaretUpOutlined />
          </Button>
          <Button
            size="small"
            disabled={index === selectedPoolList.length - 1}
            onClick={() => {
              moveDown(index, index + 1);
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
