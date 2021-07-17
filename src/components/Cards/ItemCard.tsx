import { Card } from 'antd';
import React from 'react';
import Image from '@/components/Image';
import { DeleteOutlined, EditOutlined, SwapOutlined } from '@ant-design/icons';

const { Meta } = Card;

interface IItemCardProps {
  title: string;
  imgSrc?: string;
  handleSwap: any;
  handleEdit: any;
  handleReset: any;
  description: React.ReactNode;
}

const ItemCard: React.FC<IItemCardProps> = ({
  title,
  imgSrc,
  handleSwap,
  handleEdit,
  handleReset,
  description,
}) => {
  return (
    <Card
      // style={{ width: 260 }}
      title={title}
      cover={
        <Image height={200} width={230} style={{ objectFit: 'contain' }} alt="image" src={imgSrc} />
      }
      actions={[
        <SwapOutlined
          style={{
            fontSize: 22,
          }}
          key="swap"
          title="Swap"
          onClick={handleSwap}
        />,
        <EditOutlined
          style={{
            fontSize: 22,
          }}
          key="edit"
          title="Edit"
          onClick={handleEdit}
        />,
        <DeleteOutlined
          style={{
            fontSize: 22,
          }}
          key="delete"
          title="Delete"
          onClick={handleReset}
        />,
      ]}
    >
      <Meta description={description} />
    </Card>
  );
};

export default ItemCard;
