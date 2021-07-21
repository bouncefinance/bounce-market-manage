import React, { useEffect, useState } from 'react';
import { PageContainer } from '@ant-design/pro-layout';
import { Card, DatePicker, Input, Select, Space, Table, Tooltip, Typography } from 'antd';
import type { TxnFilterType } from '@/services/transcation/types';
import { TxnFilterEnum } from '@/services/transcation/types';
import { getTranscations } from '@/services/transcation';
import { useRequest } from '@/.umi/plugin-request/request';

import Image from '@/components/Image';
import moment from 'moment';

const { Option } = Select;
const { Search } = Input;
const { RangePicker } = DatePicker;

const Transactions: React.FC = () => {
  const [filter, setFilter] = useState<TxnFilterType>(TxnFilterEnum.from);
  const [address, setAddress] = useState<string>('');
  const [startTime, setStartTime] = useState<number>();
  const [endTime, setEndTime] = useState<number>();

  const columns = [
    {
      dataIndex: 'auction_type',
      className: 'column-type',
      align: 'center',
      title: 'Type',
      render: (type: any) => (type === 1 ? 'Fixed Swap' : 'English Auction'),
    },
    {
      title: 'Item',
      align: 'center',
      children: [
        {
          dataIndex: 'itemurl',
          align: 'center',
          title: 'Image',
          render: (url: any) => <Image width={50} height={50} preview src={url} />,
        },
        {
          dataIndex: 'Itemname',
          align: 'center',
          title: 'Name',
          render: (text: any) => (
            <Typography.Paragraph style={{ margin: 0 }}>
              {text.length > 20 ? (
                <Tooltip title={text}>{text.replace(/^(.{20}).*$/, '$1...')}</Tooltip>
              ) : (
                text
              )}
            </Typography.Paragraph>
          ),
        },
        {
          dataIndex: 'token_id',
          align: 'center',
          title: 'Token Id',
        },
      ],
    },
    {
      dataIndex: 'price',
      align: 'center',
      title: 'Price (BNB)',
      render: (text: any) => `${text / 1e18}`,
    },
    {
      dataIndex: 'quantity',
      align: 'center',
      title: 'Quantity',
      render: (_: any, record: any) => `${record.quantity}/${record.supply}`,
    },
    {
      dataIndex: 'from',
      align: 'center',
      title: 'From',
      render: (text: any) => (
        <Typography.Paragraph style={{ margin: 0 }} copyable={{ text }}>
          <Tooltip title={text}>{text.replace(/^(.{6}).*(.{4})$/, '$1...$2')}</Tooltip>
        </Typography.Paragraph>
      ),
    },
    {
      dataIndex: 'to',
      align: 'center',
      title: 'To',
      render: (text: any) => (
        <Typography.Paragraph style={{ margin: 0 }} copyable={{ text }}>
          <Tooltip title={text}>{text.replace(/^(.{6}).*(.{4})$/, '$1...$2')}</Tooltip>
        </Typography.Paragraph>
      ),
    },
    {
      dataIndex: 'ctime',
      align: 'center',
      title: 'Date',
      render: (ctime: any) => moment(ctime * 1000).format('YYYY-MM-DD HH:mm:ss'),
    },
  ];

  const { tableProps, run: searchTranscations } = useRequest(
    ({ pageSize: limit, current: offset }) =>
      getTranscations({
        offset,
        limit,
        filter,
        accountaddress: address,
        starttime: startTime,
        endtime: endTime,
      }),
    {
      paginated: true,
      defaultParams: [{ pageSize: 10, current: 1 }],
      refreshDeps: [startTime, endTime],
      formatResult(data: any) {
        return {
          list: data.data,
          total: data.total,
        };
      },
    },
  );

  useEffect(() => {
    if (address === '') searchTranscations({ current: 1, pageSize: 10 });
  }, [address]);

  const onChange = (values: any[] | null) => {
    if (values === null) {
      setStartTime(undefined);
      setEndTime(undefined);
    }
  };

  const onOk = (value: any) => {
    if (value[0]) setStartTime(value[0].unix());
    if (value[1]) setEndTime(value[1].unix());
  };

  return (
    <PageContainer>
      <Card style={{minWidth: 1200}}>
        <Space style={{ width: '100%' }} direction="vertical">
          <Typography.Paragraph>{}</Typography.Paragraph>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <Input.Group>
              <Select
                style={{ width: 80 }}
                defaultValue={TxnFilterEnum.from}
                onChange={(value) => {
                  setFilter(value);
                }}
              >
                <Option value={TxnFilterEnum.from}>From</Option>
                <Option value={TxnFilterEnum.to}>To</Option>
              </Select>
              <Search
                placeholder="Input address"
                allowClear
                onChange={(e) => {
                  setAddress(e.target.value);
                }}
                onSearch={() => searchTranscations({ current: 1, pageSize: 10 })}
                style={{ maxWidth: 400 }}
                size="middle"
              />
            </Input.Group>

            <RangePicker
              style={{ width: 360 }}
              showTime={{ format: 'HH:mm' }}
              format="YYYY-MM-DD HH:mm"
              onChange={onChange}
              onOk={onOk}
            />
          </div>
          <Table rowKey="id" {...tableProps} columns={columns} bordered />
        </Space>
      </Card>
    </PageContainer>
  );
};

export default Transactions;
