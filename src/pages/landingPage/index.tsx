/* eslint-disable no-nested-ternary */
import React, { useState } from 'react';
import { useRequest } from '@/.umi/plugin-request/request';
import {
  getTopArtistsList,
  deleteOneTopArtist,
  updataOneTopArtist,
  getVerfiedUsersByName,
} from '@/services/user';
import {
  ITopArtist,
  IUserItem,
  modalActionType,
  UserDisableEnum,
  UserRoleEnum,
} from '@/services/user/types';

import { ExclamationCircleOutlined } from '@ant-design/icons';
import { PageContainer } from '@ant-design/pro-layout';
import { Card, Col, Row, Modal, message, Tooltip, Typography, Tag, Space } from 'antd';

import SkeletonCard from '@/components/Cards/SkeletonCard';
import AddItemCard from '@/components/Cards/AddItemCard';
import ItemCard from '@/components/Cards/ItemCard';
import TopArtistsModal from './TopArtistsModal';
import SwapTopArtistsModal from './SwapTopArtistsModal';

import { RECOMMEND_TOP_ARTISTS_AMOUNT } from '@/tools/const';

const { confirm } = Modal;

const TopArtists: React.FC = () => {
  const [clickedIndex, setClickedIndex] = useState<number>();
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [modalAction, setModalAction] = useState<modalActionType>();
  const [clickedArtistName, setClickedArtistName] = useState<string>();
  const [targetWeight, setTargetWeight] = useState<number>();

  const {
    data: topArtists,
    loading: topArtistsLoading,
    refresh: reloadTopArtists,
  } = useRequest(() => {
    return getTopArtistsList();
  });

  const {
    tableProps,
    run: searchAllUsers,
    // refresh,
  } = useRequest(
    ({ pageSize: limit, current: offset }, likestr) =>
      getVerfiedUsersByName({ offset: (offset - 1) * limit, limit, likestr }),
    {
      paginated: true,
      defaultParams: [{ current: 1, pageSize: 5 }],
      // refreshDeps: [role, searchValue],
      formatResult(data: any) {
        return {
          list: data.data,
          total: data.total,
        };
      },
      cacheKey: 'UserList',
    },
  );

  const resultList: (ITopArtist | 0)[] = new Array(RECOMMEND_TOP_ARTISTS_AMOUNT).fill(0);
  topArtists
    ?.sort((a, b) => {
      return a.top_weight - b.top_weight;
    })
    ?.forEach((item) => {
      resultList[RECOMMEND_TOP_ARTISTS_AMOUNT - item.top_weight] = item;
    });

  const handleDelete = (username: string) => {
    confirm({
      icon: <ExclamationCircleOutlined />,
      title: 'Do you want to delete this top artist?',
      onOk() {
        deleteOneTopArtist({ username }).then((res) => {
          if (res.code === 1) {
            message.success('Success');
            reloadTopArtists();
          } else {
            message.error('Error');
          }
        });
      },
    });
  };

  const handleAdd = async (user: IUserItem) => {
    if (!targetWeight) return;

    const res = await updataOneTopArtist({ username: user.username, topweight: targetWeight });
    if (res.code === 1) {
      message.success('Success');
      reloadTopArtists();
    } else {
      message.error('Error');
    }

    setModalVisible(false);
  };

  const handleEdit = async (user: IUserItem) => {
    if (!targetWeight) return;

    const res = await updataOneTopArtist({ username: user.username, topweight: targetWeight });
    if (res.code === 1) {
      message.success('Success');
      reloadTopArtists();
    } else {
      message.error('Error');
    }

    setModalVisible(false);
  };

  const handleSwap = (targetUser: ITopArtist) => {
    if (!clickedArtistName || !targetWeight) return;

    confirm({
      icon: <ExclamationCircleOutlined />,
      title: 'Do you want to Change this top artist?',
      onOk() {
        deleteOneTopArtist({ username: clickedArtistName }).then((res1) => {
          if (res1.code === 1) {
            updataOneTopArtist({ username: targetUser.username, topweight: targetWeight }).then(
              (res2) => {
                if (res2.code === 1 && targetWeight)
                  updataOneTopArtist({
                    username: clickedArtistName,
                    topweight: targetUser.top_weight,
                  }).then((res3) => {
                    if (res3.code === 1) {
                      message.success('Success');
                      reloadTopArtists();
                      setModalVisible(false);
                    } else message.error('Failed');
                  });
                else message.error('Failed');
              },
            );
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
          {resultList?.map((item: ITopArtist | 0, index) => (
            <Col className="gutter-row" flex="0 0 230px">
              {topArtistsLoading ? (
                <SkeletonCard />
              ) : item === 0 ? (
                <AddItemCard
                  height={427}
                  handleAdd={() => {
                    setClickedIndex(index);
                    setTargetWeight(RECOMMEND_TOP_ARTISTS_AMOUNT - index);
                    setModalAction('add');
                    setModalVisible(true);
                  }}
                />
              ) : (
                <ItemCard
                  title={`No. ${index + 1}`}
                  imgSrc={item.imgurl}
                  onSwap={() => {
                    setClickedIndex(index);
                    setTargetWeight(RECOMMEND_TOP_ARTISTS_AMOUNT - index);
                    setClickedArtistName(item.username);
                    setModalAction('swap');
                    setModalVisible(true);
                  }}
                  onEdit={() => {
                    setClickedIndex(index);
                    setTargetWeight(RECOMMEND_TOP_ARTISTS_AMOUNT - index);
                    setClickedArtistName(item.username);
                    setModalAction('edit');
                    setModalVisible(true);
                  }}
                  onReset={() => {
                    handleDelete(item.username);
                  }}
                  description={
                    <Space direction="vertical">
                      <Typography.Paragraph>
                        {`id: ${item.id} `}
                        {(item.identity !== UserRoleEnum.Verified ||
                          item.state !== UserDisableEnum.Normal) && <Tag color="red">Invalid</Tag>}
                      </Typography.Paragraph>

                      {item.username.length > 14 ? (
                        <Tooltip title={item.username}>
                          <Typography.Paragraph>
                            name: {`${item.username.slice(0, 14)}...`}
                          </Typography.Paragraph>
                        </Tooltip>
                      ) : (
                        <Typography.Paragraph style={{}}>
                          name: {item.username}
                        </Typography.Paragraph>
                      )}
                    </Space>
                  }
                />
              )}
            </Col>
          ))}
        </Row>
      </Card>
      {modalAction === 'swap' ? (
        <SwapTopArtistsModal
          data={topArtists}
          loading={topArtistsLoading}
          clickedIndex={clickedIndex}
          clickedArtistName={clickedArtistName}
          visible={modalVisible}
          onOk={handleSwap}
          onCancel={() => {
            setModalVisible(false);
          }}
        />
      ) : (
        <TopArtistsModal
          tableProps={tableProps}
          searchAllUsers={searchAllUsers}
          clickedIndex={clickedIndex}
          visible={modalVisible}
          onOk={modalAction === 'add' ? handleAdd : handleEdit}
          // onOk={handleAdd}
          onCancel={() => {
            setModalVisible(false);
          }}
        />
      )}
    </PageContainer>
  );
};

export default TopArtists;
