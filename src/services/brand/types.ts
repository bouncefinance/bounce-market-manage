export type brandStandardType = 0 | 1; // 0：ERC-721，1：ERC-1155

export type brandStatusType = 0 | 1; // 0：on display，1：hidden

export type modalActionType = 'add' | 'swap' | 'edit';

/**
 * User Display
 * 1 likestr
 * 2 creator
 * 3 brandid
 */
export type BrandFilterType = 1 | 2 | 3;
export enum BrandFilterEnum {
  likestr = 1,
  creator = 2,
  brandid = 3,
}

export interface IUpdateBrandWeightParams {
  id: number;
  popularweight: number;
}

export interface IBrandRequest {
  limit?: number;
  offset?: number;
  filter?: number;
  creator?: string;
  likestr?: string;
  brandid?: number;
}

export interface IBrandResponse {
  id: number;
  creator: string;
  ownername: string;
  owneraddress: string;
  contractaddress: string;
  brandname: string;
  description: string;
  imgurl: string;
  standard: 0;
  status: 0;
  popularweight: number;
  bandimgurl: string;
  ownerimg: string;
}