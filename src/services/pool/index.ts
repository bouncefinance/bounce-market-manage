import { RECOMMEND_POOLS_AMOUNT } from '@/tools/const';
import { Apis, post } from '../index';
import type { IGetPoolsParams, IPoolInfo, IPoolResponse, ITopPool, IUpdatePoolWeightParams, PoolFilterType, poolSaleType } from './types';
import { PoolFilterEnum } from './types';

export const getPoolsByFilter = (
  filterType: PoolFilterType,
  searchText: string = '',
  offset: number,
  limit: number = 5,
) => {
  let data;
  switch (filterType) {
    case PoolFilterEnum.likestr:
      data = {
        likestr: searchText,
        limit,
        offset,
      };
      break;

    case PoolFilterEnum.creator:
      data = {
        creator: searchText,
        limit,
        offset,
      };
      break;

    case PoolFilterEnum.tokenid:
      data = {
        tokenid: Number(searchText),
        limit,
        offset,
      };
      break;

    default:
      data = {
        likestr: searchText,
        limit,
        offset,
      };
      break;
  }

  return post<IPoolInfo[]>(Apis.getauctionpoolsbyfilter, data);
};

export const getPools = ({
  creator,
  filter,
  likestr,
  limit,
  offset,
  tokenid,
}: IGetPoolsParams) => {
  return post(Apis.dealpoolinfo, {
    creator,
    filter,
    likestr,
    limit,
    offset,
    tokenid,
  });
};

export const updatePoolWeight = ({
  poolid,
  weight,
  standard,
}: IUpdatePoolWeightParams) => {
  return post(Apis.dealpoolinfo, {
    poolid,
    weight,
    standard,
  });
};

export const getOnePoolInfo = ({
  poolId,
  poolType,
}: {
  poolId: number;
  poolType: poolSaleType;
}) => {
  return post<IPoolInfo>(Apis.getonepoolinfo, {
    poolId,
    poolType,
  });
};

export const getTopPools = () => {
  return post<ITopPool[]>(Apis.getpoolsinfobypage, {
    offset: 0,
    limit: RECOMMEND_POOLS_AMOUNT,
    orderweight: 1,
  });
};

export const getAllPoolsByCreatorAddress = (userAddress: string) => {
  return post<IPoolResponse[]>(Apis.getauctionpoolsbyaccount, {
    userAddress,
  });
};

export const getPoolsByCreatorAddress = (
  userAddress: string,
  offset: number = 0,
  limit: number,
) => {
  return post<IPoolResponse[]>(Apis.getauctionpoolsbyaccount, {
    userAddress,
    offset,
    limit,
  });
};
