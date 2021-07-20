import { Card } from 'antd';
import React from 'react';
import Image from '@/components/Image';
import { DeleteOutlined, EditOutlined, SwapOutlined } from '@ant-design/icons';

const { Meta } = Card;

interface IItemCardProps {
  title: string;
  imgSrc?: string;
  onSwap: any;
  onEdit: any;
  onReset: any;
  description: React.ReactNode;
}

const ItemCard: React.FC<IItemCardProps> = ({
  title,
  imgSrc,
  onSwap,
  onEdit,
  onReset,
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
          onClick={onSwap}
        />,
        <EditOutlined
          style={{
            fontSize: 22,
          }}
          key="edit"
          title="Edit"
          onClick={onEdit}
        />,
        <DeleteOutlined
          style={{
            fontSize: 22,
          }}
          key="delete"
          title="Delete"
          onClick={onReset}
        />,
      ]}
    >
      <Meta description={description} />
    </Card>
  );
};

export default ItemCard;
