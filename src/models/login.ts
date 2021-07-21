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

export default () => {
  const [chainSymbol, setChainSymbolSymbol] = useState<TokenSymbol>(
    sessionStorage.symbol || TokenSymbol.BSC,
  );
  const [account, setAccount] = useState<string>('');
  const [signature, setSignature] = useState<string>('');
  const [tokens, setTokens] = useState<ITokens>({
    bsc: { token: '' },
    rinkeby: { token: '' },
    eth: { token: '' },
    heco: { token: '' },
    matic: { token: '' },
  });

  useEffect(() => {
    if (account || signature) {
      sessionStorage.setItem(
        CHAIN_CACHE_KEY,
        JSON.stringify({
          account,
          signature,
          tokens,
        }),
      );
    } else {
      let data = sessionStorage.getItem(CHAIN_CACHE_KEY) as any;
      if (data) {
        data = JSON.parse(data!);
        if (data?.account) setAccount(data.account);
        if (data?.signature) setSignature(data.signature);
        if (data?.tokens) setTokens(data.tokens);
      }
    }
  }, [account, tokens, signature]);

  const onSignature = async () => {
    // 连接钱包获得account
    try {
      const addr = (await getMetaMaskAccount()) as string;
      setAccount(addr);
      const sign = await web3.eth.personal.sign(staticMessage, addr, staticPassword);
      setSignature(sign);
      return Promise.resolve({
        account: addr,
        signature: sign,
      });
    } catch (err) {
      return Promise.reject(err);
    }
  };
  /**
   * 切换链
   * @param symbol 需要切换的链名称
   * @returns {token} || {err}
   */
  const onChainLogin = async (symbol: TokenSymbol = TokenSymbol.BSC) => {
    setChainSymbolSymbol(symbol);
    sessionStorage.symbol = symbol;
    const tokenData = tokens[symbol];
    if (tokenData.token) {
      sessionStorage.token = tokenData?.token;
      return Promise.resolve(tokenData);
    }
    try {
      const { code, msg, data } = (await login({
        signature,
        accountaddress: account,
        message: staticMessage,
      })) as any;
      if (code === 200) {
        sessionStorage.token = data?.token;
        setTokens({
          ...tokens,
          [symbol]: data,
        });
        return Promise.resolve(data);
      }
      return Promise.reject(msg);
    } catch (err) {
      return Promise.reject(err);
    }
  };

  return {
    state: {
      tokens,
      account,
      signature,
      chainSymbol,
    },
    reducers: {
      onChainLogin,
      onSignature,
    },
  };
};
