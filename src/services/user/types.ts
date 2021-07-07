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