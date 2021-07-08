export type DropsState = 0 | 1 | 2 | 3;

// 1:display, 2:hidden
export type dropDisplay = 1 | 2;

export interface IAddDropParams {
  accountaddress: string;
  website: string;
  twitter: string;
  Instagram: string;
  title: string;
  description: string;
  bgcolor: string;
  coverimgurl: string;
  poolids: number[];
  ordernum: number[];
  dropdate: number;
}

export interface IGetPoolsParams {
  creator?: string;
  filter?: number;
  likestr?: string;
  limit?: number;
  offset?: number;
  tokenid?: number;
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
  offset: number;
  limit: number;
  dropsid: number;
  poolstate: number;
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

// 0：live，1：closed
export type poolStateType = 0 | 1;
export interface IPoolResponse {
  artistpoolweight: number;
  category: string;
  channel: string;
  contractaddress: string;
  created_at: string;
  creator: string;
  fileurl: string;
  id: number;
  itemname: string;
  itemsymbol: string;
  likecount: number;
  litimgurl: string;
  poolweight: number;
  popularweight: number;
  standard: number;
  status: number;
  tokenid: number;
  username: string;
  state: poolStateType;
}
