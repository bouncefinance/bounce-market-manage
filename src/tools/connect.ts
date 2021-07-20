import Web3 from 'web3';
import { APIPrefixUrl } from './const';


export const web3Provide = Web3.givenProvider || APIPrefixUrl;
export const web3 = new Web3(web3Provide);

export interface IMetamaskErr {
  code: number;
  message: string;
  stack: string;
}
/**
 * Metamask 获取Account
 * @returns account:string
 */
export const getMetaMaskAccount = (): Promise<string | null> => {
  const ethereum = window?.ethereum || null;
  return new Promise((resolve, reject) => {
    // 未注入ethereum -> 未安装Metamaks
    if (!ethereum) {
      reject(new Error('Consider installing MetaMask!'));
      return false;
    }

    /**
     * 我们计划在最近补充一个有关网络切换的API，参考下面链接
     * https:// github.com/MetaMask/metamask-extension/issues/3663
     */
    ethereum
      ?.request({ method: 'eth_requestAccounts' })
      .then((accounts: string[]) => resolve(accounts[0]))
      .catch((error: IMetamaskErr) =>
        reject(new Error(error.code === 4001 ? 'user reject' : error.message)),
      );
  });
};
