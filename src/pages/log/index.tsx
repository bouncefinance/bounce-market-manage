import React, { useEffect, useState } from 'react';
import { PageContainer } from '@ant-design/pro-layout';
import { Card, Input, Space, Table, Typography, DatePicker, Collapse, Tooltip } from 'antd';
import { useRequest } from 'umi';
import { getLog } from '@/services/log';
import type { ILogReponse } from '@/services/log/types';
import { LogOrderEnum } from '@/services/log/types';

import moment from 'moment';
import { CaretDownOutlined } from '@ant-design/icons';

const { Search } = Input;
const { RangePicker } = DatePicker;
const { Panel } = Collapse;

const Log: React.FC = () => {
  const [address, setAddress] = useState<string>('');
  const [startTime, setStartTime] = useState<string>('');
  const [endTime, setEndTime] = useState<string>('');
  const orderType = LogOrderEnum.descend;

  const columns = [
    {
      dataIndex: 'op_module',
      align: 'center',
      title: 'Module',
      width: 150,
      render: (text: any) => <p style={{ wordBreak: 'break-all' }}>{text}</p>,
    },
    {
      dataIndex: 'op_purpose',
      align: 'center',
      title: 'Action',
      width: 150,
      render: (text: any) => <p style={{ wordBreak: 'break-word' }}>{text}</p>,
    },
    {
      dataIndex: 'op_parameters',
      // align: 'center',
      title: 'Details',
      width: 250,
      render: (text: any) => {
        const keys = Object.keys(JSON.parse(text));
        const values = Object.values(JSON.parse(text));
        return (
          <Collapse
            ghost
            expandIconPosition="right"
            expandIcon={({ isActive }) => <CaretDownOutlined rotate={isActive ? 180 : 0} />}
          >
            <Panel header={`${keys[0]}: ${values[0]}`} key="1">
              {keys.slice(1).map((key, index) => (
                <Typography.Paragraph
                  key={key}
                  style={{ margin: 0, wordBreak: 'break-all' }}
                >{`${key}: ${values[index + 1] || '--'}`}</Typography.Paragraph>
              ))}
            </Panel>
          </Collapse>
        );
      },
    },
    {
      dataIndex: 'Address',
      align: 'center',
      title: 'Executor',
      width: 50,
      render: (text: any, record: ILogReponse) => (
        <Typography.Paragraph style={{ margin: 0 }}>
          <span>{`${record.username} `}</span>
          <Tooltip title={text}>{`(${text.replace(/^(.{6}).*(.{4})$/, '$1...$2')})`}</Tooltip>
        </Typography.Paragraph>
      ),
    },
    {
      dataIndex: 'created_at',
      align: 'center',
      title: 'created_at',
      width: 150,
      render: (text: any) => (
        <p style={{ wordBreak: 'break-all' }}>{moment.utc(text).format('YYYY-MM-DD, HH:mm:ss')}</p>
      ),
      sorter: (a: ILogReponse, b: ILogReponse) =>
        moment.utc(a.created_at).valueOf() - moment.utc(b.created_at).valueOf(),
      sortDirections: ['descend', 'ascend', 'descend'],
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
    if (value[0]) setStartTime(moment(value[0]).format('YYYY-MM-DD HH:mm:ss'));
    if (value[0]) setEndTime(moment(value[1]).format('YYYY-MM-DD HH:mm:ss'));
  };

  return (
    <PageContainer>
      <Card>
        <Space style={{ width: '100%' }} direction="vertical">
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
