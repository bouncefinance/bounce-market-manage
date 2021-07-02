/* eslint-disable no-nested-ternary */
import { Image, Skeleton, Card } from 'antd';

import {
  PlusOutlined,
  EditOutlined,
  VerticalAlignBottomOutlined,
  DeleteOutlined,
  SwapOutlined,
} from '@ant-design/icons';
import type { IpoolItem } from '.';
import React from 'react';

import placeholderImg from '@/assets/images/placeholderImg.svg';

const { Meta } = Card;

function RecommendPoolCard({
  loading,
  item,
  index,
  cardType,
  handleReset,
  handleEdit,
  handleAdd,
  setModalActionType,
}: {
  loading: boolean;
  item: IpoolItem | 0;
  index: number;
  cardType: 'Banner' | 'Fast Mover' | 'Brand';
  handleReset: any;
  handleEdit: any;
  handleAdd: any;
  setModalActionType: any;
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
      title={`No. ${cardType === 'Fast Mover' ? index - 2 : index + 1}`}
      cover={
        item.category === 'video' ? (
          <video controls src={item.fileurl} style={{ height: '156px' }} />
        ) : (
          <Image
            alt="image"
            src={item.fileurl}
            style={{ height: '156px', objectFit: 'contain' }}
            fallback={placeholderImg}
          />
        )
      }
      actions={[
        <SwapOutlined
          style={{
            fontSize: 22,
          }}
          key="swap"
          title="Swap"
          onClick={() => {
            setModalActionType(cardType === 'Banner' ? 'swap banner' : 'swap fast mover');
            handleEdit(index, item, cardType);
          }}
        />,
        <EditOutlined
          style={{
            fontSize: 22,
          }}
          key="edit"
          title="Edit"
          onClick={() => {
            setModalActionType('edit item');
            handleEdit(index, item, cardType);
          }}
        />,
        <DeleteOutlined
          style={{
            fontSize: 22,
          }}
          key="reset"
          title="Reset"
          onClick={() => {
            handleReset(item);
          }}
        />,
      ]}
    >
      <Meta
        description={
          <>
            <p>id: {item.poolid} </p>
            <p>name: {item.itemname}</p>
            <p>type: {item.pooltype === 1 ? 'Fix Swap' : 'English Auction'} </p>
          </>
        }
      />
    </Card>
  ) : (
    // Card with a plus
    <Card
      hoverable
      style={{
        height: 413,
        border: '2px dashed',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      }}
      onClick={() => {
        setModalActionType('add item');
        handleAdd(index, cardType);
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

export default RecommendPoolCard;
