import { Settings as LayoutSettings } from '@ant-design/pro-layout';

const Settings: LayoutSettings & {
  pwa?: boolean;
  logo?: string;
} = {
  navTheme: 'light',
  primaryColor: '#1890ff',
  layout: 'side',
  contentWidth: 'Fluid',
  fixedHeader: false,
  fixSiderbar: true,
  title: false,
  pwa: false,
  iconfontUrl: '',
  logo: '/logo.svg',
  menu: {
    locale: true,
  },
  headerHeight: 48,
};

export default Settings;
