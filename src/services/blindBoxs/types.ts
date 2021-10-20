export type BlindBoxState = 1 | 2 | 3;

export interface IAddBlindBoxParams {
  accountaddress: string;
  blindname: string;
  blindcoverimgurl: string;
  category: string;
  channel: string;
  collection: string;
  coverimgurl: string;
  description: string;
  dropdate: number;
  facebook?: string;
  instagram: string;
  maxbuycount: number;
  nftdescription: string;
  opendate: number;
  price: string;
  tokenimgs: string;
  totalsupply: number;
  twitter: string;
  website: string;
}

export interface IDelBlindBoxParams {
  id: number;
}

export interface IQueryAllBlindBoxParams {
  filter?: number;
  limit?: number;
  offset?: number;
}

export interface IQueryAllBlindBoxResponse {
  id: number;
  accountaddress: string;
  username: string;
  website: string;
  twitter: string;
  instagram: string;
  title: string;
  description: string;
  bgcolor: string;
  coverimgurl: string;
  videourl: string;
  dropdate: number;
  nfts: number;
  state: number;
  display: number;
  created_at: string;
  updated_at: string;
}

export interface IQueryAllBlindBoxParams {
  state?: number;
  limit?: number;
  offset?: number;
}

export interface IQueryOneBlindBoxParams {
  id: number;
}

export interface IQueryOneBlindBoxResponse {
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

export interface IUpdateBlindBoxParams {
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
