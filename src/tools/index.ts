import { exportErc20Info, weiToNum } from './conenct';

export const getPriceByToken1 = async (price: string, token1: string) => {
  if (!price || !token1) return '';
  const tokenInfo = await exportErc20Info(token1);
  const newPrice = weiToNum(price, tokenInfo.decimals);
  // ${ tokenInfo.symbol }
  return `${newPrice}`;
};

/**
 * module Url Replace
 * @param {AxiosRequestConfig} config
 * @param {{key: string; value: string}[]} keyValues
 * @returns
 */
export const moduleUrlReplace = (
  config: { url: string },
  keyValues: Array<{ key: string; value: string }>,
) => {
  for (const item of keyValues as any) {
    if (config.url && config.url.substr(0, item.key.length) === item.key) {
      config.url = item.value + config.url.substring(item.key.length);
      break;
    }
  }
  return config;
};
