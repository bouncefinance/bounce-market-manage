import request from 'umi-request'

export type LoginParamsType = {
  userName: string;
  password: string;
  mobile: string;
  captcha: string;
};

export async function getFakeCaptcha (mobile: string) {
  return request(`/api/login/captcha?mobile=${mobile}`);
}