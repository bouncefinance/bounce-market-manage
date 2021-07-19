import React from 'react';
import { Card, Col, Row, Statistic, Tabs } from 'antd';
import { PageContainer } from '@ant-design/pro-layout';

import OverviewTab from './overviewTab';
import { useRequest } from 'umi';
import { getOverview } from '@/services/overview';
import type { IOverviewResponse } from '@/services/overview/types';
// import { Card, Row, Col, Statistic } from 'antd';
// import { useRequest } from 'umi';
// import request from 'umi-request';

const { TabPane } = Tabs;

const Overview: React.FC = () => {
  const {
    data: overviewData,
    // loading: overviewLoading,
    // run: searchOverview,
  } = useRequest(
    () => {
      return getOverview();
    },
    {
      cacheKey: 'overview',
      formatResult(data: { code: number; data: IOverviewResponse }) {
        return data.data;
      },
    },
  );

  return (
    <PageContainer>
      <>
        <h2>Transaction data statistics(BSC)</h2>
        <Row gutter={[18, 24]}>
          <Col flex="0 0 auto">
            <Card>
              <Statistic
                style={{ height: 63 }}
                groupSeparator=","
                title="NFTs on sale"
                value={overviewData?.nftonsale}
              />
            </Card>
          </Col>
          <Col flex="0 0 auto">
            <Card>
              <Statistic
                style={{ height: 63 }}
                groupSeparator=","
                title="NFTs generated"
                value={overviewData?.nftnum}
              />
            </Card>
          </Col>
          <Col flex="0 0 auto">
            <Card>
              <Statistic
                style={{ height: 63 }}
                groupSeparator=","
                title="Total wallets(accounts)"
                value={overviewData?.accountnum}
              />
            </Card>
          </Col>
          <Col flex="0 0 auto">
            <Card>
              <Statistic
                prefix={'$'}
                style={{ height: 63 }}
                groupSeparator=","
                title="volumn (24h)"
                value={overviewData?.vol24h}
              />
            </Card>
          </Col>
          <Col flex="0 0 auto">
            <Card>
              <Statistic
                prefix={'$'}
                style={{ height: 63 }}
                groupSeparator=","
                title="volumn"
                value={overviewData?.volall}
              />
            </Card>
          </Col>
        </Row>
      </>
    </PageContainer>
  );
};

export default Overview;
