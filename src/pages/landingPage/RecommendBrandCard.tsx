import { Image, Skeleton, Card } from 'antd';

import { PlusOutlined, EditOutlined, VerticalAlignBottomOutlined, SwapOutlined, DeleteOutlined } from '@ant-design/icons';
import { ITopArtist } from '.';
import React from 'react';

import placeholderImg from '@/assets/images/placeholderImg.svg';

const { Meta } = Card;

function RecommendBrandCard({
  loading,
  item,
  index,
  // handleReset,
  // handleEdit,
  handleAdd,
  setModalActionType,
}: {
  loading: boolean;
  item: ITopArtist | 0;
  index: number;
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
  )
  //  : item !== 0 ? (
  //   <Card
  //     // style={{ width: 260 }}
  //     title={`No. ${index + 1}`}
  //     cover={
  //       <Image
  //         alt="image"
  //         src={item.imgurl}
  //         style={{ height: '162px', objectFit: 'contain' }}
  //         fallback={placeholderImg}
  //       />
  //     }
  //     actions={[
  //       <SwapOutlined
  //         style={{
  //           fontSize: 22,
  //         }}
  //         key="swap"
  //         title="Swap"
  //         onClick={() => {
  //           setModalActionType('swap brand');
  //           handleEdit(index, item, 'Brand');
  //         }}
  //       />,
  //       <EditOutlined
  //         style={{
  //           fontSize: 22,
  //         }}
  //         key="edit"
  //         title="Edit"
  //         onClick={() => {
  //           setModalActionType('edit brand');
  //           handleEdit(index, item, 'Brand');
  //         }}
  //       />,
  //       <DeleteOutlined
  //         style={{
  //           fontSize: 22,
  //         }}
  //         key="delete"
  //         title="Delete"
  //         onClick={() => {
  //           handleReset(item);
  //         }}
  //       />,
  //     ]}
  //   >
  //     <Meta
  //       description={
  //         <>
  //           <p>id: {item.id} </p>
  //           <p>name: {item.brandname}</p>
  //         </>
  //       }
  //     />
  //   </Card>
  // )  
  :(
    // Card with a plus
    <Card
      hoverable
      style={{
        height: 390,
        border: '2px dashed',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      }}
      onClick={() => {
        setModalActionType('add brand');
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
