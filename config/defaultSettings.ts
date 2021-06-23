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
  iconfontUrl: '//at.alicdn.com/t/font_2626662_v1c3o9lrbe.js',
  logo: '/logo.svg',
  menu: {
    locale: true,
  },
  headerHeight: 48,
};

export default Settings;
