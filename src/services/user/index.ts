import { Apis, post, ToOffset } from '..';
import type { IResponse } from '../types';
import type { IGetAccountsParams, IUserItem, IUserListParma } from './types';

export const getUserList = (
  { pageSize: limit, current: offset, role }: IUserListParma,
  search: string,
) => {
  return post<IUserItem[]>(Apis.getaccountsbylikename, {
    likestr: search,
    accountaddress: search,
    filter: 2,
    limit,
    offset: ToOffset(offset, limit),
    ...(role ? { identity: role } : {}),
  });
};

export const getUserListFormatResult = (data: IResponse<IUserItem[]>) => {
  return {
    total: data.total ?? 0,
    list: data.data,
  };
};

export const defaultUserPageParams = { current: 1, pageSize: 5 };

// filter: 1:normal, 2:identity
export const getVerfiedUsersList = ({ offset, limit }: IGetAccountsParams) => {
  return post<IUserItem[]>(Apis.getaccountsbylikename, {
    filter: 3,
    identity: 2,
    offset,
    limit,
  });
};

export const getAccountByAddress = ({ offset, limit = 5, accountaddress }: IGetAccountsParams) => {
  return post<IUserItem[]>(Apis.getaccountsbylikename, {
    filter: 2,
    limit,
    offset,
    accountaddress,
  });
};
