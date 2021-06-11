import React, { useState } from 'react';
import request from 'umi-request';
import { RECOMMEND_BRANDS_AMOUNT } from '@/tools/const';
import './index.less';
import {
  Typography,
  message,
  Modal,
  Select,
  Image,
  Skeleton,
  Tag,
  List,
  Input,
  Empty,
} from 'antd';

import {
  CheckCircleFilled,
  CloseCircleOutlined,
  StopOutlined,
} from '@ant-design/icons';

import { IPopularBrand } from '.';
const { Option } = Select;
const { Search } = Input;

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
  const [searchType, setSearchType] = useState<'Name' | 'ID'>('Name');
  const [searchResultList, setSearchResultList] = useState<IPopularBrand[]>();
  const [newBrandItem, setNewBrandItem] = useState<IPopularBrand | undefined>();

  console.log('brands: ', brands);

  const handleSetBrandWeight = async () => {
    request
      .post('/api/bouadmin/main/auth/updateweight', {
        data: {
          id: newBrandItem?.id,
          popularweight: 10000 * (RECOMMEND_BRANDS_AMOUNT - clickedCardIndex),
        },
      })
      .then((res) => {
        if (res.code === 1) {
          message.success('success');
          if (modalAction !== 'add and reset') {
            refresh();
          }
        } else {
          message.error('error');
        }
      })
      .then(() => {
        /**
         * 当前有位置有数据，旧的归零
         */
        if (modalAction === 'add and reset') {
          console.log('old poolid: ', oldBrandItem?.id);
          console.log('old weight: ', 0);
          request
            .post('/api/bouadmin/main/auth/updateweight', {
              data: {
                id: oldBrandItem?.id,
                popularweight: 0,
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
      });

    // console.log("---------------------")
    setSearchResultList(undefined);
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
                  brands.filter((brand) => {
                    return brand.brandname.includes(value);
                  }),
                );
              } else {
                setSearchResultList(
                  brands.filter((brand) => {
                    return brand.id === parseInt(value);
                  }),
                );
              }
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
              renderItem={(item: IPopularBrand) => (
                <List.Item
                  key={item.id}
                  onClick={() => {
                    if (oldBrandItem.id === item.id) setNewBrandItem(undefined);
                    else {
                      newBrandItem === item
                        ? setNewBrandItem(undefined)
                        : setNewBrandItem(item);
                    }
                  }}
                  extra={
                    oldBrandItem.id === item.id ? (
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
                  <Typography.Title level={4}>
                    {item.brandname}
                  </Typography.Title>
                  <Tag color="#000">ID： {item.id}</Tag>
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

export default EditBrandModal;
