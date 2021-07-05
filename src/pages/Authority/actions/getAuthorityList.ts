import { ToOffset } from '@/services';
import request from 'umi-request';
import { IAuthorityItem } from './apiType';

interface IResult {
  code: number;
  data: Array<IAuthorityItem>;
  total: number;
}
export interface IAuthorityListParma {
  current: number;
  pageSize: number;
  gender?: string;
  userId?: string;
}
export const getAuthorityList: (parma: IAuthorityListParma, address: string) => Promise<IResult> = (
  {
    pageSize: limit,
    current: offset,
    userId
  }: IAuthorityListParma, address: string) => {
  return request.post('/api/bouadmin/main/auth/getoperatorlist', {
    data: {
      inputinfo: address, limit, offset: ToOffset(offset, limit), userId
    }
  })
}
export const getAuthorityListFormatResult = (data: IResult) => {
  return {
    total: data.total,
    list: data.data
  }
}

export const defaultAuthorityPageParams = { current: 1, pageSize: 7 }