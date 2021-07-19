/* eslint-disable no-nested-ternary */
import React, { useEffect, useState } from 'react';
import { useRequest } from '@/.umi/plugin-request/request';
import type {
  IPoolInfo,
  ITopPool,
  IUpdatePoolWeightParams,
  PoolFilterType,
  poolSaleType,
} from '@/services/pool/types';
import { PoolFilterEnum } from '@/services/pool/types';
// import { ExclamationCircleOutlined } from '@ant-design/icons';
import { PageContainer } from '@ant-design/pro-layout';
import { Card, Col, Row, Modal, message, Typography, Tooltip } from 'antd';

import SkeletonCard from '@/components/Cards/SkeletonCard';
import AddItemCard from '@/components/Cards/AddItemCard';
import ItemCard from '@/components/Cards/ItemCard';
// import SwapBrandModal from './SwapBrandModal';
import { getOnePoolInfo, getPoolsByFilter, getTopPools, updatePoolWeight } from '@/services/pool';
import { ExclamationCircleOutlined } from '@ant-design/icons';
// import SwapPoolModal from './SwapPoolModal';
import { RECOMMEND_POOLS_AMOUNT } from '@/tools/const';
import PoolModal from './PoolModal';
import { ToOffset } from '@/services';

const { confirm } = Modal;

let clickedIndex: number;
let targetWeight: number;
let modalAction: 'swap' | 'add' | 'edit';
let oldPoolId: number;
let oldPoolStandard: poolSaleType;
// let oldPoolWeight: number;

interface IRecommendItemProps {
  item: ITopPool;
  index: number;
  refreshTopPools: any;
  setModalVisible: any;
  // handleAddClicked: any;
}

