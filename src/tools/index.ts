import { exportErc20Info, weiToNum } from "./conenct"

export const getPriceByToken1 = async (price: string, token1: string) => {
  if (!price || !token1) return ''
  const tokenInfo = await exportErc20Info(token1)
  const newPrice = weiToNum(price, tokenInfo.decimals)
  // ${ tokenInfo.symbol }
  return `${newPrice}`
}