import { Apis, post, ToOffset, get } from '..';
import type { IResponse } from '../types';
import type { IGetAccountsParams, ILoginRequest, ITopArtist, IUserItem, IUserListParma } from './types';

/**
 * 用户登录
 * @param {address,signature}
 * @returns tokens
 */
export const login = (params: ILoginRequest) => post(Apis.jwtauth, params);
/**
 * 获取用户权限
 */
export const getUserRole = (address: string) => get(Apis.getoperatorsinfo, { address });

export const updataOneTopArtist = ({
  topweight,
  username,
}: {
  topweight: number;
  username: string;
}) => {
  return post(Apis.updatetopweight, {
    topweight,
    username,
  });
};

export const deleteOneTopArtist = ({ username }: { username: string }) => {
  return post(Apis.deletehotweight, {
    username,
  });
};

export const getTopArtistsList = () => {
  return get<ITopArtist[]>(Apis.gettopartistslist);
};

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

// filter: 1:单字段查找, 2:关联查找
export const getVerfiedUsersByName = ({ offset, limit, likestr }: IGetAccountsParams) => {
  return post<IUserItem[]>(Apis.getaccountsbylikename, {
    filter: 1,
    identity: 2,
    offset,
    limit,
    likestr,
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
