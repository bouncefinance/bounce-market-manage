import React, { useEffect, useState } from 'react';
import request from 'umi-request';
import { RECOMMEND_POOLS_AMOUNT, RECOMMEND_BRANDS_AMOUNT } from '@/tools/const';
// import './index.less';
import { Tabs, message, Modal, Row, Col, Divider } from 'antd';

import { ExclamationCircleOutlined } from '@ant-design/icons';

import { useRequest } from 'umi';
import RecommendPoolCard from './RecommendPoolCard';
import RecommendBrandCard from './RecommendBrandCard';
import EditPoolModal from './EditPoolModal';
import EditBrandModal from './EditBrandModal';
import SwapPoolModal from './SwapPoolModal';
import SwapBrandModal from './SwapBrandModal';

const { TabPane } = Tabs;
const { confirm } = Modal;

export interface ITopArtist {
  id: number;
  bounceid: number;
  state: number;
  display: number;
  identity: number;
  email: string;
  bandimgurl: string;
  accountaddress: string;
  username: string;
  fullnam: string;
  bio: string;
  imgurl: string;
  website: string;
  instagram: string;
  twitter: string;
  facebook: string;
  top_weight: number;
  created_at: string;
  updated_at: string;
}

// // get brands weight
// const getPopularBrands = function () {
//   return request.post('[FGB_V2]/api/v2/main/getpopularbrands', {
//     data: {
//       accountaddress: '',
//     },
//   });
// };

const getPopularBrands = function () {
  return request.post('/api/bouadmin/main/auth/getbrandsbylikename', {
    data: {
      filter: 1,
      likestr: '',
      offset: 0,
      limit: RECOMMEND_BRANDS_AMOUNT,
    },
  });
};

const getTopArtistsList = () => {
  return request.get('/api/bouadmin/main/auth/getbrandsbylikename', {
    data: {
      // limit: limit, 单页显示数量
    },
  });
};

let modalAction: 'add' | 'add and reset';
let oldArtist: ITopArtist;

let clickedCardIndex: number;
let clickedCardType: 'Banner' | 'Fast Mover' | 'Brand';

