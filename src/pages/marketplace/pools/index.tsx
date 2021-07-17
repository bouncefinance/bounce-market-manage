/* eslint-disable no-nested-ternary */
import React, { useEffect, useState } from 'react';
import { useRequest } from '@/.umi/plugin-request/request';
import type {
  BrandFilterType,
  IPoolInfo,
  IPoolResponse,
  IResultPool,
  ITopPool,
  modalActionType,
  poolSaleType,
} from '@/services/pool/types';
import { BrandFilterEnum } from '@/services/pool/types';
// import { ExclamationCircleOutlined } from '@ant-design/icons';
import { PageContainer } from '@ant-design/pro-layout';
import { Card, Col, Row, Modal, message } from 'antd';

import SkeletonCard from '@/components/Cards/SkeletonCard';
import AddItemCard from '@/components/Cards/AddItemCard';
import ItemCard from '@/components/Cards/ItemCard';
import BrandModal from './BrandModal';
// import SwapBrandModal from './SwapBrandModal';
import { getOnePoolInfo, getTopPools } from '@/services/pool';

// const { confirm } = Modal;
interface IRecommendItemProps {
  item: ITopPool;
  index: number;
}

let clickedIndex: number;

const RecommendItem: React.FC<IRecommendItemProps> = ({ item, index }) => {
  const { data, run } = useRequest(
    () => getOnePoolInfo({ poolId: item.poolid!, poolType: (item.standard! + 1) as poolSaleType }),
    {
      manual: true,
    },
  );

  useEffect(() => {
    if (item.poolid) {
      run();
    }
  }, [item.poolid, run]);

  // 加载中
  if (!item.poolid) {
    return <SkeletonCard />;
  }
  // 未设置
  if (!item.poolweight) {
    return (
      <AddItemCard
        height={427}
        handleAdd={() => {
          // setClickedIndex(index);
          // setTargetWeight(RECOMMEND_POOLS_AMOUNT - index);
          // setModalAction('add');
          // setModalVisible(true);
        }}
      />
    );
  }
  // 加载完成
  return (
    <ItemCard
      title={`No. ${index + 1}`}
      imgSrc={data?.fileurl}
      handleSwap={() => {
        clickedIndex = index;
        // setClickedIndex(index);
        // setTargetWeight(RECOMMEND_POOLS_AMOUNT - index);
        // setClickedId(item.id);
        // setModalAction('swap');
        // setModalVisible(true);
      }}
      handleEdit={() => {
        clickedIndex = index;
        // setClickedIndex(index);
        // setTargetWeight(RECOMMEND_POOLS_AMOUNT - index);
        // setClickedId(item.id);
        // setModalAction('edit');
        // setModalVisible(true);
      }}
      handleReset={() => {
        clickedIndex = index;
        // handleResetBrand(item.id);
      }}
      description={
        <>
          <p>id: {item.poolid} </p>
          <p>name: {data?.itemname}</p>
        </>
      }
    />
  );
};

// 推荐位个数
const recommendCount = 11;
const RecommendPools: React.FC = () => {
  // const [clickedIndex, setClickedIndex] = useState<number>();
  // const [modalVisible, setModalVisible] = useState<boolean>(true);
  // const [modalAction, setModalAction] = useState<modalActionType>();
  // // const [clickedId, setClickedId] = useState<number>();
  // const [targetWeight, setTargetWeight] = useState<number>();
  // const [searchType, setSearchType] = useState<BrandFilterType>(BrandFilterEnum.likestr);
  const [resultPools, setResultPools] = useState<ITopPool[]>(new Array(recommendCount).fill({}));
  const [BrandModalVisible, setBrandModalVisible] = useState(false);

  const {
    data: topPools,
    loading: topPoolsLoading,
    // refresh: reloadTopPools,
  } = useRequest(() => {
    return getTopPools();
  });

  useEffect(() => {
    if (!topPoolsLoading && topPools) {
      const pools = [...resultPools];
      topPools
        ?.sort((a, b) => {
          return a.poolweight - b.poolweight;
        })
        .forEach((item, index) => {
          pools[index] = item;
        });
      setResultPools(pools);
    }
  }, [topPools, topPoolsLoading]);

  return (
    <PageContainer>
      <Card>
        <Row gutter={[18, 24]}>
          {resultPools.map((item: ITopPool, index) => (
            <Col className="gutter-row" flex="0 0 230px">
              <RecommendItem item={item} index={index} />
            </Col>
          ))}
        </Row>
      </Card>
      {/* {modalAction === 'swap' ? (
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
      )} */}
      {BrandModalVisible && (
        <BrandModal
          tableProps={tableProps}
          searchAllBrands={searchAllBrands}
          setBrandSearchType={setBrandSearchType}
          clickedIndex={1}
          visible={modalVisible}
          onOk={modalAction === 'add' ? handleAddBrand : handleEditBrand}
          onCancel={() => {
            setBrandModalVisible(false);
          }}
        />
      )}
    </PageContainer>
  );
};

export default RecommendPools;
