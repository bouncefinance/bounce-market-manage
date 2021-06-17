import React, { useEffect, useState } from 'react';
import request from 'umi-request';
import { RECOMMEND_POOLS_AMOUNT, RECOMMEND_BRANDS_AMOUNT } from '@/tools/const';
import './index.less';
import { Tabs, message, Modal, Row, Col, Divider } from 'antd';

import { ExclamationCircleOutlined } from '@ant-design/icons';

import { useRequest } from 'umi';
import EditPoolModal from './EditPoolModal';
import RecommendPoolCard from './RecommendPoolCard';
import RecommendBrandCard from './RecommendBrandCard';
import EditBrandModal from './EditBrandModal';

const { TabPane } = Tabs;
const { confirm } = Modal;

// TODO
export interface IpoolItem {
  poolid: number;
  fileurl: string;
  likecount: number;
  pooltype: number; // 1: fixed swap, 2: English auction
  poolweight: number;
  price: string;
  state: number;
  token0: string;
  token1: string;
  tokenid: number;
  username: string;
  itemname: string;
  category: string;
  channel: string;
}

interface IBrandData {
  id: number; // Brand 的 ID
  creator: string;
  ownername: string; // 铸造者（艺术家）昵称
  owneraddress: string;
  contractaddress: string; // 子合约地址
  brandname: string; // Brand name
  brandsymbol: string;
  description: string; // Brand 描述信息
  imgurl: string; // Brand 主图在线链接
  standard: number; // 1: ERC721 	2：ERC1155
  status: number; // 0: Live		1: Close
  popularweight: number; // 池子的权重信息
  bandimgurl: string; // Brand 背景图在线链接
  ownerimg: string; // 铸造者（艺术家）头像
  totalcount: number;
}

interface Ipoolweight {
  poolid: number;
  standard: number; // 0: fixed swap, 1: English auction
  poolweight: number;
}

export interface IPopularBrand {
  bandimgurl: string;
  brandname: string;
  contractaddress: string;
  created_at: string;
  description: string;
  faildesc: string;
  id: number;
  imgurl: string; // cover image
  owneraddress: string;
  ownername: string;
  popularweight: number;
  standard: number;
  status: number;
}

const getPoolLists = function (offset: number, limit: number, orderfield: 1 | 2 = 1) {
  return request.post('[FGB_V2]/api/v2/main/getauctionpoolsbypage', {
    data: {
      limit,
      offset,
      category: '',
      channel: '',
      currency: '0x0000000000000000000000000000000000000000',
      orderfield: orderfield,
    },
  });
};

// get pools weight
const getPoolsInfobypage = function (offset: number, limit: number) {
  return request.post('[FGB_V2]/api/v2/main/getpoolsinfobypage', {
    data: {
      limit,
      offset,
      orderweight: 1,
    },
  });
};

// get brands weight
const getPopularBrands = function () {
  return request.post('[FGB_V2]/api/v2/main/getpopularbrands', {
    data: {
      accountaddress: '',
    },
  });
};

const getBrandsByPage = function (
  likename: string = '',
  offset: number,
  limit: number,
  orderfield: 1 | 2 = 1, // 1: 按最新创建排序	2：按 Popular weight 排序
) {
  // return request.post('[FGB_V2]/api/v2/main/getbrandsbypage', {
  return request.post('/api/bouadmin/main/auth/getbrandsbylikename', {
    data: {
      likename: likename,
      offset: offset,
      limit: limit, // 单页显示数量
      orderfield: orderfield,
    },
  });
};

let oldPoolItem: IpoolItem;
let modalAction: 'add' | 'add and reset';
let oldBrandItem: IPopularBrand;

let clickedCardIndex: number;
let clickedCardType: 'Banner' | 'Fast Mover' | 'Brand';

