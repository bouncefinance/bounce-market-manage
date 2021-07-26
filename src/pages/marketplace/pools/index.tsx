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
import { poolStateEnum, PoolFilterEnum } from '@/services/pool/types';
import { PageContainer } from '@ant-design/pro-layout';
import { Card, Col, Row, Modal, message, Typography, Tooltip, Tag, Space } from 'antd';

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
  setModalVisible: any;
  onReset: any;
}

const RecommendItem: React.FC<IRecommendItemProps> = ({
  item,
  index,
  setModalVisible,
  onReset,
}) => {
  const { data, run, loading } = useRequest(
    () => getOnePoolInfo({ poolId: item.poolid, poolType: item.standard }),
    {
      manual: true,
    },
  );

  useEffect(() => {
    if (item.poolid || item.poolid === 0) {
      run();
    }
  }, [item.poolid]);

  useEffect(() => {
    if (data && !loading) {
      fullTopPools.push({ ...data, poolweight: item.poolweight });
    }
  }, [data, loading]);

  // 加载中
  if ((!data && (item.poolid || item.poolid === 0)) || loading) {
    return <SkeletonCard height={407} />;
  }
  // 未设置
  if (!item.poolid && item.poolid !== 0) {
    return (
      <AddItemCard
        height={407}
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
      category={data?.category}
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
        onReset({ poolid: item.poolid, standard: item.standard });
      }}
      description={
        <>
          <Space>
            <Typography.Paragraph>{`id: ${item.poolid}`}</Typography.Paragraph>

            <Typography.Paragraph>
              {data?.state === poolStateEnum.closed && <Tag color="red">Closed</Tag>}
            </Typography.Paragraph>
          </Space>

          <Typography.Paragraph style={{ margin: 0 }}>
            {data && data?.itemname?.length > 12 ? (
              <Tooltip title={data?.itemname}>
                {`name: ${data?.itemname.replace(/^(.{12}).*$/, '$1...')}`}
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
  const [pageLoading, setPageLoading] = useState(false);

  useEffect(() => {
    fullTopPools.splice(0, fullTopPools.length);
  }, [modalVisible]);

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
    if (topPools && !topPoolsLoading && topPools?.length > 0) {
      const pools = new Array(recommendCount).fill({});
      // const pools = resultPools;
      topPools
        ?.sort((a, b) => {
          return b.poolweight - a.poolweight;
        })
        .forEach((item) => {
          if (item.poolweight > 0) {
            pools[recommendCount - item.poolweight] = item;
          }
        });

      setResultPools(pools);
    }
  }, [topPools, topPoolsLoading]);

  const handleReset = ({ poolid, standard }: IUpdatePoolWeightParams) => {
    confirm({
      icon: <ExclamationCircleOutlined />,
      title: 'Are you sure you want to delete this brand?',
      onOk() {
        setPageLoading(true);
        updatePoolWeight({ poolid, weight: 0, standard }).then((res) => {
          if (res.code === 1) {
            refreshTopPools().then((value) => {
              if (value && value?.length > 0) {
                setPageLoading(false);
                message.success('Success');
              }
            });
          } else {
            message.error('Error');
          }
        });
      },
    });
  };

  const handleAdd = (pool: IPoolInfo) => {
    confirm({
      icon: <ExclamationCircleOutlined />,
      title: 'Are you sure you want to add this brand?',
      onOk() {
        setModalVisible(false);
        setPageLoading(true);
        updatePoolWeight({
          poolid: pool.poolid!,
          standard: pool.pooltype!,
          weight: targetWeight,
        }).then((res1) => {
          if (res1.code === 1) {
            message.success('Success');
            refreshTopPools();
            searchAllPools({ pageSize: 6, current: 1 });
            setPageLoading(false);
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
      title: 'Are you sure you want to add this brand?',
      onOk() {
        setModalVisible(false);
        setPageLoading(true);
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
                  setPageLoading(false);
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
      title: 'Are you sure you want to Swap this brand?',
      onOk() {
        setModalVisible(false);
        setPageLoading(true);
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
                setPageLoading(false);
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
    <PageContainer loading={pageLoading}>
      <Card>
        <Row gutter={[18, 24]}>
          {resultPools.map((item: ITopPool, index) => (
            <Col
              key={`${item.poolid}_${item.standard}_${index}`}
              className="gutter-row"
              flex="0 0 230px"
            >
              <RecommendItem
                item={item}
                index={index}
                setModalVisible={setModalVisible}
                onReset={handleReset}
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
          topPools={topPools?.filter((pool) => pool.poolweight > 0) || []}
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
