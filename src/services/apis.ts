export const ApiServiceUrl = {
  PRO: 'https://bounce-market.bounce.finance', // 生产环境
  DEV: 'https://market-test.bounce.finance', // 开发&测试环境
};

export const Apis = {
  fileupload: '/api/v2/main/auth/fileupload', // Uploader
  searchdrops: '/api/bouadmin/main/auth/searchdrops', // 获取Drops List
  // getaccountsbylikename: '/api/bouadmin/main/auth/getaccountsbylikename',
  deleteonedrops: '/api/bouadmin/main/auth/deleteonedrops', // 删除一条drop
  addaccountdrops: '/api/bouadmin/main/auth/addaccountdrops', // 新增一条drop
  getauctionpoolsbyaccount: '/api/bouadmin/main/auth/getauctionpoolsbyaccount', // 查询一个账户地址下的pools
  getaccountsbylikename: '/api/bouadmin/main/auth/getaccountsbylikename', // 查询用户信息
  updatedrops: '/api/bouadmin/main/auth/updatedrops', // 编辑一条drop
};

export default Apis;
