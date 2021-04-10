type APPWORKTYPE = 'onlineOfficial' | 'localhostTest'
const hostname = window.location.hostname
// TODO
export const APPWORKTYPE: APPWORKTYPE = hostname.includes('netlify.app') || hostname.includes('bounce.finance') ||  hostname.includes('127.0.0.1')
  ? 'onlineOfficial'
  : 'localhostTest'
export const WEB3ProvideUrl = 'https://mainnet.infura.io/v3/0b500c5f885b43a4ab192e8048f6fa8'
export const ApolloClientUrl = APPWORKTYPE === 'onlineOfficial'
  ? 'https://api.thegraph.com/subgraphs/name/winless/bouncenft'
  : 'https://api.thegraph.com/subgraphs/name/winless/bouncenft2'
export const APIPrefixUrl = APPWORKTYPE === 'onlineOfficial'
  ? 'https://bounce-market.bounce.finance:11001'
  : 'http://market-test.bounce.finance:11001'

export const DEBOUNCE = 300;

export const AUCTION_TYPE = {
  FixedSwap: 'fixed-swap',
  EnglishAuction: 'english-auction',
}

export const NFT_CATEGORY = {
  FineArts: 'Fine Arts',
  Sports: 'Sports',
  ComicBooks: 'Comics',
}

export const ITEM_CATEGORY = {
  All: 'All',
  Image: 'Image',
  Video: 'Video',
  Audio: 'Audio',
  Game: 'Game',
  Others: 'Others'
}

export const ITEM_SELL_STATUS = {
  All: 'All',
  OnSale: 'On sale',
  NotOnSale: 'Not on sale'
}