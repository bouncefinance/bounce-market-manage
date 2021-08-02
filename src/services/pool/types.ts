/**
 * Pool Sale Type
 * 0 live
 * 1 closed
 */
export type poolStateType = 0 | 1;
export enum poolStateEnum {
  live = 0,
  closed = 1,
}

/**
 * Pool Sale Type
 * 1 fixed swap
 * 2 English auction
 * 3 Timed fixed swap
 * 4 Timed English auction
 */
export type poolSaleType = 1 | 2 | 3 | 4;
export enum poolSaleEnum {
  fixed_swap = 1,
  English_auction = 2,
  timed_fixed_swap = 3,
  timed_English_auction = 4,
}

/**
 * Filter type
 * 1 likestr
 * 2 creator
 * 3 tokenid
 */
export type PoolFilterType = 1 | 2 | 3;
export enum PoolFilterEnum {
  likestr = 1,
  creator = 2,
  tokenid = 3,
}

export type modalActionType = 'add' | 'swap' | 'edit';

export interface IInsertPoolWeightParams {
  poolid: number;
  auctionType: poolSaleType;
  poolWeight: number;
}

export interface IDeletePoolWeightParams {
  poolid: number;
  auctionType: poolSaleType;
}

export type categoryType = 'image' | 'video';

export interface IPoolInfo {
  id?: number;
  poolid?: number;
  tokenid?: number;
  itemname: string;
  fileurl?: string;
  likecount?: number;
  price?: string;
  state?: number;
  creatorurl?: string;
  username: string;
  poolweight?: number;
  pooltype?: poolSaleType;
  category?: categoryType;
  channel?: string;
  standard?: number;
  supply?: number;
  creator?: string;
  owner?: string;
}

export interface ITopPool {
  id: number;
  creator: string;
  pool_id: number;
  name: string;
  token_id: number;
  price: string;
  nft_type: number;
  auctiontype: poolSaleType;
  state: number;
  pool_weight: number;
  imgurl: string;
  category: categoryType;
}

export interface IGetTopPoolsParams {
  offset: number;
  limit: number;
  orderweight: number;
}
export interface IGetPoolsParams {
  creator?: string;
  filter?: number;
  likestr?: string;
  limit?: number;
  offset?: number;
  tokenid?: number;
}

export interface IPoolResponse {
  artistpoolweight: number;
  category: string;
  contractaddress: string;
  creator: string;
  fileurl: string;
  id: number;
  itemname: string;
  litimgurl: string;
  poolweight: number;
  popularweight: number;
  standard: number;
  status: number;
  tokenid: number;
  username: string;
  state: poolStateType;
  pooltype: poolSaleType;
}
