import React, { useEffect, useState } from 'react';
import request from 'umi-request';
import { RECOMMEND_POOLS_AMOUNT } from '@/tools/const';
import './index.less';
import { Typography, message, Modal, Select, Image, Tag, List, Input, Empty } from 'antd';

import { CheckCircleFilled, CloseCircleOutlined } from '@ant-design/icons';

import type { IpoolItem } from '.';

function SwapPoolModal({
  recommendPools,
  clickedCardIndex,
  clickedCardType,
  modalAction,
  oldPoolItem,
  poolModalVisible,
  setPoolModalVisible,
  refresh,
}: {
  recommendPools: IpoolItem[];
  clickedCardIndex: number;
  clickedCardType: string;
  modalAction: string;
  oldPoolItem: IpoolItem;
  poolModalVisible: boolean;
  setPoolModalVisible: any;
  refresh: any;
}) {
  const [newPoolItem, setNewPoolItem] = useState<IpoolItem | undefined>();

  // console.log('oldPoolItem: ', oldPoolItem);
  // useEffect(() => {
  //   console.log('newPoolItem: ', newPoolItem);
  // }, [newPoolItem]);

  const handleSetPoolWeight = async () => {
    request
      // set target pool's weight
      .post('/api/bouadmin/main/auth/dealpoolinfo', {
        data: {
          poolid: newPoolItem?.poolid,
          weight: oldPoolItem?.poolweight,
          standard: newPoolItem?.pooltype === 2 ? 1 : 0,
        },
      })
      .then((res) => {
        if (res.code === 1) {
          request
            // set old pool's weight
            .post('/api/bouadmin/main/auth/dealpoolinfo', {
              data: {
                poolid: oldPoolItem?.poolid,
                weight: newPoolItem?.poolweight,
                standard: oldPoolItem?.pooltype === 2 ? 1 : 0,
              },
            })
            .then((res) => {
              if (res.code === 1) {
                message.success('success');
                refresh();
              } else {
                message.error('network error');
              }
            });
        } else {
          message.error('network error');
        }
      });

    // console.log("---------------------")
    setPoolModalVisible(false);
  };

  return (
    <Modal
      title={`Select No.${
        clickedCardType === 'Banner' ? clickedCardIndex + 1 : clickedCardIndex - 2
      } ${clickedCardType}`}
      centered
      visible={poolModalVisible}
      okButtonProps={{ disabled: !newPoolItem }}
      onOk={() => {
        if (newPoolItem) handleSetPoolWeight();
      }}
      onCancel={() => setPoolModalVisible(false)}
    >
      <div style={{ maxHeight: 600, overflow: 'auto' }}>
        <List
          itemLayout="vertical"
          size="large"
          dataSource={recommendPools}
          renderItem={(item: IpoolItem) => (
            <List.Item
              key={`${item.poolid}_${item.pooltype}`}
              onClick={() => {
                if (oldPoolItem === item) return;
                if (newPoolItem === item) setNewPoolItem(undefined);
                else setNewPoolItem(item);
              }}
              extra={
                oldPoolItem &&
                oldPoolItem.poolid === item.poolid &&
                oldPoolItem.pooltype === item.pooltype ? (
                  <Tag
                    color="error"
                    style={{ fontSize: 16, marginTop: 60 }}
                    icon={<CloseCircleOutlined />}
                  >
                    Current Brand
                  </Tag>
                ) : newPoolItem === item ? (
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
                // newPoolItem === item && (
                //   <CheckCircleFilled
                //     style={{
                //       fontSize: 40,
                //       color: '#52c41a',
                //       marginTop: 50,
                //     }}
                //   />
                // )
              }
            >
              {item.category === 'video' ? (
                <video src={item.fileurl} autoPlay={false} style={{ width: 80, height: 80 }} />
              ) : (
                <Image
                  style={{ objectFit: 'contain' }}
                  width={120}
                  height={80}
                  alt={item.itemname}
                  src={item.fileurl}
                  onClick={(e) => {
                    e.stopPropagation();
                  }}
                />
              )}
              <Typography.Title level={4}>{item.itemname}</Typography.Title>
              <Tag color="#000">Pool ID： {item.poolid}</Tag>
              <Tag color="#000">
                Pool Type： {item.pooltype === 2 ? 'Fixed Swap' : 'English Auction'}
              </Tag>
              {/* <Tag color="#000">Pool Weight： {item.poolweight}</Tag> */}
            </List.Item>
          )}
        />
      </div>
    </Modal>
  );
}

export default SwapPoolModal;
