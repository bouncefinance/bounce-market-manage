import { Table, Image, Typography, Tooltip, Space, Button } from 'antd';
import React, { useEffect, useState } from 'react';
import { useRequest } from 'umi';
import request from 'umi-request';
import { Apis } from '@/services';
import { INftResponse } from '@/services/drops/types';
import {
  ArrowDownOutlined,
  ArrowUpOutlined,
  CaretDownOutlined,
  CaretUpOutlined,
  DeleteOutlined,
} from '@ant-design/icons';

import { ImgErrorUrl } from '@/tools/const';

interface IOperateNftTableProps {
  selectedNftList: INftResponse[];
  setTempSelectedNftList: any;
  setSelectedNftList: any;
  selectedKeys: number[];
  setSelectedKeys: any;
  tempSelectedKeys: number[];
  setTempSelectedKeys: any;
}

const AddNftTable: React.FC<IOperateNftTableProps> = ({
  selectedNftList,
  setTempSelectedNftList,
  setSelectedNftList,
  selectedKeys,
  setSelectedKeys,
  tempSelectedKeys,
  setTempSelectedKeys,
}) => {
  const moveUp = (originIndex: number, targetIndex: number) => {
    let tempList = [...selectedNftList];
    const tempNft = tempList[originIndex];
    tempList[originIndex] = tempList[targetIndex];
    tempList[targetIndex] = tempNft;
    // console.log('tempList: ', tempList);
    setSelectedNftList(tempList);
  };

  const moveDown = (originIndex: number, targetIndex: number) => {
    let tempList = [...selectedNftList];
    const tempNft = tempList[originIndex];
    tempList[originIndex] = tempList[targetIndex];
    tempList[targetIndex] = tempNft;
    // console.log('tempList: ', tempList);
    setSelectedNftList(tempList);
  };

  const remove = (record: INftResponse) => {
    // console.log('selectedNftList: ', selectedNftList);
    // console.log('index: ', selectedNftList.indexOf(record));
    // console.log('selectedKeys: ', selectedKeys);
    // console.log(
    //   'selectedKeys[selectedNftList.indexOf(record)]: ',
    //   selectedKeys[selectedNftList.indexOf(record)],
    // );

    const targetKeyIndex = selectedNftList.indexOf(record);
    // console.log('targetKeyIndex: ', targetKeyIndex);
    const resulKeysList = selectedKeys.filter((key) => {
      return key !== selectedKeys[targetKeyIndex];
    });
    // console.log('resulKeysList: ', resulKeysList);

    setSelectedKeys(resulKeysList);
    setTempSelectedKeys(resulKeysList);

    const resultNftList = selectedNftList.filter((nft) => {
      return nft !== record;
    });
    setSelectedNftList(resultNftList);
    setTempSelectedNftList(resultNftList);
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
      render: (text: string, record: INftResponse, index: number) => (
        <Space>
          <Button
            disabled={index === 0 ? true : false}
            size="small"
            onClick={() => {
              // console.log('text: ', text);
              // console.log('record: ', record);
              // console.log('index: ', index);
              moveUp(index, index - 1);
            }}
          >
            <CaretUpOutlined />
          </Button>
          <Button
            size="small"
            disabled={index === selectedNftList.length - 1 ? true : false}
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
      rowKey={(record) => {
        return record.id + record.standard + Date.now(); //在这里加上一个时间戳就可以了
      }}
      bordered
      dataSource={selectedNftList}
      columns={columns}
      size="small"
      // style={{ width: 800 }}
    />
  );
};

export default AddNftTable;
