import { Apis, post, get } from '../index';
import type {
  IDeletePoolWeightParams,
  IGetPoolsParams,
  IPoolInfo,
  ITopPool,
  IInsertPoolWeightParams,
  PoolFilterType,
  poolSaleType,
  IUserPool,
} from './types';
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

export const getPools = ({ creator, filter, likestr, limit, offset, tokenid }: IGetPoolsParams) => {
  return post(Apis.dealpoolinfo, {
    creator,
    filter,
    likestr,
    limit,
    offset,
    tokenid,
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
  return get<ITopPool[]>(Apis.pool_get_recommends);
};

export const insertPoolWeight = ({ auctionType, poolWeight, poolid }: IInsertPoolWeightParams) => {
  return post(Apis.pool_insert_recommend, {
    poolid,
    auctionType,
    poolWeight,
  });
};

export const deletePoolWeight = ({ poolid, auctionType }: IDeletePoolWeightParams) => {
  return post(Apis.pool_delete_recommend, {
    poolid,
    auctionType,
  });
};

export const getAllPoolsByCreatorAddress = (userAddress: string) => {
  return post<IUserPool[]>(Apis.getauctionpoolsbyaccount, {
    userAddress,
  });
};

export const getPoolsByCreatorAddress = (
  userAddress: string,
  offset: number = 0,
  limit: number,
) => {
  return post<IUserPool[]>(Apis.getauctionpoolsbyaccount, {
    userAddress,
    offset,
    limit,
  });
};
