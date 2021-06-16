import { Image, Skeleton, Card } from 'antd';

import {
  PlusOutlined,
  EditOutlined,
  VerticalAlignBottomOutlined,
} from '@ant-design/icons';
import { IPopularBrand } from '.';
import React from 'react';
const { Meta } = Card;

function RecommendBrandCard({
  loading,
  item,
  index,
  handleReset,
  handleEdit,
  handleAdd,
}: {
  loading: boolean;
  item: IPopularBrand | 0;
  index: number;
  handleReset: any;
  handleEdit: any;
  handleAdd: any;
}) {
  return loading ? (
    <Card style={{ height: 360 }}>
      <Skeleton active title={false} paragraph={{ rows: 1 }} />
      <Skeleton.Image style={{ width: '140px', height: '140px' }} />
      <Skeleton active paragraph={{ rows: 2 }} />
      <Skeleton.Button active shape="round" style={{ margin: 'auto' }} />
    </Card>
  ) : item !== 0 ? (
    <Card
      // style={{ width: 260 }}
      title={`No. ${index + 1}`}
      cover={
        <Image
          alt="image"
          src={item.imgurl}
          style={{ height: '162px', objectFit: 'contain' }}
        />
      }
      actions={[
        <VerticalAlignBottomOutlined
          style={{
            fontSize: 22,
          }}
          key="reset"
          title="Reset"
          onClick={() => {
            handleReset(item);
          }}
        />,
        <EditOutlined
          style={{
            fontSize: 22,
          }}
          key="edit"
          title="Edit"
          onClick={() => {
            handleEdit(index, item, 'Fast Mover');
          }}
        />,
      ]}
    >
      <Meta
        description={
          <>
            <p>id: {item.id} </p>
            <p>name: {item.brandname}</p>
          </>
        }
      />
    </Card>
  ) : (
    // Card with a plus
    <Card
      hoverable
      style={{
        height: 360,
        border: '2px dashed',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      }}
      onClick={() => {
        handleAdd(index, 'Fast Mover');
      }}
    >
      <PlusOutlined
        title="Add"
        style={{
          fontSize: 76,
        }}
      />
    </Card>
  );
}

export default RecommendBrandCard;
