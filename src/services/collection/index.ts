import { Apis, post } from '../index';
import type { IAddCollectionInfoParams } from './types';

export const addCollectionInfo = (params: IAddCollectionInfoParams) => {
  return post(Apis.addCollectionInfo, params);
};
