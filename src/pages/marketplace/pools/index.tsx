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
import { PageContainer } from '@ant-design/pro-layout';
import { Card, Col, Row, Modal, message, Typography, Tooltip } from 'antd';

import SkeletonCard from '@/components/Cards/SkeletonCard';
import AddItemCard from '@/components/Cards/AddItemCard';
import ItemCard from '@/components/Cards/ItemCard';
import { getOnePoolInfo, getPoolsByFilter, getTopPools, updatePoolWeight } from '@/services/pool';
import { ExclamationCircleOutlined } from '@ant-design/icons';
import SwapPoolModal from './SwapPoolModal';
import { RECOMMEND_POOLS_AMOUNT } from '@/tools/const';
import PoolModal from './PoolModal';
import { ToOffset } from '@/services';

const { confirm } = Modal;

let clickedIndex: number;
let targetWeight: number;
let modalAction: 'swap' | 'add' | 'edit';
let oldPoolId: number;
let oldPoolStandard: poolSaleType;
const fullTopPools: IPoolInfo[] = [];

interface IRecommendItemProps {
  item: ITopPool;
  index: number;
  refreshTopPools: any;
  setModalVisible: any;
}

const RecommendItem: React.FC<IRecommendItemProps> = ({
  item,
  index,
  refreshTopPools,
  setModalVisible,
  // handleAddClicked,
}) => {
  console.log(index, 'item: ', item);

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

  const { data, run, loading } = useRequest(
    () => getOnePoolInfo({ poolId: item.poolid, poolType: item.standard }),
    {
      manual: true,
    },
  );

  useEffect(() => {
    if (item.poolid) {
      run();
    }
  }, [item.poolid]);

  useEffect(() => {
    if (data && !loading) {
      fullTopPools.push({ ...data, poolweight: item.poolweight });
    }
  }, [data, loading]);

  // 加载中
  if (!item.poolid && item.poolid !== 0 && JSON.stringify(item) !== '{}') {
    return <SkeletonCard />;
  }
  // 未设置
  if (JSON.stringify(item) === '{}') {
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
        setModalVisible(true);
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
      const pools = new Array(recommendCount).fill({});
      topPools
        ?.sort((a, b) => {
          return b.poolweight - a.poolweight;
        })
        .forEach((item) => {
          if (item.poolweight > 0) {
            pools[recommendCount - item.poolweight] = item;
          }
        });
      console.log('pools: ', pools);
      setResultPools(pools);
    }
  }, [topPools, topPoolsLoading]);

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

  const handleSwap = (pool: IPoolInfo) => {
    confirm({
      icon: <ExclamationCircleOutlined />,
      title: 'Do you want to Swap this brand?',
      onOk() {
        setModalVisible(false);
        updatePoolWeight({
          poolid: oldPoolId,
          standard: oldPoolStandard,
          weight: pool.poolweight,
        }).then((res1) => {
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
        });
      },
    });
  };

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
      {modalAction === 'swap' ? (
        <SwapPoolModal
          data={fullTopPools}
          loading={topPoolsLoading}
          clickedIndex={clickedIndex}
          clickedPoolId={oldPoolId}
          visible={modalVisible}
          onOk={handleSwap}
          onCancel={() => {
            setModalVisible(false);
          }}
        />
      ) : (
        <PoolModal
          tableProps={tableProps}
          searchAllPools={searchAllPools}
          setSearchType={setSearchType}
          clickedIndex={clickedIndex}
          visible={modalVisible}
          onOk={modalAction === 'add' ? handleAdd : handleEdit}
          onCancel={() => {
            setModalVisible(false);
          }}
        />
      )}
    </PageContainer>
  );
};

export default RecommendPools;
