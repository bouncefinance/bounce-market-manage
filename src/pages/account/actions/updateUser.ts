import type { UserCreationType, UserDisableType, UserRoleType } from '@/services/user/types';
import request from 'umi-request';

export const updateUserRole = async (param: { id: number | string; identity: UserRoleType }) => {
  const result: any = await request.post('/api/bouadmin/main/auth/updateuseridentity', {
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
  const result: any = await request.post('/api/bouadmin/main/auth/updateuserstate', {
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
  const result: any = await request.post('/api/bouadmin/main/auth/updateuserdisplay', {
    data: param,
  });
  if (result.code === 1) {
    return true;
  }
  return false;
};
