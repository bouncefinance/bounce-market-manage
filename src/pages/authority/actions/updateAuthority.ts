import { Apis } from '@/services';
import { message } from 'antd';
import request from 'umi-request';
import type { AuthorityRoleStatus, AuthorityRoleType } from './apiType';

export interface IUpdateAuthorityParams {
  address?: string;
  id: number;
  notename?: string;
  opRole?: AuthorityRoleType;
  status?: AuthorityRoleStatus;
  userImageUrl?: string;
  username?: string;
}
const updateAuthority = async (param: IUpdateAuthorityParams) => {
  const result: any = await request.post(Apis.updateoperatorinfo, {
    data: param,
  });
  if (result.code === 1) {
    return true;
  }
  message.error(result.msg);
  return false;
};
export default updateAuthority;

export const deleteAuthority = async (param: { id: number; address: string }) => {
  const result: any = await request.post(Apis.deleteoperators, {
    data: param,
  });
  if (result.code === 1) {
    return true;
  }
  return false;
};
