import request from 'umi-request'

export type LoginParamsType = {
  userName: string;
  password: string;
  mobile: string;
  captcha: string;
};

export async function fakeAccountLogin (params: LoginParamsType) {
  // return request('/api/login/account', {
  //   method: 'POST',
  //   data: params,
  // });
  console.log(params)
  return new Promise((ok) => {
    ok({ data: 1 })
  })
}

export async function getFakeCaptcha (mobile: string) {
  return request(`/api/login/captcha?mobile=${mobile}`);
}