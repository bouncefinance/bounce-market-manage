import { Apis, post, ToOffset } from '../index';
import type {
  IAddBlindBoxParams,
  IDelBlindBoxParams,
  IQueryAllBlindBoxParams,
  IQueryAllBlindBoxResponse,
  IQueryOneBlindBoxParams,
  IQueryOneBlindBoxResponse,
  IUpdateBlindBoxParams,
} from './types';

export const addBlindBox = (params: IAddBlindBoxParams) => {
  return post(Apis.add_blindbox, params);
};

export const delBlindBox = (params: IDelBlindBoxParams) => {
  return post(Apis.del_blindbox, params);
};

export const queryAllBlindBox = ({
  state = 2,
  limit = 10,
  offset = 1,
}: IQueryAllBlindBoxParams) => {
  return post<IQueryAllBlindBoxResponse[]>(Apis.query_allblindbox, {
    state,
    limit,
    offset: ToOffset(offset, limit!),
  });
};

export const queryOneBlindBox = (params: IQueryOneBlindBoxParams) => {
  return post<IQueryOneBlindBoxResponse>(Apis.query_oneblindbox, params);
};

export const updateBlindBox = (params: IUpdateBlindBoxParams) => {
  return post(Apis.update_blindbox, params);
};
