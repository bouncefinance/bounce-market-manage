import { Apis, post } from '../index';
import type { IPoolResponse } from './types';

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
  return post(Apis.getauctionpoolsbyaccount, {
    userAddress,
    offset,
    limit,
  });
};
