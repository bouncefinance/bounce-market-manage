import { useState, useEffect } from 'react';
import { getMetaMaskAccount, web3 } from '@/tools/connect';
import { login } from '@/services/user';
import { TokenSymbol } from '@/types';

export type ITokens = {
  [key in TokenSymbol]: { token: string };
};
export const CHAIN_CACHE_KEY = 'chainAuth_cache';
const staticMessage = 'Welcome to Bounce!';
const staticPassword = 'xxx';

interface ISource {
  account: string;
  signature: string;
  tokens: ITokens;
  chainSymbol: TokenSymbol;
}
export default () => {
  let source: ISource = {
    chainSymbol: sessionStorage.symbol || TokenSymbol.BSC,
    account: '',
    signature: '',
    tokens: {
      bsc: { token: '' },
      rinkeby: { token: '' },
      eth: { token: '' },
      heco: { token: '' },
      matic: { token: '' },
    },
  };

  const handelCache = () => {
    sessionStorage.setItem(CHAIN_CACHE_KEY, JSON.stringify(source));
  };
  useEffect(() => {
    if (!source.account && !source.signature) {
      const cacheData = sessionStorage.getItem(CHAIN_CACHE_KEY) as any;
      if (cacheData) {
        source = JSON.parse(cacheData!);
      }
      const ethereum = window?.ethereum || null;
      if (ethereum) {
        ethereum.on('accountsChanged', () => {
          sessionStorage.clear();
          window.location.reload();
        });
      }
    }
  }, [source]);

  const onSignature = async () => {
    // 连接钱包获得account
    try {
      const addr = (await getMetaMaskAccount()) as string;
      source.account = addr;
      const sign = await web3.eth.personal.sign(staticMessage, addr, staticPassword);
      source.signature = sign;
      handelCache();
      Promise.resolve({
        account: addr,
        signature: sign,
      });
    } catch (err) {
      Promise.reject(err);
    }
  };
  /**
   * 切换链
   * @param symbol 需要切换的链名称
   * @returns {token} || {err}
   */
  const onChainLogin = async (symbol: TokenSymbol = TokenSymbol.BSC) => {
    source.chainSymbol = symbol;
    sessionStorage.symbol = symbol;
    const tokenData = source.tokens[symbol];
    if (tokenData.token) {
      sessionStorage.token = tokenData?.token;
      return Promise.resolve(tokenData);
    }
    try {
      const { code, msg, data } = (await login({
        signature: source.signature,
        accountaddress: source.account,
        message: staticMessage,
      })) as any;
      if (code === 200) {
        sessionStorage.token = data?.token;
        source.tokens = {
          ...source.tokens,
          [symbol]: data,
        };
        handelCache();
        return Promise.resolve(data);
      }
      return Promise.reject(msg);
    } catch (err) {
      return Promise.reject(err);
    }
  };

  return {
    state: source,
    reducers: {
      onChainLogin,
      onSignature,
    },
  };
};
