import { RECOMMEND_POOLS_AMOUNT } from '@/tools/const';
import { Apis, post } from '../index';
import type { IPoolInfo, IPoolResponse, ITopPool, poolSaleType } from './types';

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
