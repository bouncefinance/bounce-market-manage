import React, { useState } from 'react';
import { Table, Typography, Tooltip, Space, Button } from 'antd';
import Image from '@/components/Image';
import type { IUserPool } from '@/services/pool/types';
import { CaretDownOutlined, CaretUpOutlined, DeleteOutlined } from '@ant-design/icons';
import { useRequest } from 'umi';
import { getAllPoolsByCreatorAddress } from '@/services/pool';
import AddNftModal from './AddNftModal';

export interface IDropPoolsInfo {
  orderList: number[];
  idList: number[];
}

interface IOperateNftTableProps {
  value?: IDropPoolsInfo;
  onChange?: (value: IDropPoolsInfo) => void;
  creatorAddress: string;
}

const AddNftTable: React.FC<IOperateNftTableProps> = ({
  value,
  onChange,
  creatorAddress,
}: IOperateNftTableProps) => {
  // console.log('value: ', value);
  // console.log('creatorAddress: ', creatorAddress);

  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);
  const [tableData, setTableData] = useState<IUserPool[]>([]);

  const triggerChange = (newPoolList: IUserPool[]) => {
    console.log('newPoolList: ', newPoolList);
    setTableData(newPoolList);
    onChange?.({
      orderList: newPoolList.length > 0 ? Array.from(new Array(newPoolList.length).keys()) : [],
      idList: newPoolList.map((pool) => pool.id),
    });
  };

  useRequest(
    () => {
      return getAllPoolsByCreatorAddress(creatorAddress);
    },
    {
      formatResult: (res) => {
        const pools = new Map<number, IUserPool>();
        res.data?.forEach((pool) => {
          pools.set(pool.id, pool);
        });
        return pools;
      },
      manual: false,
      refreshDeps: [creatorAddress],
      ready: Boolean(value),
      onSuccess: (data) => {
        console.log('value in onSuccess: ', value);

        if (!value?.idList) {
          return;
        }

        const tempArr: IUserPool[] = [];

        value.idList.forEach((id) => {
          tempArr.push(data.get(id));
        });

        triggerChange(tempArr);
        // setTableData(tempArr)
      },
    },
  );

  const handleMoveUp = (clickedIndex: number) => {
    if (clickedIndex - 1 < 0) {
      return;
    }
    const tempArr = [...tableData];
    const tempItem = tableData[clickedIndex];
    tempArr[clickedIndex] = tempArr[clickedIndex - 1];
    tempArr[clickedIndex - 1] = tempItem;

    triggerChange(tempArr);
  };

  const handleMoveDown = (clickedIndex: number) => {
    if (clickedIndex + 1 > tableData.length) {
      return;
    }

    const tempArr = [...tableData];
    const tempItem = tableData[clickedIndex];
    tempArr[clickedIndex] = tempArr[clickedIndex + 1];
    tempArr[clickedIndex + 1] = tempItem;

    triggerChange(tempArr);
  };

  const handleRemove = (clickedIndex: number) => {
    const tempArr = [...tableData].filter((_, index) => index !== clickedIndex);

    triggerChange(tempArr);
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
      render: (src: any, record: IUserPool) =>
        record.category === 'video' ? (
          <video height={60} width={60} src={src} controls={false} preload="metadata" />
        ) : (
          <Image height={60} width={60} src={src} />
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
      render: (_: string, __: IUserPool, index: number) => (
        <Space>
          <Button
            disabled={index === 0}
            size="small"
            onClick={() => {
              handleMoveUp(index);
            }}
          >
            <CaretUpOutlined />
          </Button>

          <Button
            size="small"
            disabled={index === tableData.length - 1}
            onClick={() => {
              handleMoveDown(index);
            }}
          >
            <CaretDownOutlined />
          </Button>

          <Button
            size="small"
            onClick={() => {
              handleRemove(index);
            }}
          >
            <DeleteOutlined />
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <div>
      <Button
        style={{ marginBottom: 8 }}
        onClick={() => {
          setIsModalVisible(true);
        }}
        disabled={!creatorAddress || creatorAddress.length <= 0}
      >
        Add
      </Button>

      <Table
        rowKey={(record: IUserPool) => {
          return record.id;
        }}
        bordered
        pagination={false}
        dataSource={tableData}
        columns={columns}
        size="small"
      />

      <AddNftModal
        creatorAddress={creatorAddress}
        isVisible={isModalVisible}
        setIsVisible={setIsModalVisible}
        value={value?.idList}
        onChange={(selectedRows) => {
          triggerChange(selectedRows);
        }}
      />
    </div>
  );
};

export default AddNftTable;
