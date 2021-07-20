import { Apis } from '@/services';
import request from 'umi-request';
import type { IUpdateAuthorityParams } from './updateAuthority';

export type IAddAuthorityParams = Omit<IUpdateAuthorityParams, 'id'>;

const addAuthority = async (param: IAddAuthorityParams) => {
  const result: any = await request.post(Apis.addoperators, {
    data: param,
  });
  return result;
};
export default addAuthority;
