export type DropsState = 0 | 1 | 2 | 3;

// 1:display, 2:hidden
export type DropDisplay = 1 | 2;

export interface IAddDropParams {
  accountaddress: string;
  website?: string;
  twitter?: string;
  instagram?: string;
  title: string;
  description: string;
  bgcolor?: string;
  coverimgurl?: string;
  dropdate: number;
  poolids: number[];
  ordernum: number[];
  videourl?: string;
}

export interface IUpdataDropParams extends IAddDropParams {
  id: number;
}

export interface IDropsRequest {
  accountaddress?: string;
  offset?: number;
  limit?: number;
  state?: DropsState;
  orderType?: number;
}
export interface IDropsResponse {
  id: number;
  title: string;
  username: string;
  accountaddress: string;
  bgcolor: string;
  coverimgurl: string;
  created_at: string;
  description?: string;
  display: number;
  dropdate: string;
  nfts: number;
  state: DropsState;
  updated_at: string;
  instagram: string;
  twitter: string;
  website: string;
}

export interface IGetDropDetailParams {
  offset?: number;
  limit?: number;
  dropsid: number;
  poolstate?: number;
}

export enum EDropState {
  COMING_SOON = 1,
  LIVE = 2,
  PREVIOUS = 3,
}
export interface IDropResp {
  accountaddress: string;
  website: string;
  twitter: string;
  instagram: string;
  title: string;
  description: string;
  bgcolor: string;
  coverimgurl: string;
  blindcoverimgurl: string;
  videourl: string;
  dropdate: number;
  opendate: number;
  nfts: number;
  collection: string;
  price: string;
  notsaled: number;
  droptype: number;
  state: EDropState;
  maxbuycount: number;
  username: string;
  creatorurl: string;
  created_at: string;
  poolsinfo: null | IPoolsInfo[];
}

export interface IPoolsInfo {
  itemname: string;
  fileurl: string;
  price: string;
  username: string;
  standard: number;
  contractaddress: string;
  tokenid: string;
  auctionpoolid: number;
  creatorurl: string;
  created_at: string;
}
