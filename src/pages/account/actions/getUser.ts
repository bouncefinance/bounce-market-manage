import { ToOffset } from '@/services';
import request from 'umi-request';
import { IUserItem, UserRoleType } from './apiType';

interface IResult {
  code: number;
  data: Array<IUserItem>;
  total: number;
}
export interface IUserListParma {
  current: number;
  pageSize: number;
  role?: UserRoleType;
}
export const getUserList: (parma: IUserListParma, search: string) => Promise<IResult> = (
  {
    pageSize: limit,
    current: offset,
    role
  }: IUserListParma, search: string) => {
  return request.post('/api/bouadmin/main/auth/getaccountsbylikename', {
    data: {
      likestr: search, limit, offset: ToOffset(offset, limit),
      ...(role ? { identity: role } : {})
    }
  })
}
export const getUserListFormatResult = (data: IResult) => {
  return {
    total: data.total,
    list: data.data
  }
}

export const defaultUserPageParams = { current: 1, pageSize: 5 }