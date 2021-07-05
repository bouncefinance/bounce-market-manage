import React from 'react';
import { Space, Tooltip, Typography } from 'antd';

export const AddressCopyView = ({ address }: { address: string }) => {
  return <Space>
    <Typography.Paragraph style={{ margin: 0 }} copyable={{ text: address }}>
      <Tooltip placement="top" title={<span>{address}</span>}>
        {`${address.slice(0, 8)}...${address.slice(-6)}`}
      </Tooltip>
    </Typography.Paragraph>
  </Space>
}