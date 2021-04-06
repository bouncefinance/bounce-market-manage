import {
  AlipayCircleOutlined,
  LockOutlined,
  MailOutlined,
  MobileOutlined,
  TaobaoCircleOutlined,
  UserOutlined,
  WeiboCircleOutlined,
} from '@ant-design/icons';
import { Alert, Space, message, Tabs, Button } from 'antd';
import React, { useEffect, useState } from 'react';
import ProForm, { ProFormCaptcha, ProFormCheckbox, ProFormText } from '@ant-design/pro-form';
import { connect, FormattedMessage, SelectLang, useHistory, useParams } from 'umi';
import { getFakeCaptcha } from '@/services/login';
import type { Dispatch } from 'umi';
import type { StateType } from '@/models/login';
import type { LoginParamsType } from '@/services/login';
import type { ConnectState } from '@/models/connect';
import Logo from '@/assets/logo.svg'

import styles from './index.less';

import { DefaultFooter } from '@ant-design/pro-layout';
import request from 'umi-request';
import { getMetaMskAccount, myweb3, web3Provide } from '@/tools/conenct';


export type LoginProps = {
  dispatch: Dispatch;
  userLogin: StateType;
  submitting?: boolean;
};

const LoginMessage: React.FC<{
  content: string;
}> = ({ content }) => (
  <Alert
    style={{
      marginBottom: 24,
    }}
    message={content}
    type="error"
    showIcon
  />
);

const dataToSign = 'Welcome to Bounce!'
const password = 'xxx'

