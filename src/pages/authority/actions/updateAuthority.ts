import request from 'umi-request';
import { AuthorityRoleStatus, AuthorityRoleType } from './apiType';

export interface IUpdateAuthorityParams {
  address?: string;
  id: number,
  notename?: string;
  opRole?: AuthorityRoleType,
  status?: AuthorityRoleStatus,
  userImageUrl?: string;
  username?: string;
}
const updateAuthority = async (param: IUpdateAuthorityParams) => {
  const result: any = await request.post('/api/bouadmin/main/auth/updateoperatorinfo', {
    data: param
  })
  if (result.code === 1) {
    return true
  }
  return false
}
export default updateAuthority

export const deleteAuthority = async (param: { id: number; address: string }) => {
  const result: any = await request.post('/api/bouadmin/main/auth/deleteoperators', {
    data: param
  })
  if (result.code === 1) {
    return true
  }
  return false
}