import React from 'react';
import { PageContainer } from '@ant-design/pro-layout';
import { Card, Row, Col, Statistic } from 'antd';
// import { useRequest } from 'umi';
// import request from 'umi-request';

const index: React.FC = () => {
  return (
    <PageContainer>
      <p>Transaction data statistics(BSC)</p>
      <Row gutter={16} style={{ minWidth: 1240 }}>
        <Col span={4}>
          <Card>
            <Statistic groupSeparator="," title="NFTs on sale" value={256568} />
          </Card>
        </Col>
        <Col span={4}>
          <Card>
            <Statistic groupSeparator="," title="NFTs generated" value={256568} />
          </Card>
        </Col>
        <Col span={4}>
          <Card>
            <Statistic groupSeparator="," title="Total wallets(accounts)" value={112893} />
          </Card>
        </Col>
        <Col span={4}>
          <Card>
            <Statistic groupSeparator="," title="volumn (24h)" value={112893} />
          </Card>
        </Col>
        <Col span={4}>
          <Card>
            <Statistic groupSeparator="," title="volumn" value={112893} />
          </Card>
        </Col>
      </Row>
    </PageContainer>
  );
};

export default index;
