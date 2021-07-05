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
  getpoolsbylikename: '/api/bouadmin/main/auth/getpoolsbylikename', // 查询一个账户地址下的pools，fileter: 1:likestr, 2:creatoraddress, 3:tokenid
  getaccountsbylikename: '/api/bouadmin/main/auth/getaccountsbylikename', // 查询用户信息
};

export default Apis;
