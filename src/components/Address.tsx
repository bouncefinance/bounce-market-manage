import React from 'react';
import { Space, Tooltip } from 'antd';
import CopyToClipboard from 'react-copy-to-clipboard';
import { CopyOutlined } from '@ant-design/icons';

export const AddressCopyView = ({ address }: { address: string }) => {
  return <Space>
    <Tooltip placement="top" title={<span>{address}</span>}>
      {`${address.slice(0, 8)}...${address.slice(-6)}`}
    </Tooltip>
    <Tooltip placement="top" title={'Copy'}>
      <CopyToClipboard text={address}>
        <CopyOutlined />
      </CopyToClipboard>
    </Tooltip>
  </Space>
}