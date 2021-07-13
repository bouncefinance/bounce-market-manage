import React from 'react';
import { Tabs } from 'antd';
import { PageContainer } from '@ant-design/pro-layout';

import OverviewTab from './overviewTab';
// import { Card, Row, Col, Statistic } from 'antd';
// import { useRequest } from 'umi';
// import request from 'umi-request';

const { TabPane } = Tabs;

const Overview: React.FC = () => {
  return (
    <PageContainer>
      <Tabs defaultActiveKey="1">
        <TabPane tab="Overview" key="1">
          <OverviewTab />
        </TabPane>
        <TabPane tab="Tab 2" key="2">
          Content of Tab Pane 2
        </TabPane>
      </Tabs>
    </PageContainer>
  );
};

export default Overview;
