export const ApiServiceUrl = {
  PRO: 'https://bounce-market.bounce.finance', // 生产环境
  DEV: 'https://market-test.bounce.finance', // 开发&测试环境
};

export const Apis = {
  // user
  getaccountsbylikename: '/api/bouadmin/main/auth/getaccountsbylikename', // 查询用户信息 filter: 1:likestr, 2:accountaddress, 3:identity
  gettopartistslist: '/api/bouadmin/main/auth/gettopartistslist', // 获取带权重的topartists列表
  deletehotweight: '/api/bouadmin/main/auth/deletehotweight', // 删除一条Top Artist记录
  updatetopweight: '/api/bouadmin/main/auth/updatetopweight', // 更新或添加一条Top Artist记录

  // brand
  getbrandsbylikename: '/api/bouadmin/main/auth/getbrandsbylikename', // // 查询brand信息 filter: 1:likestr, 2:creator, 3:Id
  updatbrandeweight: '/api/bouadmin/main/auth/updateweight', // 修改brand的权重

  // drop
  searchdrops: '/api/bouadmin/main/auth/searchdrops', // 获取Drops List
  deleteonedrops: '/api/bouadmin/main/auth/deleteonedrops', // 删除一条drop
  addaccountdrops: '/api/bouadmin/main/auth/addaccountdrops', // 新增一条drop
  updatedrops: '/api/bouadmin/main/auth/updatedrops', // 编辑一条drop
  updatedropsstate: '/api/bouadmin/main/auth/updatedropsstate', // 更新一条drop的进行状态
  getonedropsdetail: '/api/bouadmin/main/auth/getonedropsdetail', // 获取一条drop的信息
  updatedropsdisplay: '/api/bouadmin/main/auth/updatedropsdisplay', // 更新一条drop的显示状态

  // pool
  getauctionpoolsbyaccount: '/api/bouadmin/main/auth/getauctionpoolsbyaccount', // 查询一个账户地址下的pools。  返回：state 0：live，1：closed； status 0：show，1：hide

  // overview
  get_overviews: '/api/bouadmin/main/auth/get_overviews', // 获取统计数据

  // file
  fileupload: '/api/v2/main/auth/fileupload', // Uploader
};

export default Apis;
