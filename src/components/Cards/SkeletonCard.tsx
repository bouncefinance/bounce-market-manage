import React from 'react';
import { Card, Skeleton } from 'antd';

const SkeletonCard: React.FC<{ height?: number }> = ({ height = 360 }) => {
  return (
    <Card style={{ height }}>
      <Skeleton active title={false} paragraph={{ rows: 1 }} />
      <Skeleton.Image style={{ width: '140px', height: '140px' }} />
      <Skeleton active paragraph={{ rows: 2 }} />
      <Skeleton.Button active shape="round" style={{ margin: 'auto' }} />
    </Card>
  );
};

export default SkeletonCard;
