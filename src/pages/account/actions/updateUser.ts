import { Apis } from '@/services';
import type { UserCreationType, UserDisableType, UserRoleType } from '@/services/user/types';
import request from 'umi-request';

export const updateUserRole = async (param: { id: number | string; identity: UserRoleType }) => {
  const result: any = await request.post(Apis.updateuseridentity, {
    data: param,
  });
  if (result.code === 1) {
    return true;
  }
  return false;
};

export const updateUserDisplay = async (param: {
  id: number | string;
  state: UserCreationType;
}) => {
  const result: any = await request.post(Apis.updateuserstate, {
    data: param,
  });
  if (result.code === 1) {
    return true;
  }
  return false;
};

export const updateUserCreation = async (param: {
  id: number | string;
  display: UserDisableType;
}) => {
  const result: any = await request.post(Apis.updateuserdisplay, {
    data: param,
  });
  if (result.code === 1) {
    return true;
  }
  return false;
};
