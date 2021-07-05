import { Apis, post, ToOffset } from '../index';
import {
  IDropsRequest,
  IDropsResponse,
  IAddDropParams,
  IGetPoolsParams,
  IGetPoolsResponse,
} from './types';

export const getDrops = ({
  accountaddress = '',
  offset = 1,
  limit = 10,
  state = 1,
  orderType = 2,
}: IDropsRequest) => {
  return post<IDropsResponse[]>(Apis.searchdrops, {
    orderType,
    offset: ToOffset(offset, limit!),
    limit,
    state,
    accountaddress,
  });
};

export const deleteOneDrop = (dropsid: number) => {
  return post(Apis.deleteonedrops, { dropsid });
};

export const addOneDrop = ({
  accountaddress,
  website,
  twitter,
  Instagram,
  title,
  description,
  bgcolor,
  coverimgurl,
  poolids,
  ordernum,
  dropdate,
}: IAddDropParams) => {
  return post(Apis.addaccountdrops, {
    accountaddress,
    website,
    twitter,
    Instagram,
    title,
    description,
    bgcolor,
    coverimgurl,
    poolids,
    ordernum,
    dropdate,
  });
};

export const updateOneDrop = ({
  accountaddress,
  website,
  twitter,
  Instagram,
  title,
  description,
  bgcolor,
  coverimgurl,
  poolids,
  ordernum,
  dropdate,
}: IAddDropParams) => {
  return post(Apis.updatedrops, {
    accountaddress,
    website,
    twitter,
    Instagram,
    title,
    description,
    bgcolor,
    coverimgurl,
    poolids,
    ordernum,
    dropdate,
  });
};

// fileter:1:likestr,2:creatoraddress,3:tokenid
export const getPoolsByLikestr = ({ filter = 1, likestr, limit, offset = 0 }: IGetPoolsParams) => {
  return post<IGetPoolsResponse[]>(Apis.getpoolsbylikename, {
    filter,
    likestr,
    limit,
    offset,
  });
};

export const getPoolsByCreatorAddress = (
  filter: number = 2,
  creator: string = '0x26604A35B97D395a9711D839E89b44EFcc549B21',
  limit: number = 7,
  offset: number = 0,
) => {
  return post(Apis.getpoolsbylikename, {
    filter,
    creator,
    limit,
    offset,
  });
};

export const getPoolsByTokenId = ({ filter = 3, tokenid, limit, offset = 0 }: IGetPoolsParams) => {
  return post(Apis.getpoolsbylikename, {
    filter,
    tokenid,
    limit,
    offset,
  });
};

export const getAllAccounts = ({ filter = 1, offset = 0, likestr = '' }: IGetPoolsParams) => {
  return post(Apis.getpoolsbylikename, {
    filter,
    offset,
    likestr,
  });
};
// export const getAccountsByLikeName = ({ filter = 1, offset = 0, likestr = '' }: IGetPoolsParams) => {
//   return post(Apis.getaccountsbylikename, {
//     filter,
//     offset,
//     likestr,
//   });
// };

