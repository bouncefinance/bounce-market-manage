/**
 * order
 * 1 ascend
 * 2 descend
 */
export type LogOrderType = 1 | 2;
export enum LogOrderEnum {
  ascend = 1,
  descend = 2,
}

export interface ILogRequest {
  accountaddress: string;
  starttime: string;
  endtime: string;
  offset: number;
  limit: number;
  ordertype: LogOrderType;
}

export interface ILogReponse {
  id: number;
  Address: string;
  op_path: string;
  username: string;
  op_module: string;
  op_purpose: string;
  op_ip: string;
  op_parameters: string;
  op_result: number;
  created_at: string;
}