export default function recommend() {
  const [poolModalVisible, setPoolModalVisible] = useState(false);
  const [recommendBrandList, setRecommendBrandList] = useState<ITopArtist[]>([]);
  const [brandModalVisible, setBrandModalVisible] = useState(false);
  const [resultPoolsLoading, setResultPoolsLoading] = useState(true);
  const [resultBrandsLoading, setResultBrandsLoading] = useState(true);
  const [modalDataSource, setModalDataSource] = useState<ITopArtist[]>([]);
  const [modalActionType, setModalActionType] = useState<
    'edit brand' | 'swap brand' | 'add brand'
  >();

  // const {
  //   data: popularBrands,
  //   loading: popularBrandsLoading,
  //   refresh: brandRefresh,
  // }: { data: IPopularBrand[]; loading: boolean; refresh: any } = useRequest(() => {
  //   return getPopularBrands();
  // });

  const { data: topArtistsList }: { data: ITopArtist[]; loading: boolean } = useRequest(() => {
    return getTopArtistsList();
  });

  useEffect(() => {
    console.log('modalActionType: ', modalActionType);
  }, [modalActionType]);

  useEffect(() => {
    switch (modalActionType) {
      case 'edit brand':
        console.log('in edit brand');
        console.log('brands: ', topArtistsList);
        setModalDataSource(
          topArtistsList
            .sort((a, b) => {
              return a.top_weight > b.top_weight ? 1 : -1;
            }),
        );
        break;

      // case 'add brand':
      //   console.log('in add brand');
      //   console.log('brands: ', brands);
      //   setModalDataSource(
      //     brands
      //       ?.filter((brand) => {
      //         // Filter out brands that have been recommended
      //         return (
      //           !recommendBrandList.find((recommendBrand) => {
      //             return recommendBrand.id === brand.id;
      //           }) &&
      //           brand.id !== 10 &&
      //           brand.id !== 11
      //         );
      //       })
      //       .sort((a, b) => {
      //         return a.popularweight > b.popularweight ? 1 : -1;
      //       }),
      //   );
      //   break;

      // case 'swap brand':
      //   console.log('in swap brand');
      //   setModalDataSource(
      //     brandResultList?.filter((brand) => {
      //       return brand.id !== 10 && brand.id !== 11;
      //     }),
      //   );
      //   break;

      default:
        break;
    }
  }, [modalActionType]);

  useEffect(() => {
    console.log('modalDataSource: ', modalDataSource);
  }, [modalDataSource]);

  useEffect(() => {
    console.log('clickedCardIndex: ', clickedCardIndex);
  }, [clickedCardIndex]);

  useEffect(() => {
    console.log('poolModalVisible: ', poolModalVisible);
  }, [poolModalVisible]);

  let brandResultList = new Array(RECOMMEND_BRANDS_AMOUNT).fill(0);
  recommendBrandList.map((value) => {
    brandResultList[RECOMMEND_BRANDS_AMOUNT - Math.floor(value.popularweight / 10000)] = value;
  });

  // useEffect(() => {
  //   if (!popularBrandsLoading && !popularBrands) {
  //     setResultBrandsLoading(true);
  //     message.error('Brand API Error !');
  //   }
  //   if (!popularBrandsLoading && popularBrands) {
  //     setRecommendBrandList(popularBrands);
  //     setResultBrandsLoading(false);
  //   }
  // }, [popularBrands, popularBrandsLoading]);

  // const resetBrandWeight = async () => {
  //   if (!oldBrandItem) return;
  //   const res = await request.post('/api/bouadmin/main/auth/updateweight', {
  //     data: {
  //       id: oldBrandItem?.id,
  //       popularweight: 0,
  //     },
  //   });
  //   if (res.code === 1) {
  //     message.success('reset brand success');
  //     brandRefresh();
  //   } else {
  //     message.error('reset brand error');
  //   }
  // };

  // const handleResetBrand = (item: IPopularBrand) => {
  //   confirm({
  //     // title: 'Reset',
  //     icon: <ExclamationCircleOutlined />,
  //     title: 'Do you want to delete this brand?',
  //     onOk() {
  //       oldBrandItem = item;
  //       resetBrandWeight();
  //     },
  //     onCancel() {
  //       // console.log('Cancel reset');
  //     },
  //   });
  // };

  // const handleEditBrand = (index: number, item: IPopularBrand) => {
  //   clickedCardIndex = index;
  //   modalAction = 'add and reset';
  //   oldBrandItem = item;
  //   setBrandModalVisible(true);
  // };

  // const handleAddBrand = (index: number, cardType: 'Brand') => {
  //   clickedCardIndex = index;
  //   clickedCardType = cardType;
  //   modalAction = 'add';
  //   setBrandModalVisible(true);
  // };

  return (
    <div className="recommend-box">
      <Divider style={{ fontSize: 26 }}>Top Artists</Divider>
      <Row gutter={[18, 24]}>
        {topArtistsList.map((topArtist, index) => {
          return (
            <Col key={index} className="gutter-row" flex="0 0 320px">
              <RecommendBrandCard
                loading={resultBrandsLoading}
                item={topArtist}
                index={index}
                // handleReset={handleResetBrand}
                // handleEdit={handleEditBrand}
                // handleAdd={handleAddBrand}
                setModalActionType={setModalActionType}
              />
            </Col>
          );
        })}
      </Row>

      {(modalActionType === 'edit brand' || modalActionType === 'add brand') && (
        <EditBrandModal
          brands={modalDataSource as IPopularBrand[]}
          clickedCardIndex={clickedCardIndex}
          clickedCardType={clickedCardType}
          modalAction={modalAction}
          oldBrandItem={oldBrandItem}
          brandModalVisible={brandModalVisible}
          setBrandModalVisible={setBrandModalVisible}
          refresh={brandRefresh}
        />
      )}

      {modalActionType === 'swap brand' && (
        <SwapBrandModal
          brands={modalDataSource as IPopularBrand[]}
          clickedCardIndex={clickedCardIndex}
          clickedCardType={clickedCardType}
          modalAction={modalAction}
          oldBrandItem={oldBrandItem}
          brandModalVisible={brandModalVisible}
          setBrandModalVisible={setBrandModalVisible}
          refresh={brandRefresh}
        />
      )}
    </div>
  );
}
