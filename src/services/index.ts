import { ApiServiceUrl, Apis } from './apis';
import UMIRequest from 'umi-request';
import { history } from 'umi';
import type { IResponse } from './types';
import { IsPre } from '@/tools/const';

/**
 * 用于处理分页Offset偏移量计算
 * @param page 页码
 * @param pageSize 单页总数
 * @returns 请求下标(offset)
 */
export const ToOffset = (page: number = 1, pageSize: number): number => {
  // pagination中offset从1开始
  return (page - 1) * pageSize;
};

/**
 * Get函数
 * @param url
 * @param params
 * @returns UMIRequest
 */
export function get<TDataType>(url: string, params?: object) {
  return UMIRequest<IResponse<TDataType>>(url, {
    params,
    method: 'get',
  });
}
/**
 * Post函数
 * @param url
 * @param params
 * @returns UMIRequest
 */
export function post<TDataType>(url: string, params?: object) {
  return UMIRequest<IResponse<TDataType>>(url, {
    method: 'post',
    data: params,
  });
}
// Request 拦截
UMIRequest.interceptors.request.use((url, options) => {
  const serviceUrl = IsPre ? ApiServiceUrl.DEV : ApiServiceUrl.PRO;
  return {
    url: serviceUrl + url,
    options,
  };
});

// Response 拦截
UMIRequest.interceptors.response.use((res) => {
  // 无权访问
  if (res.status === 403) {
    history.replace('/user/login');
  }
  return res;
});
export { Apis };
