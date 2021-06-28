const IsPre = process.env.REACT_APP_ENV === 'pre';

export const WEB3ProvideUrl = 'https://mainnet.infura.io/v3/0b500c5f885b43a4ab192e8048f6fa8';
export const APIPrefixUrl = IsPre
  ? 'https://bounce-market.bounce.finance:11001'
  : 'http://market-test.bounce.finance:11001';
const FGB_V2_URL = IsPre
  ? 'https://bounce-market.bounce.finance'
  : 'https://market-test.bounce.finance';

// axios default url
export const AXIOS_URL_MATCH_ARRAY = [{ key: '[FGB_V2]', value: FGB_V2_URL }];

export const DEBOUNCE = 300;

export const AUCTION_TYPE = {
  FixedSwap: 'fixed-swap',
  EnglishAuction: 'english-auction',
};

export const NFT_CATEGORY = {
  FineArts: 'Fine Arts',
  Sports: 'Sports',
  ComicBooks: 'Comics',
};

export const ITEM_CATEGORY = {
  All: 'All',
  Image: 'Image',
  Video: 'Video',
  Audio: 'Audio',
  Game: 'Game',
  Others: 'Others',
};

export const ITEM_SELL_STATUS = {
  All: 'All',
  OnSale: 'On sale',
  NotOnSale: 'Not on sale',
};

export const RECOMMEND_POOLS_AMOUNT = 11;
export const RECOMMEND_BRANDS_AMOUNT = 6;

export const LOGIN_PATH = '/user/login';
