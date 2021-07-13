import { Apis, get } from '../index';
import type { IOverviewResponse } from './types';

export const getOverview = () => {
  return get<IOverviewResponse>(Apis.get_overviews);
};
