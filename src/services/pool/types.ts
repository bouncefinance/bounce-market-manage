export type poolStateType = 0 | 1; // 0：live，1：closed

/**
 * Pool Info Standard
 * 0 fixed swap
 * 1 English auction
 */
export type poolInfoStandard = 0 | 1; // 0：fixed swap 1：English auction
export enum poolInfoEnum {
  fixed_swap = 0,
  English_auction = 1,
}

/**
 * Pool Sale Type
 * 1 fixed swap
 * 2 English auction
 */
export type poolSaleType = 1 | 2 | 3 | 4; // 1：fixed swap 2：English auction
export enum poolSaleEnum {
  fixed_swap = 1,
  English_auction = 2,
  timed_fixed_swap = 3,
  timed_English_auction = 4,
}

/**
 * User Display
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

export interface IUpdatePoolWeightParams {
  poolid: number;
  standard: poolSaleType;
  weight?: number;
}

export interface IPoolInfo {
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
  category?: string;
  channel?: string;
  standard?: number;
  supply?: number;
  creator?: string;
  owner?: string;
}

export interface ITopPool {
  id: number;
  poolid: number;
  poolweight: number;
  standard: poolSaleType;
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
