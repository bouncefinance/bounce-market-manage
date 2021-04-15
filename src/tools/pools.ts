import { AUCTION_TYPE } from '@/tools/const';
import request from 'umi-request';
import {  message } from 'antd';
import { getPriceByToken1 } from '.';

export const getPoolTypeNumber = (e: string) => e === 'english-auction' ? 2 : 1
export const getStandardTypeValue = (e: number) => e === 2 ? 'english-auction' : 'fixed-swap'
export const getPoolsWeight = async (list: Array<any>, poolweightKey = 'poolweight') => {
  let weightMap = new Map()
  const res = await request.post('/api/bouadmin/main/auth/getpoolsinfo', {
    data: {
      poolids: list.map((e: { poolId: number }) => e.poolId),
      standards: list.map((e: { poolType: string }) => getPoolTypeNumber(e.poolType)),
    }
  })
  if (res.code === 1) {
    res.data.map((item: any) => weightMap.set(`${item.poolid}_${getStandardTypeValue(item.standard)}`, item[poolweightKey]))
    return list
      .map((item: any) => ({ ...item, defaultWeight: weightMap.get(`${item.poolId}_${item.poolType}`) ?? 0 }))
      .sort((a: any, b: any) => b.defaultWeight - a.defaultWeight)
  } else {
    message.error('api error')
    return []
  }
}
export const getTradePools = (data: any) => {
  const tradePools = data.tradePools.map((item: any) => ({
    ...item,
    poolType: AUCTION_TYPE.FixedSwap
  })).filter((item: any) => item.state !== 1)
  const tradeAuctions = data.tradeAuctions.map((item: any) => ({
    ...item,
    price: item.lastestBidAmount !== '0' ? item.lastestBidAmount : item.amountMin1,
    poolType: AUCTION_TYPE.EnglishAuction
  }))
    .filter((item: any) => item.state !== 1 && item.poolId !== 0)
  return [].concat(tradePools, tradeAuctions)
}
export const getTradeList = async (data: any, poolweightKey: string) => {
  try {
    const tradePools = getTradePools(data)
    const res = await request.post('/api/bouadmin/main/auth/getitemsbyfilter', {
      data: {
        ids: tradePools.map((e: {tokenId: string}) => e.tokenId),
        category: "Image",
        channel: '',
      }
    })
    if (res.code !== 1) {
      return []
    }
    const tradeList = tradePools.map((pool: any) => {
      const itemInfo = res.data.find((item: any) => pool.tokenId === item.id);
      return {
        ...itemInfo,
        poolType: pool.poolType,
        poolId: pool.poolId,
        price: pool.price,
        createTime: pool.createTime,
        token1: pool.token1
      }
    })
      .filter((item: any) => item.fileurl)
      .sort((a: any, b: any) => b.createTime - a.createTime)
    for (let item of tradeList) {
      item.price = await getPriceByToken1(item.price, item.token1)
    }
    return getPoolsWeight(tradeList, poolweightKey)
  } catch (error) {
    message.error(error)
  }
}



  // const _list = res.data.map((item: any, index: number) => {
  //   const poolInfo = pools.find((pool: any) => pool.tokenId === item.id);
  //   return {
  //     ...item,
  //     poolType: poolInfo.poolType,
  //     poolId: poolInfo.poolId,
  //     price: poolInfo.price,
  //     createTime: poolInfo.createTime,
  //     token1: poolInfo.token1
  //   }
  // })