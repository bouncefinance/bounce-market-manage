export interface IRequest<TFilter> {
  filters: TFilter;
  current?: number;
  pageSize?: number;
  sorter?: any;
}

export type IResCode = -1 | 0 | 502 | 503 | 504;

export interface IResponse<TData> {
  code: IResCode;
  msg?: string;
  data: TData;
  result?: TData; // 部分版本为result？？？
  total?: number;
}
