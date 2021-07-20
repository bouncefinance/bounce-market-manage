import { Apis, ToOffset } from '@/services';
import request from 'umi-request';
import type { IAuthorityItem } from './apiType';

interface IResult {
  code: number;
  data: IAuthorityItem[];
  total: number;
}
export interface IAuthorityListParma {
  current: number;
  pageSize: number;
  gender?: string;
  userId?: string;
}
export const getAuthorityList: (parma: IAuthorityListParma, address: string) => Promise<IResult> = (
  { pageSize: limit, current: offset, userId }: IAuthorityListParma,
  address: string,
) => {
  return request.post(Apis.getoperatorlist, {
    data: {
      inputinfo: address,
      limit,
      offset: ToOffset(offset, limit),
      userId,
    },
  });
};
export const getAuthorityListFormatResult = (data: IResult) => {
  return {
    total: data.total,
    list: data.data,
  };
};

export const defaultAuthorityPageParams = { current: 1, pageSize: 7 };
