import Web3 from "web3"
import BounceERC20 from '@/tools/web3/abi/BounceERC20.json'

export const web3Provide = Web3.givenProvider || 'https://mainnet.infura.io/v3/0b500c5f885b43a4ab192e8048f6fa8'
const web3 = new Web3(web3Provide)
import { BigNumber } from 'bignumber.js';
BigNumber.config({ EXPONENTIAL_AT: [-30, 30] })

export const getWei = (decimals: string) => {
  switch (decimals) {
    case '0':
      return 'nanoether'
    case '1':
      return 'wei';
    case '3':
      return 'kwei'
    case '6':
      return 'mwei'
    case '9':
      return 'gwei'
    case '12':
      return 'szabo'
    case '15':
      return 'finney'
    case '18':
      return 'ether'
    default:
      return 'ether'
  }
}

export const ZERO_ADDRESS = '0x0000000000000000000000000000000000000000'

export const myweb3 = () => {
  return web3
}

export const fromWei = (value: string, decimals = 18) => {
  return new BigNumber(value).dividedBy(new BigNumber(10).pow(decimals))
}
export const weiToNum = (value: string, decimals = 18, fixed = 6) => {
  return new BigNumber(fromWei(value, decimals).toFixed(fixed === -1 ? 0 : fixed, 1)).toNumber().toString()
}


export function getContract (abi: any, address: string) {
  return new web3.eth.Contract(abi, address)
}

export const exportErc20Info = async (tokenAddr: string) => {
  let price = 0
  if (tokenAddr === ZERO_ADDRESS) {
    // const balanceOf = await web3.eth.getBalance(account)
    return {
      // chainId,
      contract: tokenAddr,
      decimals: 18,
      // symbol: chainId === 56 || chainId === 97 ? 'BNB' : 'ETH',
      // balanceOf,
      // balance: weiToNum(balanceOf),
      price
    }
  }
  let BounceERC20_CT = getContract(BounceERC20.abi, tokenAddr)

  const decimals = await BounceERC20_CT.methods.decimals().call()
  const symbol = await BounceERC20_CT.methods.symbol().call()
  // const balanceOf = await BounceERC20_CT.methods.balanceOf(account).call()

  return {
    // chainId,
    contract: tokenAddr,
    decimals: parseInt(decimals),
    symbol,
    // balanceOf,
    // balance: weiToNum(balanceOf, decimals),
    price
  }
}

// TODO 离开页面自动取消连接
export const getMetaMskAccount = (): Promise<string | null> => {
  return new Promise((resolve, reject) => {
    //检测当前浏览器是否以太坊兼容，并进行相应的处理
    if (typeof window.ethereum === 'undefined') {
      alert('Looks like you need a Dapp browser to get started.')
      alert('Consider installing MetaMask!')

    } else {
      //如果用户安装了MetaMask，你可以要求他们授权应用登录并获取其账号
      ethereum.enable()

        //如果用户拒绝了登录请求
        .catch(function (reason: string) {
          resolve('')
          if (reason === 'User rejected provider access') {
            // 用户不想登录，你看该怎么办？
          } else {
            // 本不该执行到这里，但是真到这里了，说明发生了意外
            alert('There was an issue signing you in.')
          }
        })

        //如果用户同意了登录请求，你就可以拿到用户的账号
        .then(function (accounts: Array<string | null>) {
          // You also should verify the user is on the correct network:
          //你也可以验证用户接入了正确的网络
          //if (ethereum.networkVersion !== desiredNetwork) {
          // alert('This application requires the main network, please switch it in your MetaMask UI.')

          //我们计划在最近补充一个有关网络切换的API，参考下面链接
          // https://github.com/MetaMask/metamask-extension/issues/3663
          //}

          //一旦获取了用户账号，你就可以签名交易
          const account = accounts[0]
          resolve(account)

        })

    }
  })
}