const RecommendItem: React.FC<IRecommendItemProps> = ({
  item,
  index,
  refreshTopPools,
  setModalVisible,
  // handleAddClicked,
}) => {
  const handleReset = ({ poolid, standard }: IUpdatePoolWeightParams) => {
    confirm({
      icon: <ExclamationCircleOutlined />,
      title: 'Do you want to delete this brand?',
      onOk() {
        updatePoolWeight({ poolid, weight: 0, standard }).then((res) => {
          if (res.code === 1) {
            message.success('Success');
            refreshTopPools();
          } else {
            message.error('Error');
          }
        });
      },
    });
  };

  const { data, run } = useRequest(
    () => getOnePoolInfo({ poolId: item.poolid, poolType: item.standard }),
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
  if (!item.poolid && item.poolid !== 0) {
    return <SkeletonCard />;
  }
  // 未设置
  if (!item.poolweight) {
    return (
      <AddItemCard
        height={427}
        handleAdd={() => {
          clickedIndex = index;
          oldPoolId = item.poolid;
          oldPoolStandard = item.standard;
          targetWeight = RECOMMEND_POOLS_AMOUNT - index;
          modalAction = 'add';
          setModalVisible(true);
        }}
      />
    );
  }
  // 加载完成
  return (
    <ItemCard
      title={`No. ${index + 1}`}
      imgSrc={data?.fileurl}
      onSwap={() => {
        clickedIndex = index;
        oldPoolId = item.poolid;
        oldPoolStandard = item.standard;
        targetWeight = RECOMMEND_POOLS_AMOUNT - index;
        modalAction = 'swap';
        // oldPoolWeight = item.poolweight;
      }}
      onEdit={() => {
        clickedIndex = index;
        oldPoolId = item.poolid;
        oldPoolStandard = item.standard;
        targetWeight = RECOMMEND_POOLS_AMOUNT - index;
        modalAction = 'edit';
        setModalVisible(true);
      }}
      onReset={() => {
        clickedIndex = index;
        handleReset({ poolid: item.poolid, standard: item.standard });
      }}
      description={
        <>
          <Typography.Paragraph>id: {item.poolid}</Typography.Paragraph>
          <Typography.Paragraph style={{ margin: 0 }}>
            {data && data?.itemname?.length > 16 ? (
              <Tooltip title={data?.itemname}>
                {`name: ${data?.itemname.replace(/^(.{16}).*$/, '$1...')}`}
              </Tooltip>
            ) : (
              `name: ${data?.itemname}`
            )}
          </Typography.Paragraph>
        </>
      }
    />
  );
};

// 推荐位个数
const recommendCount = 11;
const RecommendPools: React.FC = () => {
  const [resultPools, setResultPools] = useState<ITopPool[]>(new Array(recommendCount).fill({}));
  const [modalVisible, setModalVisible] = useState(false);
  const [searchType, setSearchType] = useState<PoolFilterType>(PoolFilterEnum.likestr);
  // const [selectedPool, setSelectedPool] = useState<IPoolInfo>();

  const {
    data: topPools,
    loading: topPoolsLoading,
    refresh: refreshTopPools,
  } = useRequest(() => {
    return getTopPools();
  });

  const { tableProps, run: searchAllPools } = useRequest(
    ({ pageSize: limit, current: offset }, searchText) => {
      return getPoolsByFilter(searchType, searchText, ToOffset(offset, limit), limit);
    },
    {
      // manual: true,
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
    if (!topPoolsLoading && topPools) {
      const pools = [...resultPools];
      topPools
        ?.sort((a, b) => {
          return b.poolweight - a.poolweight;
        })
        .forEach((item, index) => {
          pools[index] = item;
        });
      setResultPools(pools);
    }
  }, [topPools, topPoolsLoading]);

  // useEffect(() => {

  // }, [modalVisible])

  const handleAdd = (pool: IPoolInfo) => {
    confirm({
      icon: <ExclamationCircleOutlined />,
      title: 'Do you want to add this brand?',
      onOk() {
        setModalVisible(false);
        updatePoolWeight({
          poolid: pool.poolid!,
          standard: pool.pooltype!,
          weight: targetWeight,
        }).then((res1) => {
          if (res1.code === 1) {
            message.success('Success');
            refreshTopPools();
            searchAllPools({ pageSize: 6, current: 1 });
          } else {
            message.error('Error');
          }
        });
      },
    });
  };

  const handleEdit = (pool: IPoolInfo) => {
    confirm({
      icon: <ExclamationCircleOutlined />,
      title: 'Do you want to add this brand?',
      onOk() {
        setModalVisible(false);
        updatePoolWeight({ poolid: oldPoolId, standard: oldPoolStandard, weight: 0 }).then(
          (res1) => {
            if (res1.code === 1) {
              updatePoolWeight({
                poolid: pool.poolid!,
                standard: pool.pooltype!,
                weight: targetWeight,
              }).then((res2) => {
                if (res2.code === 1) {
                  message.success('Success');
                  refreshTopPools();
                  searchAllPools({ pageSize: 6, current: 1 });
                } else {
                  message.error('Error');
                }
              });
            } else {
              message.error('Error');
            }
          },
        );
      },
    });
  };

  // const handleSwap = (pool: ITopPool) => {
  //   confirm({
  //     icon: <ExclamationCircleOutlined />,
  //     title: 'Do you want to add this brand?',
  //     onOk() {
  //       setModalVisible(false);
  //       updatePoolWeight({
  //         poolid: oldPoolId,
  //         standard: oldPoolStandard,
  //         weight: pool.poolweight,
  //       }).then((res1) => {
  //         if (res1.code === 1) {
  //           updatePoolWeight({
  //             poolid: pool.poolid!,
  //             standard: pool.standard!,
  //             weight: oldPoolWeight,
  //           }).then((res2) => {
  //             if (res2.code === 1) {
  //               message.success('Success');
  //               refreshTopPools();
  //               searchAllPools({ pageSize: 6, current: 1 });
  //             } else {
  //               message.error('Error');
  //             }
  //           });
  //         } else {
  //           message.error('Error');
  //         }
  //       });
  //     },
  //   });
  // };

  return (
    <PageContainer>
      <Card>
        <Row gutter={[18, 24]}>
          {resultPools.map((item: ITopPool, index) => (
            <Col className="gutter-row" flex="0 0 230px">
              <RecommendItem
                item={item}
                index={index}
                refreshTopPools={refreshTopPools}
                setModalVisible={setModalVisible}
              />
            </Col>
          ))}
        </Row>
      </Card>
      {/* <SwapPoolModal
        data={topPools}
        loading={topPoolsLoading}
        clickedIndex={1}
        clickedPoolId={clickedPoolId}
        visible={modalVisible}
        onOk={()=>{}}
        onCancel={() => {
          setModalVisible(false);
        }}
      /> */}
      <PoolModal
        tableProps={tableProps}
        searchAllPools={searchAllPools}
        setSearchType={setSearchType}
        clickedIndex={clickedIndex}
        visible={modalVisible}
        onOk={modalAction === 'add' ? handleAdd : handleEdit}
        // oldPoolId={oldPoolId}
        // oldPoolStandard={oldPoolStandard}
        // onOk={handleEdit}
        onCancel={() => {
          setModalVisible(false);
        }}
      />
    </PageContainer>
  );
};

export default RecommendPools;
