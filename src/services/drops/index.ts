import { Apis, post, ToOffset } from '../index';
import {
  IDropsRequest,
  IDropsResponse,
  IAddDropParams,
  IGetPoolsParams,
  IGetPoolsResponse,
  IGetAccountsParams,
  IAccountsResponse,
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

// fileter: 1:normal, 2:identitied
export const getVerfiedUsersList = ({ offset, limit }: IGetAccountsParams) => {
  return post<IGetPoolsResponse[]>(Apis.getaccountsbylikename, {
    filter: 3,
    identity: 2,
    offset,
    limit,
  });
};

export const getAccountByAddress = function ({
  offset,
  limit = 5,
  accountaddress,
}: IGetAccountsParams) {
  return post<IAccountsResponse[]>(Apis.getaccountsbylikename, {
    filter: 2,
    limit,
    offset,
    accountaddress,
  });
};
