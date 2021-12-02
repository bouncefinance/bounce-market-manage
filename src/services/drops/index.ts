import { Apis, post, ToOffset } from '../index';
import type {
  IDropsRequest,
  IDropsResponse,
  IAddDropParams,
  IGetDropDetailParams,
  IUpdataDropParams,
  IDropResp,
} from './types';

export const getOneDropDetail = ({ /* offset, limit,  */ dropsid }: IGetDropDetailParams) => {
  return post<IDropResp>(Apis.getonedropsdetail, {
    // offset,
    // limit,
    dropsid,
    poolstate: 2,
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
  return post(Apis.updatedropsdisplay, { id, display: 1 });
};

export const hideOneDrop = (id: number) => {
  return post(Apis.updatedropsdisplay, { id, display: 2 });
};

export const addOneDrop = ({
  accountaddress,
  website,
  twitter,
  instagram,
  title,
  description,
  bgcolor,
  coverimgurl,
  poolids,
  ordernum,
  dropdate,
  videourl,
}: IAddDropParams) => {
  return post(Apis.addaccountdrops, {
    accountaddress,
    website,
    twitter,
    instagram,
    title,
    description,
    bgcolor,
    coverimgurl,
    poolids,
    ordernum,
    dropdate,
    videourl,
  });
};

export const updateOneDrop = ({
  id,
  accountaddress,
  website,
  twitter,
  instagram,
  title,
  description,
  bgcolor,
  coverimgurl,
  poolids,
  ordernum,
  dropdate,
  videourl,
}: IUpdataDropParams) => {
  return post(Apis.updatedrops, {
    id,
    accountaddress,
    website,
    twitter,
    instagram,
    title,
    description,
    bgcolor,
    coverimgurl,
    poolids,
    ordernum,
    dropdate,
    videourl,
  });
};
