- less 开启热更新
- commit的时候自动调用格式化并校验代码规范
- 权限  authority 
  - label 加width [√]
  - Type [√]
    二级联动选项  [×]
  - /api/bouadmin/main/auth/getoperatorlist       [√]
    table key重复 [√]
  - /api/bouadmin/main/auth/updateoperatorinfo    [√]
    有弹窗的取消后需要重置状态  [√]
  - /api/bouadmin/main/auth/deleteoperators       [√]
    删除的时候刷新数据  [√]
  - /api/bouadmin/main/auth/addoperators           [√]
    图片上传 [√]
    添加完成的时候刷新页面 [√]
  - /api/bouadmin/main/auth/getoperatorsinfo      [×]
    (注：编辑的时候才用这个接口，暂时没有需要编辑页面)
  - 中文   [×]
    (注：大部分完成中文化)
  - 复制    [×]
- 上传接口有问题
  后台暂时有问题；暂时用用户端的地址 代码 src\pages\Authority\components\Top.tsx 36行待修改
- 登陆404 [×]