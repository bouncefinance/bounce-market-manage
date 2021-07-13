export type DropsState = 0 | 1 | 2 | 3;

// 1:display, 2:hidden
export type DropDisplay = 1 | 2;

export interface IAddDropParams {
  accountaddress: string;
  website: string;
  twitter: string;
  instagram: string;
  title: string;
  description: string;
  bgcolor: string;
  coverimgurl: string;
  dropdate: number;
  poolids: number[];
  ordernum: number[];
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

export interface IDropDetailResponse {
  accountaddress: string;
  website: string;
  twitter: string;
  instagram: string;
  title: string;
  description: string;
  bgcolor: string;
  coverimgurl: string;
  dropdate: number;
  nfts: number;
  itemname: string;
  fileurl: string;
  price: string;
  username: string;
  standard: number;
  tokenid: number;
  auctionpoolid: number;
  ordernum: number;
  creatorurl: string;
  created_at: string;
}
