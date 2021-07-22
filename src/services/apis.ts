export const ApiServiceUrl = {
  PRO: 'https://api-admin-mcje1x67tc.fangible.com/api/v2/', // 生产环境
  DEV: 'https://api-test-admin-ur1uoyrf8r.fangible.com/api/v2/', // 开发&测试环境
};

export const Apis = {
  // history
  getoplogs: '/auth/getoplogs',

  // login
  jwtauth: '/jwtauth',

  // transcation
  gettxsbyfilter: '/auth/gettxsbyfilter', // 查询交易记录 filter: 1:from, 2:to

  // user
  getaccountsbylikename: '/auth/getaccountsbylikename', // 查询用户信息 filter: 1:likestr, 2:accountaddress, 3:identity
  gettopartistslist: '/auth/gettopartistslist', // 获取带权重的topartists列表
  deletehotweight: '/auth/deletehotweight', // 删除一条Top Artist记录
  updatetopweight: '/auth/updatetopweight', // 更新或添加一条Top Artist记录

  // brand
  getbrandsbylikename: '/auth/getbrandsbylikename', // // 查询brand信息 filter: 1:likestr, 2:creator, 3:Id
  updatbrandeweight: '/auth/updateweight', // 修改brand的权重
  delbrand: '/auth/delbrand', // 修改brand的权重
  updateuseridentity: '/auth/updateuseridentity', // 修改brand的权重
  updateuserstate: '/auth/updateuserstate', // 修改brand的权重
  updateuserdisplay: '/auth/updateuserdisplay', // 修改brand的权重

  // authority
  addoperators: '/auth/addoperators', // 修改brand的权重
  getoperatorlist: '/auth/getoperatorlist', // 修改brand的权重
  updateoperatorinfo: '/auth/updateoperatorinfo', // 修改brand的权重
  deleteoperators: '/auth/deleteoperators', // 修改brand的权重

  // drop
  searchdrops: '/auth/searchdrops', // 获取Drops List
  deleteonedrops: '/auth/deleteonedrops', // 删除一条drop
  addaccountdrops: '/auth/addaccountdrops', // 新增一条drop
  updatedrops: '/auth/updatedrops', // 编辑一条drop
  updatedropsstate: '/auth/updatedropsstate', // 更新一条drop的进行状态
  getonedropsdetail: '/auth/getonedropsdetail', // 获取一条drop的信息
  updatedropsdisplay: '/auth/updatedropsdisplay', // 更新一条drop的显示状态
  getoperatorsinfo: '/auth/getoperatorsinfo', // 获取角色信息

  // pool
  getauctionpoolsbyaccount: '/auth/getauctionpoolsbyaccount', // 查询一个账户地址下的pools。  返回：state 0：live，1：closed； status 0：show，1：hide
  getpoolsinfobypage: '/auth/getpoolsinfobypage', // 查询带poolweight的记录
  getonepoolinfo: '/auth/getonepoolinfo', // 查询一个pool的信息
  dealpoolinfo: '/auth/dealpoolinfo', // 更改一个pool的权重信息
  getpoolsbylikename: '/auth/getpoolsbylikename',
  getauctionpoolsbyfilter: '/auth/getauctionpoolsbyfilter',
  delpoolitem: '/auth/delpoolitem',
  updatepoolitem: '/auth/updatepoolitem', // 更改一个nft的显示状态

  // overview
  get_overviews: '/auth/get_overviews', // 获取统计数据

  // file
  fileupload: '/auth/fileupload', // Uploader
};

export default Apis;
