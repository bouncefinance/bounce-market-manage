export interface INftItem {
  artistpoolweight: number;
  category: string;
  channel: string;
  token0: string; // contractaddress
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
  updated_at: string;
}

/**
 * Nft Display State
 * 1 show
 * 2 hide
 */
export type NftDisplayState = 1 | 2;
export enum NftDisplayEnum {
  show = 0,
  hide = 1,
}
