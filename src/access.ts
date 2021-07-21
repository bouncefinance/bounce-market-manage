/**
 * @see https://umijs.org/zh-CN/plugins/plugin-access
 * */
export default function access(initialState: any) {
  // 1 super, 2 drop, 3 basic
  const role = initialState?.currentUser?.opRole || 3;
  return {
    superAdmin: role === 1,
    dropAdmin: role === 2 || role === 1,
    basiceAdmin: role === 3,
  };
}
