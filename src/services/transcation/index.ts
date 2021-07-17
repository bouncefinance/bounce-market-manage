import { Apis, post, ToOffset } from '../index';
import type { ITranscationsRequest, ITranscationsResponse } from './types';

export const getTranscations = ({
  offset = 1,
  limit = 10,
  accountaddress,
  starttime,
  endtime,
  filter = 3,
}: ITranscationsRequest) => {
  return post<ITranscationsResponse[]>(Apis.gettxsbyfilter, {
    limit,
    offset: ToOffset(offset, limit!),
    accountaddress,
    starttime,
    endtime,
    filter,
  });
};
