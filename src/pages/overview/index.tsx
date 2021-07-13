import React from 'react';
import { PageContainer } from '@ant-design/pro-layout';
// import { Card, Row, Col, Statistic } from 'antd';
// import { useRequest } from 'umi';
// import request from 'umi-request';

const tabs = [
  {
    tab: 'Overview',
    key: 1,
  },
  {
    tab: 'Transactions',
    key: 2,
  },
];

const overviewTab: React.FC = () => {
  return <PageContainer tabList={tabs}></PageContainer>;
};

export default overviewTab;
