import React, { useEffect, useState } from 'react';
import { PageContainer } from '@ant-design/pro-layout';
import { Card, DatePicker, Input, Select, Space, Table, Tooltip, Typography } from 'antd';
import type { TxnFilterType } from '@/services/transcation/types';
import { TxnFilterEnum } from '@/services/transcation/types';
import { getTranscations } from '@/services/transcation';
import { useRequest } from '@/.umi/plugin-request/request';

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
      title: 'From',
      children: [
        {
          dataIndex: 'to',
          title: 'To',
          render: (text: any) => (
            <Typography.Paragraph style={{ margin: 0 }} copyable={{ text }}>
              <Tooltip title={text}>{text.replace(/^(.{6}).*(.{4})$/, '$1...$2')}</Tooltip>
            </Typography.Paragraph>
          ),
        },
      ],
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
      <Card>
        <Space style={{ width: '100%' }} direction="vertical">
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
          <Table {...tableProps} columns={columns} />
        </Space>
      </Card>
    </PageContainer>
  );
};

export default Transactions;
