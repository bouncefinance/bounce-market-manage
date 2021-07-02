import { Apis, post, ToOffset } from '../index';
import { IDropsRequest, IDropsResponse } from './types';

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
