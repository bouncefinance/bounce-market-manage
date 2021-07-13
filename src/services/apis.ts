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
  getauctionpoolsbyaccount: '/api/bouadmin/main/auth/getauctionpoolsbyaccount', // 查询一个账户地址下的pools。  返回：state 0：live，1：closed； status 0：show，1：hide
  getaccountsbylikename: '/api/bouadmin/main/auth/getaccountsbylikename', // 查询用户信息 filter: 1:likestr, 2:accountaddress, 3:identity
  updatedrops: '/api/bouadmin/main/auth/updatedrops', // 编辑一条drop
  getonedropsdetail: '/api/bouadmin/main/auth/getonedropsdetail', // 获取一条drop的信息
  updatedropsstate: '/api/bouadmin/main/auth/updatedropsstate', // 更新一条drop的状态
};

export default Apis;
