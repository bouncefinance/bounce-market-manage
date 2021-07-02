import React, { useState } from 'react';
import request from 'umi-request';
import './index.less';
import { Typography, message, Modal, Image, Tag, List } from 'antd';

import { CheckCircleFilled, CloseCircleOutlined } from '@ant-design/icons';

import { IPopularBrand } from '.';

function EditBrandModal({
  brands,
  clickedCardIndex,
  clickedCardType,
  modalAction,
  oldBrandItem,
  brandModalVisible,
  setBrandModalVisible,
  refresh,
}: {
  brands: IPopularBrand[];
  clickedCardIndex: number;
  clickedCardType: string;
  modalAction: string;
  oldBrandItem: IPopularBrand;
  brandModalVisible: boolean;
  setBrandModalVisible: any;
  refresh: any;
}) {
  const [newBrandItem, setNewBrandItem] = useState<IPopularBrand | undefined>();

  const handleSetBrandWeight = async () => {
    if (!newBrandItem) return;
    request
      .post('/api/bouadmin/main/auth/updateweight', {
        data: {
          id: newBrandItem?.id,
          popularweight: 10000 * Math.floor(oldBrandItem.popularweight / 10000),
        },
      })
      .then((res) => {
        if (res.code === 1) {
          request
            .post('/api/bouadmin/main/auth/updateweight', {
              data: {
                id: oldBrandItem?.id,
                popularweight: 10000 * Math.floor(newBrandItem?.popularweight / 10000),
              },
            })
            .then((res) => {
              if (res.code === 1) {
                message.success('success');
                refresh();
              } else {
                message.error('error');
              }
            });
        } else {
          message.error('error');
        }
      })
      .then(() => {});

    // console.log("---------------------")
    setBrandModalVisible(false);
  };

  return (
    <Modal
      title={`Select No.${clickedCardIndex + 1} brand`}
      centered
      visible={brandModalVisible}
      okButtonProps={{ disabled: newBrandItem ? false : true }}
      onOk={() => {
        if (newBrandItem) handleSetBrandWeight();
      }}
      onCancel={() => setBrandModalVisible(false)}
    >
      <div style={{ maxHeight: 600, overflow: 'auto' }}>
        <List
          itemLayout="vertical"
          size="large"
          dataSource={brands}
          renderItem={(item: IPopularBrand) => (
            <List.Item
              key={item.id}
              onClick={() => {
                if (oldBrandItem === item) return;
                if (newBrandItem === item) setNewBrandItem(undefined);
                else setNewBrandItem(item);
              }}
              extra={
                oldBrandItem &&
                oldBrandItem.id === item.id &&
                Math.floor(item.popularweight / 10000) > 0 ? (
                  <Tag
                    color="error"
                    style={{ fontSize: 16, marginTop: 60 }}
                    icon={<CloseCircleOutlined />}
                  >
                    Current Brand
                  </Tag>
                ) : newBrandItem === item ? (
                  <CheckCircleFilled
                    style={{
                      fontSize: 40,
                      color: '#52c41a',
                      marginTop: 50,
                    }}
                  />
                ) : (
                  <></>
                )
              }
            >
              <Image
                style={{ objectFit: 'contain' }}
                width={120}
                height={80}
                alt={item.brandname}
                src={item.imgurl}
                onClick={(e) => {
                  e.stopPropagation();
                }}
              />
              <Typography.Title level={4}>{item.brandname}</Typography.Title>
              <Tag color="#000">ID： {item.id}</Tag>
              {/* <Tag color="#000">Pool Weight： {item.poolweight}</Tag> */}
            </List.Item>
          )}
        />
      </div>
    </Modal>
  );
}

export default EditBrandModal;