export default function recommend() {
  const [poolModalVisible, setPoolModalVisible] = useState(false);
  const [filterPoolList, setFilterPoolList] = useState<Array<IpoolItem>>([]);
  const [recommendBrandList, setRecommendBrandList] = useState<Array<IPopularBrand>>([]);
  const [brandModalVisible, setBrandModalVisible] = useState(false);
  const [resultPoolsLoading, setResultPoolsLoading] = useState(true);
  const [resultBrandsLoading, setResultBrandsLoading] = useState(true);

  const {
    data: recommendPools,
    loading: recommendPoolsLoading,
    refresh: poolRefresh,
  }: { data: Ipoolweight[]; loading: boolean; refresh: any } = useRequest(() => {
    return getPoolsInfobypage(0, 11);
  });
  // console.log('recommendPools>>>>>', recommendPoolsLoading, recommendPools);

  const { data: pools, loading: poolsLoading }: { data: IpoolItem[]; loading: boolean } =
    useRequest(() => {
      return getPoolLists(0, 1000);
    });
  // console.log('getPoolLists>>>>>', pools, poolsLoading);

  const {
    data: popularBrands,
    loading: popularBrandsLoading,
    refresh: brandRefresh,
  }: { data: IPopularBrand[]; loading: boolean; refresh: any } = useRequest(() => {
    return getPopularBrands();
  });

  const { data: brands, loading: brandsLoading }: { data: IPopularBrand[]; loading: boolean } =
    useRequest(() => {
      return getBrandsByPage('', 0, 500, 2);
    });
  // console.log('getBrandsByPage >>>>>', brands, brandsLoading);

  useEffect(() => {
    if ((!recommendPoolsLoading && !recommendPools) || (!poolsLoading && !pools)) {
      setResultPoolsLoading(true);
      message.error('API Error !');
    }
    if (!recommendPoolsLoading && !poolsLoading && recommendPools && pools) {
      const poolMaps = pools
        .filter((item: IpoolItem) => {
          return item.state === 0;
        })
        .reduce((accumulator: { [poolId: string]: IpoolItem }, current) => {
          accumulator[`${current.poolid}_${current.pooltype - 1}`] = current;
          return accumulator;
        }, {});

      // console.log('pools: ', pools);

      setFilterPoolList(
        recommendPools
          .filter((item: Ipoolweight) => {
            return item.poolweight > 0;
          })
          .map((v: Ipoolweight) => ({
            ...poolMaps[`${v.poolid}_${v.standard}`],
            ...v,
          })),
      );
      setResultPoolsLoading(false);
    }
  }, [pools, recommendPools, recommendPoolsLoading, poolsLoading]);

  // useEffect(() => {
  //   console.log('clickedCardIndex: ', clickedCardIndex);
  // }, [clickedCardIndex]);

  const poolResultList = new Array(RECOMMEND_POOLS_AMOUNT)
    .fill(0)
    .map((v, i) => filterPoolList[i] || v)
    .sort((a, b) => (a?.poolweight > b?.poolweight ? -1 : 1));

  // console.log('poolResultList >>>>>', poolResultList);

  /* ------------------------------- */

  useEffect(() => {
    // console.log('popularBrandsLoading >>>>>', popularBrandsLoading);
    // console.log('popularBrands >>>>>', popularBrands);
    if (!popularBrandsLoading && !popularBrands) {
      setResultBrandsLoading(true);
      message.error('Brand API Error !');
    }
    if (!popularBrandsLoading && popularBrands) {
      setRecommendBrandList(popularBrands);
      setResultBrandsLoading(false);
    }
    // console.log('resultBrandsLoading >>>>>', resultBrandsLoading);
  }, [popularBrands, popularBrandsLoading]);

  // console.log('filterPoolList >>>>>', filterPoolList);

  const brandResultList = new Array(RECOMMEND_BRANDS_AMOUNT)
    .fill(0)
    .map((zero, index) => recommendBrandList[index] || zero)
    .sort((a, b) => (a?.popularweight > b?.popularweight ? -1 : 1));

  // console.log('brandResultList >>>>>', brandResultList);

  const resetPoolWeight = async () => {
    if (!oldPoolItem) return;
    const res = await request.post('/api/bouadmin/main/auth/dealpoolinfo', {
      data: {
        poolid: oldPoolItem?.poolid,
        weight: 0,
        // Actually, the standard is poolType, 0 means fixed-swap, and 1 means English-auction
        standard: oldPoolItem?.pooltype === 2 ? 1 : 0,
      },
    });
    if (res.code === 1) {
      message.success('reset success');
      poolRefresh();
    } else {
      message.error('reset error');
    }
  };

  const handleResetPool = (item: IpoolItem) => {
    confirm({
      // title: 'Reset',
      icon: <ExclamationCircleOutlined />,
      title: 'Do you Want to reset this item?',
      onOk() {
        oldPoolItem = item;
        resetPoolWeight();
      },
      onCancel() {
        // console.log('Cancel reset');
      },
    });
  };

  const handleEditPool = (
    index: number,
    item: IpoolItem,
    cardType: 'Banner' | 'Fast Mover' | 'Brand',
  ) => {
    clickedCardIndex = index;
    clickedCardType = cardType;
    modalAction = 'add and reset';
    oldPoolItem = item;
    setPoolModalVisible(true);
  };

  const handleAddPool = (index: number, cardType: 'Banner' | 'Fast Mover' | 'Brand') => {
    clickedCardIndex = index;
    clickedCardType = cardType;
    modalAction = 'add';
    setPoolModalVisible(true);
  };

  const resetBrandWeight = async () => {
    if (!oldBrandItem) return;
    const res = await request.post('/api/bouadmin/main/auth/updateweight', {
      data: {
        id: oldBrandItem?.id,
        popularweight: 0,
      },
    });
    if (res.code === 1) {
      message.success('reset brand success');
      brandRefresh();
    } else {
      message.error('reset brand error');
    }
  };

  const handleResetBrand = (item: IPopularBrand) => {
    confirm({
      // title: 'Reset',
      icon: <ExclamationCircleOutlined />,
      title: 'Do you Want to reset this brand?',
      onOk() {
        oldBrandItem = item;
        resetBrandWeight();
      },
      onCancel() {
        // console.log('Cancel reset');
      },
    });
  };

  const handleEditBrand = (index: number, item: IPopularBrand) => {
    clickedCardIndex = index;
    modalAction = 'add and reset';
    oldBrandItem = item;
    setBrandModalVisible(true);
  };

  return (
    <div className="recommend-box">
      <Tabs defaultActiveKey="1">
        <TabPane tab="Pools" key="1">
          <Divider style={{ fontSize: 26 }}>Banner</Divider>

          <Row gutter={[18, 24]}>
            {poolResultList.slice(0, 3).map((item: IpoolItem | 0, index) => {
              return (
                <Col key={index} className="gutter-row" flex="0 0 320px">
                  <RecommendPoolCard
                    loading={resultPoolsLoading}
                    item={item}
                    index={index}
                    cardType={'Banner'}
                    handleReset={handleResetPool}
                    handleEdit={handleEditPool}
                    handleAdd={handleAddPool}
                  />
                </Col>
              );
            })}
          </Row>

          <Divider style={{ fontSize: 26, marginTop: 44 }}>Fast Mover</Divider>

          <Row gutter={[18, 24]}>
            {poolResultList.slice(3, 12).map((item: IpoolItem | 0, index) => {
              return (
                <Col key={index} className="gutter-row" flex="0 0 320px">
                  <RecommendPoolCard
                    loading={resultPoolsLoading}
                    item={item}
                    index={index + 3}
                    cardType={'Fast Mover'}
                    handleReset={handleResetPool}
                    handleEdit={handleEditPool}
                    handleAdd={handleAddPool}
                  />
                </Col>
              );
            })}
          </Row>
        </TabPane>

        {/* <Divider style={{ fontSize: 26 }}>Brands</Divider> */}

        <TabPane tab="Brands" key="2">
          <Row gutter={[18, 24]}>
            {brandResultList.map((brand, index) => {
              return (
                <Col key={index} className="gutter-row" flex="0 0 320px">
                  <RecommendBrandCard
                    loading={resultBrandsLoading}
                    item={brand}
                    index={index}
                    handleReset={handleResetBrand}
                    handleEdit={handleEditBrand}
                    handleAdd={() => {}}
                  />
                </Col>
              );
            })}
          </Row>
        </TabPane>
      </Tabs>

      <EditPoolModal
        pools={pools?.filter((pool) => {
          return !filterPoolList.find((filterPool) => {
            return pool.poolid === filterPool.poolid && pool.pooltype === filterPool.pooltype;
          });
        })}
        clickedCardIndex={clickedCardIndex}
        clickedCardType={clickedCardType}
        modalAction={modalAction}
        oldPoolItem={oldPoolItem}
        poolModalVisible={poolModalVisible}
        setPoolModalVisible={setPoolModalVisible}
        refresh={poolRefresh}
      />

      <EditBrandModal
        brands={brands?.filter((brand) => {
          return (
            // Filter out brands that have been recommended 
            !recommendBrandList.find((recommendBrand) => {
              return recommendBrand.id === brand.id;
            }) &&
            brand.id !== 10 &&
            brand.id !== 11
          );
        })}
        clickedCardIndex={clickedCardIndex}
        clickedCardType={clickedCardType}
        modalAction={modalAction}
        oldBrandItem={oldBrandItem}
        brandModalVisible={brandModalVisible}
        setBrandModalVisible={setBrandModalVisible}
        refresh={brandRefresh}
      />
    </div>
  );
}
