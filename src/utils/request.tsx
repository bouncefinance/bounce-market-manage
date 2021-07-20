import type { RequestConfig } from 'umi';
import { notification } from 'antd';
import { history } from 'umi';
import UMIRequest from 'umi-request';
import { APIPrefixUrl } from '@/tools/const';
// import { moduleUrlReplace } from '@/tools';

export const InitRequest = () => {
  UMIRequest.use(async (ctx, next) => {
    if (ctx.req.url.substring(0, 4) !== 'http') {
      const beforeUrl = ctx.req.url;
      const fixMatch = ctx.req // moduleUrlReplace(ctx.req, AXIOS_URL_MATCH_ARRAY);
      if (beforeUrl === fixMatch.url) {
        ctx.req.url = APIPrefixUrl + ctx.req.url;
      }
    }
    const headers = {
      ...ctx.req.options.headers,
      token: localStorage.token || '',
    };
    if (ctx.req.url === 'https://nftview.bounce.finance/v2/bsc/nft') delete headers.token;
    ctx.req.options.headers = headers;
    await next();
    if (ctx.res.code === -1) {
      history.replace('/user/login');
    }
  });
};

/**
 * 异常处理程序
 * @see https://beta-pro.ant.design/docs/request-cn
 */
export const request: RequestConfig = {
  errorHandler: (error: any) => {
    const { response } = error;

    if (!response) {
      notification.error({
        description: '您的网络发生异常，无法连接服务器',
        message: '网络异常',
      });
    }
    throw error;
  },
};
