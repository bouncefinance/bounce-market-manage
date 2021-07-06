export type DropsState = 0 | 1 | 2 | 3;

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

export interface IGetPoolsResponse {
  id: number;
  contractaddress: string;
  tokenid: number;
  metadata: string;
  category: string;
  channel: string;
  itemsymbol: string;
  standard: number;
  itemname: string;
  externallink: string;
  description: string;
  fileurl: string;
  litimgurl: string;
  supply: number;
  creator: string;
  username: string;
  popularweight: number;
  poolweight: number;
  likecount: number;
  artistpoolweight: number;
  status: number;
  created_at: string;
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

export interface IGetAccountsParams {
  filter?: number;
  offset?: number;
  limit?: number;
  accountaddress?: DropsState;
  identity?: number;
  likestr?: number;
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
export interface IAccountsResponse {
  accountaddress: string;
  bandimgurl: string;
  bio: string;
  bounceid: number;
  created_at: string;
  display: number;
  email: string;
  facebook: string;
  fullnam: string;
  id: number;
  identity: number;
  imgurl: string;
  instagram: string;
  state: number;
  top_weight: number;
  twitter: string;
  updated_at: string;
  username: string;
  website: string;
}

export interface INftResponse {
  artistpoolweight: number;
  category: string;
  channel: string;
  contractaddress: string;
  created_at: string;
  creator: string;
  description: string;
  externallink: string;
  fileurl: string;
  id: number;
  itemname: string;
  itemsymbol: string;
  likecount: number;
  litimgurl: string;
  metadata: string;
  poolweight: number;
  popularweight: number;
  standard: number;
  status: number;
  supply: number;
  tokenid: number;
  username: string;
}
