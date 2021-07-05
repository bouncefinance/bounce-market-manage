import React, { useEffect, useState } from 'react';
import request from 'umi-request';
import { RECOMMEND_POOLS_AMOUNT } from '@/tools/const';
import './index.less';
import { Typography, message, Modal, Select, Image, Tag, List, Input, Empty } from 'antd';

import { CheckCircleFilled, CloseCircleOutlined } from '@ant-design/icons';

import type { IpoolItem } from '.';

const { Option } = Select;
const { Search } = Input;

function EditPoolModal({
  pools,
  clickedCardIndex,
  clickedCardType,
  modalAction,
  oldPoolItem,
  poolModalVisible,
  setPoolModalVisible,
  refresh,
}: {
  pools: IpoolItem[];
  clickedCardIndex: number;
  clickedCardType: string;
  modalAction: string;
  oldPoolItem: IpoolItem;
  poolModalVisible: boolean;
  setPoolModalVisible: any;
  refresh: any;
}) {
  const [searchType, setSearchType] = useState<'Name' | 'ID'>('ID');
  const [searchResultList, setSearchResultList] = useState<IpoolItem[]>();
  const [newPoolItem, setNewPoolItem] = useState<IpoolItem | undefined>();

  // console.log('in EditPoolModal');
  // console.log('modalAction: ', modalAction);
  // console.log('oldPoolItem: ', oldPoolItem);
  // useEffect(() => {
  //   console.log('newPoolItem: ', newPoolItem);
  // }, [newPoolItem]);

  const handleSetPoolWeight = async () => {
    request
      .post('/api/bouadmin/main/auth/dealpoolinfo', {
        data: {
          poolid: newPoolItem?.poolid,
          weight: RECOMMEND_POOLS_AMOUNT - clickedCardIndex,
          standard: newPoolItem?.pooltype === 2 ? 1 : 0,
        },
      })
      .then((res) => {
        if (res.code === 1) {
          message.success('success');
          if (modalAction !== 'add and reset') {
            refresh();
          }
        } else {
          message.error('network error');
        }
      });

    /**
     * 当前有位置有数据，旧的归零
     */
    if (modalAction === 'add and reset') {
      request
        .post('/api/bouadmin/main/auth/dealpoolinfo', {
          data: {
            poolid: oldPoolItem?.poolid,
            weight: 0,
            standard: oldPoolItem?.pooltype === 2 ? 1 : 0,
          },
        })
        .then((res) => {
          if (res.code === 1) {
            refresh();
            // message.success('reset success');
          } else {
            // message.error('reset error');
          }
        });
    }
    // console.log("---------------------")
    setSearchResultList(undefined);
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
      <Input.Group compact style={{ padding: '16px 0 16px 24px' }}>
        <Select
          defaultValue="ID"
          onChange={(value) => {
            setSearchType(value);
          }}
          style={{ width: 80 }}
        >
          <Option value="ID">ID</Option>
          <Option value="Name">Name</Option>
        </Select>
        <Search
          allowClear
          enterButton
          style={{ width: '82%' }}
          onSearch={(value) => {
            setSearchResultList(undefined);
            if (value !== '')
              if (searchType === 'Name') {
                setSearchResultList(
                  pools.filter((pool) => {
                    return pool.itemname.includes(value);
                  }),
                );
              } else {
                setSearchResultList(
                  pools.filter((pool) => {
                    return pool.poolid === parseInt(value, 10);
                  }),
                );
              }
          }}
          onChange={() => {
            setNewPoolItem(undefined);
          }}
        />
      </Input.Group>

      {searchResultList &&
        (searchResultList?.length > 0 ? (
          <div style={{ maxHeight: 600, overflow: 'auto' }}>
            <List
              itemLayout="vertical"
              size="large"
              dataSource={searchResultList}
              renderItem={(item: IpoolItem) => (
                <List.Item
                  key={`${item.poolid}_${item.pooltype}`}
                  onClick={() => {
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
        ) : (
          <Empty />
        ))}
    </Modal>
  );
}

export default EditPoolModal;
