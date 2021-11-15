import { Apis, post, ToOffset } from '../index';
import type {
  IAddAirdropParams,
  IDelAirdropParams,
  IExportAirdropUserInfoParams,
  IExportAirdropUserInfoResponse,
  IQueryAllAirdropParams,
  IQueryAllAirdropResponse,
  IQueryOneAirdropParams,
  IQueryOneAirdropResponse,
  IQueryOneAirdropUserInfoParams,
  IQueryOneAirdropUserInfoResponse,
  IUpdateAirdropParams,
} from './types';

export const addAirdrop = (params: IAddAirdropParams) => {
  return post(Apis.add_airdrop, params);
};

export const delAirdrop = (params: IDelAirdropParams) => {
  return post(Apis.del_airdrop, params);
};

export const queryAllAirdrop = ({ state = 1, limit = 10, offset = 0 }: IQueryAllAirdropParams) => {
  return post<IQueryAllAirdropResponse[]>(Apis.query_allAirdrop, {
    state,
    limit,
    offset: ToOffset(offset, limit!),
  });
};

export const queryOneAirdropUserInfo = (params: IQueryOneAirdropUserInfoParams) => {
  return post<IQueryOneAirdropUserInfoResponse[]>(Apis.query_oneairdrop_userinfo, params);
};

export const queryOneAirdrop = (params: IQueryOneAirdropParams) => {
  return post<IQueryOneAirdropResponse>(Apis.query_oneAirdrop, params);
};

export const updateAirdrop = (params: IUpdateAirdropParams) => {
  return post(Apis.update_airdrop, params);
};

export const exportAirdropUserinfo = (params: IExportAirdropUserInfoParams) => {
  return post<IExportAirdropUserInfoResponse[]>(Apis.export_airdrop_userinfo, params);
};
