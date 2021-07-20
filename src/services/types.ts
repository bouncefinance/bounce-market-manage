export interface IRequest<TFilter> {
  filters: TFilter;
  current?: number;
  pageSize?: number;
  sorter?: any;
}

export type IResCode = -1 | 0 | 1 | 502 | 503 | 504 | 200;

export interface IResponse<TData> {
  code: IResCode;
  msg?: string;
  list?: TData; // 部分版本为list？？？
  data?: TData; // 部分版本为data？？？
  result?: TData; // 部分版本为result？？？
  total?: number;
}
