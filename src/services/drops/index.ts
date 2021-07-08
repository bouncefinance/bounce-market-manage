import { Apis, post, ToOffset } from '../index';
import type {
  IDropsRequest,
  IDropsResponse,
  IAddDropParams,
  IGetDropDetailParams,
  IDropDetailResponse,
} from './types';

export const getonedropsdetail = ({ offset, limit, dropsid, poolstate }: IGetDropDetailParams) => {
  return post<IDropDetailResponse[]>(Apis.getonedropsdetail, {
    offset,
    limit,
    dropsid,
    poolstate,
  });
};

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

export const closeOneDrop = (id: number) => {
  return post(Apis.updatedropsstate, { id, state: 3 });
};

export const showOneDrop = (id: number) => {
  return post(Apis.updatedropsstate, { id, state: 1 });
};

export const hideOneDrop = (id: number) => {
  return post(Apis.updatedropsstate, { id, state: 2 });
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
