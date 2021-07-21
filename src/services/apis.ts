export const ApiServiceUrl = {
  PRO: 'https://api-admin-mcje1x67tc.fangible.com/v2/', // 生产环境
  DEV: 'https://api-test-admin-ur1uoyrf8r.fangible.com/v2/', // 开发&测试环境
};

export const Apis = {
  // history
  getoplogs: '/api/bouadmin/main/auth/getoplogs',

  // login
  jwtauth: '/api/bouadmin/main/jwtauth',

  // transcation
  gettxsbyfilter: '/api/bouadmin/main/auth/gettxsbyfilter', // 查询交易记录 filter: 1:from, 2:to

  // user
  getaccountsbylikename: '/api/bouadmin/main/auth/getaccountsbylikename', // 查询用户信息 filter: 1:likestr, 2:accountaddress, 3:identity
  gettopartistslist: '/api/bouadmin/main/auth/gettopartistslist', // 获取带权重的topartists列表
  deletehotweight: '/api/bouadmin/main/auth/deletehotweight', // 删除一条Top Artist记录
  updatetopweight: '/api/bouadmin/main/auth/updatetopweight', // 更新或添加一条Top Artist记录

  // brand
  getbrandsbylikename: '/api/bouadmin/main/auth/getbrandsbylikename', // // 查询brand信息 filter: 1:likestr, 2:creator, 3:Id
  updatbrandeweight: '/api/bouadmin/main/auth/updateweight', // 修改brand的权重
  delbrand: '/api/bouadmin/main/auth/delbrand', // 修改brand的权重
  updateuseridentity: '/api/bouadmin/main/auth/updateuseridentity', // 修改brand的权重
  updateuserstate: '/api/bouadmin/main/auth/updateuserstate', // 修改brand的权重
  updateuserdisplay: '/api/bouadmin/main/auth/updateuserdisplay', // 修改brand的权重

  // authority
  addoperators: '/api/bouadmin/main/auth/addoperators', // 修改brand的权重
  getoperatorlist: '/api/bouadmin/main/auth/getoperatorlist', // 修改brand的权重
  updateoperatorinfo: '/api/bouadmin/main/auth/updateoperatorinfo', // 修改brand的权重
  deleteoperators: '/api/bouadmin/main/auth/deleteoperators', // 修改brand的权重

  // drop
  searchdrops: '/api/bouadmin/main/auth/searchdrops', // 获取Drops List
  deleteonedrops: '/api/bouadmin/main/auth/deleteonedrops', // 删除一条drop
  addaccountdrops: '/api/bouadmin/main/auth/addaccountdrops', // 新增一条drop
  updatedrops: '/api/bouadmin/main/auth/updatedrops', // 编辑一条drop
  updatedropsstate: '/api/bouadmin/main/auth/updatedropsstate', // 更新一条drop的进行状态
  getonedropsdetail: '/api/bouadmin/main/auth/getonedropsdetail', // 获取一条drop的信息
  updatedropsdisplay: '/api/bouadmin/main/auth/updatedropsdisplay', // 更新一条drop的显示状态
  getoperatorsinfo: '/api/bouadmin/main/auth/getoperatorsinfo', // 获取角色信息

  // pool
  getauctionpoolsbyaccount: '/api/bouadmin/main/auth/getauctionpoolsbyaccount', // 查询一个账户地址下的pools。  返回：state 0：live，1：closed； status 0：show，1：hide
  getpoolsinfobypage: '/api/bouadmin/main/auth/getpoolsinfobypage', // 查询带poolweight的记录
  getonepoolinfo: '/api/bouadmin/main/auth/getonepoolinfo', // 查询一个pool的信息
  dealpoolinfo: '/api/bouadmin/main/auth/dealpoolinfo', // 更改一个pool的权重信息
  getpoolsbylikename: '/api/bouadmin/main/auth/getpoolsbylikename',
  getauctionpoolsbyfilter: '/api/bouadmin/main/auth/getauctionpoolsbyfilter',
  delpoolitem: '/api/bouadmin/main/auth/delpoolitem',
  updatepoolitem: '/api/bouadmin/main/auth/updatepoolitem',

  // overview
  get_overviews: '/api/bouadmin/main/auth/get_overviews', // 获取统计数据

  // file
  fileupload: '/api/v2/main/auth/fileupload', // Uploader
};

export default Apis;
