export type AirdropState = 1 | 2 | 3;

export interface IUserInfo {
  useravatars: string;
  usernames: string;
}

export type ModalAction = 'add' | 'edit';

export interface IAddAirdropParams {
  accountaddress: string;
  airdropname: string;
  category: string;
  channel: string;
  collection: string;
  coverimgurl: string;
  description: string;
  dropdate: number;
  opendate: number;
  nftdescription: string;
  tokenimgs: string;
  totalsupply: number;
  userinfos: IUserInfo[];
}

export interface IDelAirdropParams {
  id: number;
}
export interface IQueryAllAirdropResponse {
  id: number;
  collection: string;
  Brandname: string;
  totalminted: 7;
  title: string;
  coverimgurl: string;
  nfts: number;
  created_at: string;
}

export interface IQueryAllAirdropParams {
  state?: number;
  limit?: number;
  offset?: number;
}

export interface IQueryOneAirdropUserInfoParams {
  id: number;
}

export interface IQueryOneAirdropUserInfoResponse {
  id: number;
  dropsid: number;
  username: string;
  imgurl: number;
  tokenid: number;
  contractaddress: string;
  verifycode: string;
  state: number;
  reserve: string;
  created_at: string;
  updated_at: string;
}
export interface IQueryOneAirdropParams {
  id: number;
}

export interface IQueryOneAirdropResponse {
  id: number;
  accountaddress: string;
  collection: string;
  website: null;
  twitter: string;
  instagram: string;
  facebook: string | null;
  title: string;
  description: string;
  price: string;
  category: string;
  channel: string;
  tokenimgs: string;
  bgcolor: null;
  coverimgurl: string;
  blindcoverimgurl: string;
  videourl: null;
  dropdate: number;
  opendate: number;
  maxbuycount: number;
  nftdescription: string;
  nfts: number;
  state: number;
  droptype: number;
  display: number;
  created_at: string;
  updated_at: string;
}

export interface IUpdateAirdropParams {
  blindcoverimgurl: 'string';
  blindname: string;
  category: string;
  channel: string;
  coverimgurl: string;
  description: string;
  // facebook: string;
  id: number;
  instagram: string;
  nftdescription: string;
  tokenimgs: string;
  twitter: string;
  website: string;
}

export interface IExportAirdropUserInfoParams {
  dropsid: number;
}

export interface IExportAirdropUserInfoResponse {
  usernames: string;
  useravatar: string;
  nftname: string;
  nftimgurl: string;
  tokenid: number;
  verifycode: string;
}
