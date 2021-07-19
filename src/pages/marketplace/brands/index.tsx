/* eslint-disable no-nested-ternary */
import React, { useEffect, useState } from 'react';
import { useRequest } from '@/.umi/plugin-request/request';
import { getBrandsListByFilter, getTopBrands, updateBrandWeight } from '@/services/brand';
import type { BrandFilterType, IBrandResponse, modalActionType } from '@/services/brand/types';
import { BrandFilterEnum } from '@/services/brand/types';
import { ExclamationCircleOutlined } from '@ant-design/icons';
import { PageContainer } from '@ant-design/pro-layout';
import { Card, Col, Row, Modal, message } from 'antd';

import { RECOMMEND_BRANDS_AMOUNT } from '@/tools/const';
import SkeletonCard from '@/components/Cards/SkeletonCard';
import AddItemCard from '@/components/Cards/AddItemCard';
import ItemCard from '@/components/Cards/ItemCard';
import BrandModal from './BrandModal';
import SwapBrandModal from './SwapBrandModal';

const { confirm } = Modal;

const Collections: React.FC = () => {
  let clickedBrandIndex: number;
  // let targetWeight: number

  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [modalAction, setModalAction] = useState<modalActionType>();
  const [clickedBrandId, setClickedBrandId] = useState<number>();
  const [targetWeight, setTargetWeight] = useState<number>();

  const [brandSearchType, setBrandSearchType] = useState<BrandFilterType>(BrandFilterEnum.likestr);

  const {
    data: topBrands,
    loading: topBrandsLoading,
    refresh: reloadTopBrands,
  } = useRequest(() => {
    return getTopBrands(RECOMMEND_BRANDS_AMOUNT);
  });

  const { tableProps, run: searchAllBrands } = useRequest(
    ({ pageSize: limit, current: offset }, searchText) =>
      getBrandsListByFilter(brandSearchType, searchText, (offset - 1) * limit, limit),
    {
      manual: true,
      paginated: true,
      defaultParams: [{ pageSize: 6, current: 1 }],
      formatResult(data: any) {
        return {
          list: data.data,
          total: data.total,
        };
      },
    },
  );

  useEffect(() => {
    if (modalVisible && modalAction !== 'swap') searchAllBrands({ pageSize: 6, current: 1 });
  }, [modalVisible, modalAction]);

  const brandResultList: (IBrandResponse | 0)[] = new Array(RECOMMEND_BRANDS_AMOUNT).fill(0);
  topBrands?.forEach((item) => {
    if (item.popularweight >= 10000)
      brandResultList[RECOMMEND_BRANDS_AMOUNT - Math.floor(item.popularweight / 10000)] = item;
  });

  const resetBrandWeight = async (id: number) => {
    const res = await updateBrandWeight({ id, popularweight: 0 });
    if (res.code === 1) {
      message.success('reset brand success');
      reloadTopBrands();
    } else {
      message.error('reset brand error');
    }
  };

  const handleResetBrand = (id: number) => {
    confirm({
      icon: <ExclamationCircleOutlined />,
      title: 'Do you want to delete this brand?',
      onOk() {
        resetBrandWeight(id);
      },
    });
  };

  const handleAddBrand = async (brand: IBrandResponse) => {
    if (!targetWeight) return;

    const res = await updateBrandWeight({ id: brand.id, popularweight: targetWeight });
    if (res.code === 1) {
      message.success('reset brand success');
      reloadTopBrands();
    } else {
      message.error('reset brand error');
    }

    setModalVisible(false);
  };

  const handleEditBrand = async (brand: IBrandResponse) => {
    if (!clickedBrandId) return;

    confirm({
      icon: <ExclamationCircleOutlined />,
      title: 'Do you want to Change this brand?',
      onOk() {
        updateBrandWeight({ id: clickedBrandId, popularweight: 0 }).then((res) => {
          if (res.code === 1 && targetWeight)
            updateBrandWeight({ id: brand.id, popularweight: targetWeight }).then(() => {
              if (res.code === 1) {
                message.success('Success');
                searchAllBrands({ pageSize: 6, current: 1 });
                reloadTopBrands();
                setModalVisible(false);
              } else message.error('Failed');
            });
          else message.error('Failed');
        });
      },
    });
  };

  const handleSwapBrand = (targetBrand: IBrandResponse) => {
    if (!clickedBrandId || !targetWeight) return;
    console.log('targetBrand: ', targetBrand);

    confirm({
      icon: <ExclamationCircleOutlined />,
      title: 'Do you want to Change this brand?',
      onOk() {
        updateBrandWeight({ id: targetBrand.id, popularweight: targetWeight }).then((res) => {
          if (res.code === 1 && targetWeight)
            updateBrandWeight({
              id: clickedBrandId,
              popularweight: targetBrand.popularweight,
            }).then(() => {
              if (res.code === 1) {
                message.success('Success');
                reloadTopBrands();
                setModalVisible(false);
              } else message.error('Failed');
            });
          else message.error('Failed');
        });
      },
    });
  };

  return (
    <PageContainer>
      <Card style={{ height: '80vh' }}>
        <Row gutter={[18, 24]}>
          {brandResultList.map((item: IBrandResponse | 0, index) => (
            <Col className="gutter-row" flex="0 0 230px">
              {topBrandsLoading ? (
                <SkeletonCard />
              ) : item === 0 ? (
                <AddItemCard
                  height={427}
                  handleAdd={() => {
                    clickedBrandIndex = index;
                    // console.log('clickedBrandIndex + 1: ', clickedBrandIndex + 1);
                    // console.log(
                    //   'RECOMMEND_BRANDS_AMOUNT - clickedBrandIndex: ',
                    //   RECOMMEND_BRANDS_AMOUNT - clickedBrandIndex,
                    // );
                    // console.log('targetWeight 0 : ', targetWeight);
                    setTargetWeight((RECOMMEND_BRANDS_AMOUNT - clickedBrandIndex) * 10000);
                    setModalAction('add');
                    setModalVisible(true);
                  }}
                />
              ) : (
                <ItemCard
                  title={`No. ${index + 1}`}
                  imgSrc={item.imgurl}
                  onSwap={() => {
                    clickedBrandIndex = index;
                    setTargetWeight((RECOMMEND_BRANDS_AMOUNT - clickedBrandIndex) * 10000);
                    setClickedBrandId(item.id);
                    setModalAction('swap');
                    setModalVisible(true);
                  }}
                  onEdit={() => {
                    clickedBrandIndex = index;
                    setTargetWeight((RECOMMEND_BRANDS_AMOUNT - clickedBrandIndex) * 10000);
                    setClickedBrandId(item.id);
                    setModalAction('edit');
                    setModalVisible(true);
                  }}
                  onReset={() => {
                    handleResetBrand(item.id);
                  }}
                  description={
                    <>
                      <p>id: {item.id} </p>
                      <p>name: {item.brandname}</p>
                    </>
                  }
                />
              )}
            </Col>
          ))}
        </Row>
      </Card>
      {modalAction === 'swap' ? (
        <SwapBrandModal
          data={topBrands}
          loading={topBrandsLoading}
          clickedIndex={1}
          clickedBrandId={clickedBrandId}
          visible={modalVisible}
          onOk={handleSwapBrand}
          onCancel={() => {
            setModalVisible(false);
          }}
        />
      ) : (
        <BrandModal
          tableProps={tableProps}
          searchAllBrands={searchAllBrands}
          setBrandSearchType={setBrandSearchType}
          clickedIndex={1}
          visible={modalVisible}
          onOk={modalAction === 'add' ? handleAddBrand : handleEditBrand}
          onCancel={() => {
            setModalVisible(false);
          }}
        />
      )}
    </PageContainer>
  );
};

export default Collections;
