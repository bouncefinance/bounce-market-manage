/**
 * User Role
 * 1 normal
 * 2 verified
 */
export type UserRoleType = 1 | 2;
export enum UserRoleEnum {
  Normal = 1,
  Verified = 2,
}

/**
 * User Display
 * 1 normal
 * 2 Display
 */
export type UserDisableType = 1 | 2;
export enum UserDisableEnum {
  Normal = 1,
  Disable = 2,
}

/**
 * User Creation
 * 1 normal
 * 2 Display
 */
export type UserCreationType = 1 | 2;
export enum UserCreationEnum {
  Normal = 1,
  Disable = 2,
}

export interface IUserItem {
  imgurl: string;
  accountaddress: string;
  email: string;
  id: number;
  identity: UserRoleType;
  state: UserCreationType;
  display: UserDisableType;
}

export interface IUserListParma {
  current: number;
  pageSize: number;
  role?: UserRoleType;
}

export interface IGetAccountsParams {
  filter?: number;
  offset?: number;
  limit?: number;
  accountaddress?: string;
  identity?: number;
  likestr?: number;
}

// export interface IGetPoolsResponse {
//   id: number;
//   contractaddress: string;
//   tokenid: number;
//   metadata: string;
//   category: string;
//   channel: string;
//   itemsymbol: string;
//   standard: number;
//   itemname: string;
//   externallink: string;
//   description: string;
//   fileurl: string;
//   litimgurl: string;
//   supply: number;
//   creator: string;
//   username: string;
//   popularweight: number;
//   poolweight: number;
//   likecount: number;
//   artistpoolweight: number;
//   status: number;
//   created_at: string;
// }

// export interface IAccountsResponse {
//   accountaddress: string;
//   bandimgurl: string;
//   bio: string;
//   bounceid: number;
//   created_at: string;
//   display: number;
//   email: string;
//   facebook: string;
//   fullnam: string;
//   id: number;
//   identity: number;
//   imgurl: string;
//   instagram: string;
//   state: number;
//   top_weight: number;
//   twitter: string;
//   updated_at: string;
//   username: string;
//   website: string;
// }