const Login: React.FC<LoginProps> = (props) => {
  // const { library } = useWeb3React();
  const history = useHistory()
  const [account, setAccount] = useState<string | null>()

  const { userLogin = {}, submitting } = props;
  const { status, type: loginType } = userLogin;
  const [type, setType] = useState<string>('account');

  const [loadingStatus, setLoadingStatus] = useState({type: 'await', message: intl.formatMessage({id: 'pages.login.loadingStatusMessge.await'})})

  const init = async () => {
        setLoadingStatus({type: 'loding', message: intl.formatMessage({id: 'pages.login.loadingStatusMessge.loding'})})
        const account = await getMetaMskAccount()
        // const account = ''
        setLoadingStatus({type: 'login-success', message: intl.formatMessage({id: 'pages.login.loadingStatusMessge.loding'})})
        await new Promise((resolve) => setTimeout(resolve, 300))
        setAccount(account)
        if(account){
          const token = await getNewToken(account ?? '444')
          if (token) {
            // console.log('登录成功', token)
            setLoadingStatus({type: 'login-success', message: intl.formatMessage({id: 'pages.login.loadingStatusMessge.login-success'})})
            localStorage.token = token
            // history.replace('/')
            history.replace('/usermanager/nft')
          }else{
            setLoadingStatus({type: 'login-fail', message: intl.formatMessage({id: 'pages.login.loadingStatusMessge.login-fail'})})
          }
        }else{
          setLoadingStatus({type: 'account-fail', message: intl.formatMessage({id: 'pages.login.loadingStatusMessge.account-fail'})})
        }
      }
  useEffect(() => {
    loadingStatus.type !== 'await' && init()
  }, [])

  const getNewToken = async (account: string) => {
    if (typeof account === 'string') {
      const web3 = myweb3()
      const signature = await web3.eth.personal.sign(dataToSign, account, password)
      const params = {
        accountaddress: account,
        message: dataToSign,
        signature: signature
      }
      const res_getSignToken = await request.post('/api/bouadmin/main/jwtauth', { data: params })
      if (res_getSignToken.code === 200) {
        const { token } = res_getSignToken.data
        return token
      } else {
        return ''
      }
    } else {
      console.log('connect..')
    }
  }

  const handleSubmit = (values: LoginParamsType) => {
    const { dispatch } = props;
    dispatch({
      type: 'login/login',
      payload: { ...values, type },
    });
  };

  return (
    <div className={styles.container}>
      <div className={styles.lang}>
        <SelectLang />
      </div>
      <div className={styles.main}>
        <div className={styles.logo}>
          <img src={Logo} alt="" />
        </div>
        <div className={styles.logintitle}>
          <FormattedMessage id="pages.layouts.userLayout.title" />
        </div>
        <div className={styles.loadingStatus}>{loadingStatus.message}</div>
        {loadingStatus.type === 'await' && <div className={styles.retry}>
          <Button onClick={init}><FormattedMessage id="pages.login.address.submit" /></Button>
        </div>}
        {loadingStatus.type === 'account-fail' && <div className={styles.retry}>
          <Button onClick={init}><FormattedMessage id="pages.login.retry" /></Button>
        </div>}
        {false && <ProForm
          initialValues={{
            autoLogin: true,
          }}
          submitter={{
            render: (_, dom) => dom.pop(),
            submitButtonProps: {
              loading: submitting,
              size: 'large',
              style: {
                width: '100%',
              },
            },
          }}
          onFinish={(values) => {
            handleSubmit(values as LoginParamsType);
            return Promise.resolve();
          }}
        >
          <Tabs activeKey={type} onChange={setType}>
            <Tabs.TabPane
              key="account"
              tab={intl.formatMessage({
                id: 'pages.login.accountLogin.tab',
                defaultMessage: '账户密码登录',
              })}
            />
            <Tabs.TabPane
              key="mobile"
              tab={intl.formatMessage({
                id: 'pages.login.phoneLogin.tab',
                defaultMessage: '手机号登录',
              })}
            />
          </Tabs>

          {status === 'error' && loginType === 'account' && !submitting && (
            <LoginMessage
              content={intl.formatMessage({
                id: 'pages.login.accountLogin.errorMessage',
                defaultMessage: '账户或密码错误（admin/ant.design)',
              })}
            />
          )}
          {type === 'account' && (
            <>
              <ProFormText
                name="userName"
                fieldProps={{
                  size: 'large',
                  prefix: <UserOutlined className={styles.prefixIcon} />,
                }}
                placeholder={intl.formatMessage({
                  id: 'pages.login.username.placeholder',
                  defaultMessage: '用户名: admin or user',
                })}
                rules={[
                  {
                    required: true,
                    message: (
                      <FormattedMessage
                        id="pages.login.username.required"
                        defaultMessage="请输入用户名!"
                      />
                    ),
                  },
                ]}
              />
              <ProFormText.Password
                name="password"
                fieldProps={{
                  size: 'large',
                  prefix: <LockOutlined className={styles.prefixIcon} />,
                }}
                placeholder={intl.formatMessage({
                  id: 'pages.login.password.placeholder',
                  defaultMessage: '密码: ant.design',
                })}
                rules={[
                  {
                    required: true,
                    message: (
                      <FormattedMessage
                        id="pages.login.password.required"
                        defaultMessage="请输入密码！"
                      />
                    ),
                  },
                ]}
              />
            </>
          )}

          {status === 'error' && loginType === 'mobile' && !submitting && (
            <LoginMessage content="验证码错误" />
          )}
          {type === 'mobile' && (
            <>
              <ProFormText
                fieldProps={{
                  size: 'large',
                  prefix: <MobileOutlined className={styles.prefixIcon} />,
                }}
                name="mobile"
                placeholder={intl.formatMessage({
                  id: 'pages.login.phoneNumber.placeholder',
                  defaultMessage: '手机号',
                })}
                rules={[
                  {
                    required: true,
                    message: (
                      <FormattedMessage
                        id="pages.login.phoneNumber.required"
                        defaultMessage="请输入手机号！"
                      />
                    ),
                  },
                  {
                    pattern: /^1\d{10}$/,
                    message: (
                      <FormattedMessage
                        id="pages.login.phoneNumber.invalid"
                        defaultMessage="手机号格式错误！"
                      />
                    ),
                  },
                ]}
              />
              <ProFormCaptcha
                fieldProps={{
                  size: 'large',
                  prefix: <MailOutlined className={styles.prefixIcon} />,
                }}
                captchaProps={{
                  size: 'large',
                }}
                placeholder={intl.formatMessage({
                  id: 'pages.login.captcha.placeholder',
                  defaultMessage: '请输入验证码',
                })}
                captchaTextRender={(timing, count) => {
                  if (timing) {
                    return `${count} ${intl.formatMessage({
                      id: 'pages.getCaptchaSecondText',
                      defaultMessage: '获取验证码',
                    })}`;
                  }
                  return intl.formatMessage({
                    id: 'pages.login.phoneLogin.getVerificationCode',
                    defaultMessage: '获取验证码',
                  });
                }}
                name="captcha"
                rules={[
                  {
                    required: true,
                    message: (
                      <FormattedMessage
                        id="pages.login.captcha.required"
                        defaultMessage="请输入验证码！"
                      />
                    ),
                  },
                ]}
                onGetCaptcha={async (mobile) => {
                  const result = await getFakeCaptcha(mobile);
                  if (result === false) {
                    return;
                  }
                  message.success('获取验证码成功！验证码为：1234');
                }}
              />
            </>
          )}
          <div
            style={{
              marginBottom: 24,
            }}
          >
            <ProFormCheckbox noStyle name="autoLogin">
              <FormattedMessage id="pages.login.rememberMe" defaultMessage="自动登录" />
            </ProFormCheckbox>
            <a
              style={{
                float: 'right',
              }}
            >
              <FormattedMessage id="pages.login.forgotPassword" defaultMessage="忘记密码" />
            </a>
          </div>
        </ProForm>}
        {/* <Space className={styles.other}>
          <FormattedMessage id="pages.login.loginWith" defaultMessage="其他登录方式" />
          <AlipayCircleOutlined className={styles.icon} />
          <TaobaoCircleOutlined className={styles.icon} />
          <WeiboCircleOutlined className={styles.icon} />
        </Space> */}
      </div>
    </div>
  );
};

export default connect(({ login, loading }: ConnectState) => ({
  userLogin: login,
  submitting: loading.effects['login/login'],
}))(Login);