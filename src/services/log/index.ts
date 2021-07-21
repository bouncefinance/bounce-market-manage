import { Apis, post, ToOffset } from '../index';
import type { ILogRequest, ILogReponse } from './types';

export const getLog = ({
  accountaddress,
  starttime,
  endtime,
  offset,
  limit,
  ordertype,
}: ILogRequest) => {
  return post<ILogReponse[]>(Apis.getoplogs, {
    accountaddress,
    starttime,
    endtime,
    offset: ToOffset(offset, limit!),
    limit,
    ordertype,
  });
};
