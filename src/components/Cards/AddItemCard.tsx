import { PlusOutlined } from '@ant-design/icons';
import { Card } from 'antd';
import React from 'react';

const AddItemCard: React.FC<{ height?: number; width?: number; handleAdd: any }> = ({
  height = 360,
  width = 230,
  handleAdd,
}) => {
  return (
    <Card
      hoverable
      style={{
        height,
        width,
        border: '2px dashed',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      }}
      onClick={handleAdd}
    >
      <PlusOutlined
        title="Add"
        style={{
          fontSize: 76,
        }}
      />
    </Card>
  );
};

export default AddItemCard;
