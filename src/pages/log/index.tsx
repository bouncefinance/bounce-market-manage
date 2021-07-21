import React, { useEffect, useState } from 'react';
import { PageContainer } from '@ant-design/pro-layout';
import { Card, Input, Space, Table, Typography, Select, DatePicker } from 'antd';
import { useRequest } from 'umi';
import { getLog } from '@/services/log';
import type { LogOrderType } from '@/services/log/types';
import { LogOrderEnum } from '@/services/log/types';

import moment from 'moment';

const { Search } = Input;
const { RangePicker } = DatePicker;

const Log: React.FC = () => {
  const [address, setAddress] = useState<string>('');
  const [startTime, setStartTime] = useState<string>('');
  const [endTime, setEndTime] = useState<string>('');
  const [orderType, setOrderType] = useState<LogOrderType>(LogOrderEnum.descend);

  const columns = [
    {
      dataIndex: 'op_purpose',
      align: 'center',
      title: 'Function Module',
    },
    {
      dataIndex: 'op_purpose',
      align: 'center',
      title: 'Operation',
    },
    {
      dataIndex: 'op_purpose',
      align: 'center',
      title: 'Operator',
    },
    {
      dataIndex: 'created_at',
      align: 'center',
      title: 'Date',
    },
  ];

  const { tableProps, run: searchTranscations } = useRequest(
    ({ pageSize: limit, current: offset }) =>
      getLog({
        offset,
        limit,
        accountaddress: address,
        starttime: startTime,
        endtime: endTime,
        ordertype: orderType,
      }),
    {
      paginated: true,
      defaultParams: [{ pageSize: 10, current: 1 }, LogOrderEnum.descend],
      refreshDeps: [startTime, endTime, orderType],
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
      setStartTime('');
      setEndTime('');
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
          <Typography.Paragraph>{}</Typography.Paragraph>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
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

export default Log;
