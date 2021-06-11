import { gql } from '@apollo/client';

export const QueryTradePools = gql`
  query {
    tradePools (first: 1000){
      tokenId
      poolId
      token0
      token1
      price
      createTime
      state
    }
    tradeAuctions  (first: 1000){
      tokenId
      poolId
      token0
      token1
      lastestBidAmount
      amountMin1
      createTime
      state
    }
  }
`

export const QueryMarketTradePools = gql`
  query xx($contract: String!){
    tradePools (where: {token1: $contract}){
      tokenId
      poolId
      token1
      price
      createTime
      state
    }
    tradeAuctions (where: {token1: $contract}){
      tokenId
      poolId
      token1
      lastestBidAmount
      amountMin1
      createTime
      state
    }
  }
`

export const QueryAirMarketTradePools = gql`
  query queryTradeInfo2($creator: String!){
    tradePools (where: {creator: $creator}){
      tokenId
      poolId
      token0
      token1
      price
      createTime
      state
      creator
    }
    tradeAuctions (where: {creator: $creator}){
      tokenId
      poolId
      token0
      token1
      lastestBidAmount
      amountMin1
      createTime
      state
      creator
    }
  }
`