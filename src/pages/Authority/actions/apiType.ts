/**
 * 操作员角色(role);
 * 1 超级管理员(super);
 * 2 dropList管理员(enable dropLists);
 * 3 普通管理员 (basis);
 */
export type AuthorityRoleType = 1 | 2 | 3;
export enum AuthorityRoleEnum {
  super = 1,
  dropList = 2,
  basis = 3,
}

/**
 *  2 disable;
 *  1 enable;
 */
export type AuthorityRoleStatus = 2 | 1;
export enum AuthorityRoleStatusEnum {
  disable = 2,
  enable = 1,
}

export interface IAuthorityItem {
  address: string;
  id: number;
  /**
   * 备注名称(noteName)
   */
  notename: string;
  opRole: AuthorityRoleType;
  status: AuthorityRoleStatus;
  userImageUrl: string;
  imgurl: string;
}
