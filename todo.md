- less 开启热更新
- commit 的时候自动调用格式化并校验代码规范 [√] 部分电脑不可以 [√]
- vscode 的 eslint 应该跟随项目配置 [√] 部分电脑不可以 [√]
- 权限 authority
  - label 加 width [√]
  - Type [√] 二级联动选项 [×]
  - /api/bouadmin/main/auth/getoperatorlist [√] table key 重复 [√] 搜索接口 后台搜索功能有问题 [√]
  - /api/bouadmin/main/auth/updateoperatorinfo [√] 有弹窗的取消后需要重置状态 [√]
  - /api/bouadmin/main/auth/deleteoperators [√] 删除的时候刷新数据 [√]
  - /api/bouadmin/main/auth/addoperators [√] 图片上传 [√] 添加完成的时候刷新页面 [√]
  - /api/bouadmin/main/auth/getoperatorsinfo [×] (注：编辑的时候才用这个接口，暂时没有需要编辑页面)
  - 中文 [×] (注：大部分完成中文化)
  - 复制 [√]
  - 身份标识 [√]
- 用户 User
  - LIST getaccountsbylikename [√] Creation 后台暂无字段 [×]
  - 设置身份 [√]
  - identity select 加 all 功能 [√]
  - 复制功能 [√]
  - 交互确认弹窗 [√]
  - 修改状态页面整体刷新 [√] 如果是修改身份的，那么不应该整体刷新 [√]
- 上传接口有问题后台暂时有问题；暂时用用户端的地址 代码 src\pages\Authority\components\Top.tsx 36 行待修改
- 面包屑有问题 顶级点击是空白页面 [×]
- 登陆 404 [×]
- 把 router account 抽出来不要放二级页面[√]
-

- recommed 板块
  - 增加每个推荐位的售卖状态的显示[×]
- drops 板块
  - 编辑 drop [√]
  - 编辑 drop 返回的已选 pool 的顺序不对 [√]
  - 添加 nft 的 cover 和 color 的必填 [√]
  - cover 在只有 background color 时显示颜色 [√]
  - 限制上传的图片大小小于 4M
- NFT Management 板块
  - 一键复制的按钮改成 antd 自带的

原型地址

https://www.figma.com/file/zKkEMj1l7gup2iWsWUqjsw/fangible%E5%90%8E%E5%8F%B0%E7%AE%A1%E7%90%86?node-id=84%3A119
