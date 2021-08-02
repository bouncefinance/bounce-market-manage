/* eslint-disable no-nested-ternary */
import React, { useState } from 'react';
import { useRequest } from '@/.umi/plugin-request/request';
import type {
  IPoolInfo,
  ITopPool,
  IDeletePoolWeightParams,
  PoolFilterType,
  poolSaleType,
} from '@/services/pool/types';
import { poolStateEnum, PoolFilterEnum } from '@/services/pool/types';
import { PageContainer } from '@ant-design/pro-layout';
import { Card, Col, Row, Modal, message, Typography, Tooltip, Tag, Space } from 'antd';

import SkeletonCard from '@/components/Cards/SkeletonCard';
import AddItemCard from '@/components/Cards/AddItemCard';
import ItemCard from '@/components/Cards/ItemCard';
import { deletePoolWeight, getPoolsByFilter, getTopPools, insertPoolWeight } from '@/services/pool';
import { ExclamationCircleOutlined } from '@ant-design/icons';
import SwapPoolModal from './SwapPoolModal';
import PoolModal from './PoolModal';
import { ToOffset } from '@/services';

const { confirm } = Modal;

let clickedIndex: number;
let targetWeight: number;
let modalAction: 'swap' | 'add' | 'edit';
let oldPoolId: number;
let oldPoolStandard: poolSaleType;

// 推荐位个数
const recommendCount = 11;
const RecommendPools: React.FC = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const [searchType, setSearchType] = useState<PoolFilterType>(PoolFilterEnum.likestr);
  const [pageLoading, setPageLoading] = useState(false);

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

  const poolResultList: (ITopPool | Record<string, never>)[] = new Array(recommendCount).fill({});
  topPools?.forEach((item) => {
    poolResultList[recommendCount - item.pool_weight] = item;
  });

  const handleReset = ({ poolid, auctionType }: IDeletePoolWeightParams) => {
    confirm({
      icon: <ExclamationCircleOutlined />,
      title: 'Are you sure you want to delete this brand?',
      onOk() {
        setPageLoading(true);
        deletePoolWeight({ poolid, auctionType }).then((res) => {
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
        insertPoolWeight({
          poolid: pool.poolid!,
          auctionType: pool.pooltype!,
          poolWeight: targetWeight,
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
        deletePoolWeight({ poolid: oldPoolId, auctionType: oldPoolStandard }).then((res1) => {
          if (res1.code === 1) {
            insertPoolWeight({
              poolid: pool.poolid!,
              auctionType: pool.pooltype!,
              poolWeight: targetWeight,
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

  const handleSwap = (pool: ITopPool) => {
    confirm({
      icon: <ExclamationCircleOutlined />,
      title: 'Are you sure you want to Swap this brand?',
      onOk() {
        setModalVisible(false);
        setPageLoading(true);
        deletePoolWeight({ poolid: pool.pool_id!, auctionType: pool.auctiontype! }).then(
          (delOriginRes) => {
            if (delOriginRes.code === 1) {
              deletePoolWeight({ poolid: oldPoolId, auctionType: oldPoolStandard }).then(
                (delTargetRes) => {
                  if (delTargetRes.code === 1) {
                    insertPoolWeight({
                      poolid: oldPoolId,
                      auctionType: oldPoolStandard,
                      poolWeight: pool.pool_weight,
                    }).then((insertTargetRes) => {
                      if (insertTargetRes.code === 1) {
                        insertPoolWeight({
                          poolid: pool.pool_id!,
                          auctionType: pool.auctiontype!,
                          poolWeight: targetWeight,
                        }).then((insertOriginRes) => {
                          if (insertOriginRes.code === 1) {
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
                  } else message.error('Error');
                },
              );
            } else message.error('Error');
          },
        );
      },
    });
  };

  return (
    <PageContainer loading={pageLoading}>
      <Card>
        <Row gutter={[18, 24]}>
          {poolResultList.map((topPool: ITopPool | Record<string, never>, index) => (
            <Col
              key={
                JSON.stringify(topPool) === '{}'
                  ? index
                  : `${topPool.pool_id}_${topPool.auctiontype}`
              }
              className="gutter-row"
              flex="0 0 240px"
            >
              {topPoolsLoading ? (
                <SkeletonCard height={407} />
              ) : JSON.stringify(topPool) === '{}' ? (
                <AddItemCard
                  height={407}
                  handleAdd={() => {
                    clickedIndex = index;
                    oldPoolId = topPool.pool_id;
                    oldPoolStandard = topPool.auctiontype;
                    targetWeight = recommendCount - index;
                    modalAction = 'add';
                    setModalVisible(true);
                  }}
                />
              ) : (
                <ItemCard
                  title={`No. ${index + 1}`}
                  imgSrc={topPool.imgurl}
                  category={topPool.category}
                  onSwap={() => {
                    clickedIndex = index;
                    oldPoolId = topPool.pool_id;
                    oldPoolStandard = topPool.auctiontype;
                    targetWeight = recommendCount - index;
                    modalAction = 'swap';
                    setModalVisible(true);
                  }}
                  onEdit={() => {
                    clickedIndex = index;
                    oldPoolId = topPool.pool_id;
                    oldPoolStandard = topPool.auctiontype;
                    targetWeight = recommendCount - index;
                    modalAction = 'edit';
                    setModalVisible(true);
                  }}
                  onReset={() => {
                    clickedIndex = index;
                    handleReset({ poolid: topPool.pool_id, auctionType: topPool.auctiontype });
                  }}
                  description={
                    <>
                      <Space>
                        <Typography.Paragraph>{`id: ${topPool.pool_id}`}</Typography.Paragraph>

                        <Typography.Paragraph>
                          {topPool?.state === poolStateEnum.closed && <Tag color="red">Closed</Tag>}
                        </Typography.Paragraph>
                      </Space>

                      <Typography.Paragraph style={{ margin: 0, wordBreak: 'break-all' }}>
                        {topPool && topPool?.name?.length > 20 ? (
                          <Tooltip title={topPool?.name}>
                            {`name: ${topPool?.name.replace(/^(.{20}).*$/, '$1...')}`}
                          </Tooltip>
                        ) : (
                          `name: ${topPool?.name}`
                        )}
                      </Typography.Paragraph>
                    </>
                  }
                />
              )}
            </Col>
          ))}
        </Row>
      </Card>

      {modalAction === 'swap' ? (
        <SwapPoolModal
          data={topPools}
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
          topPools={topPools?.filter((pool) => pool.pool_weight > 0) || []}
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
