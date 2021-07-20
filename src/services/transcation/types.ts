/**
 * filter
 * 1 from
 * 2 to
 * 3 all
 */
export type TxnFilterType = 1 | 2;
export enum TxnFilterEnum {
  from = 1,
  to = 2,
}

export interface ITxnRequest {
  offset?: number;
  limit?: number;
  accountaddress?: string;
  starttime?: number;
  endtime?: number;
  filter?: TxnFilterType;
}

export interface ITxnResponse {
  id: number;
  height: number;
  txid: string;
  pool_id: number;
  contract: string;
  from: string;
  to: string;
  token_id: number;
  quantity: number;
  price: string;
  user_address: string;
  fromname: string;
  toname: string;
  Itemname: string;
  auction_event: string;
  auction_type: number;
  ctime: number;
  created_at: string;
  itemurl: string;
  fromurl: string;
  tourl: string;
}
