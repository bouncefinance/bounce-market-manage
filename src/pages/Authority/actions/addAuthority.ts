import request from 'umi-request';
import { IUpdateAuthorityParams } from './updateAuthority';

export type IAddAuthorityParams = Omit<IUpdateAuthorityParams, 'id'>

const addAuthority = async (param: IAddAuthorityParams) => {
  const result: any = await request.post('/api/bouadmin/main/auth/addoperators', {
    data: param
  })
  return result
}
export default addAuthority