import React, { useEffect, useState } from 'react';
import { message, Button } from 'antd';
import { FormattedMessage, SelectLang, useHistory, useIntl, useModel } from 'umi';
import styles from './index.less';
import request from 'umi-request';
import { getMetaMskAccount, myweb3 } from '@/tools/conenct';

const dataToSign = 'Welcome to Bounce!';
const password = 'xxx';

const Login: React.FC = () => {
  const history = useHistory();
  const [_, setAccount] = useState<string | null>();
  const intl = useIntl();

  const { initialState, setInitialState } = useModel('@@initialState');
  const [loadingStatus, setLoadingStatus] = useState({
    type: 'await',
    message: intl.formatMessage({
      id: 'pages.login.loadingStatusMessge.await',
    }),
  });

  const init = async () => {
    setLoadingStatus({
      type: 'loading',
      message: intl.formatMessage({
        id: 'pages.login.loadingStatusMessge.loading',
      }),
    });
    const _account = await getMetaMskAccount();
    setLoadingStatus({
      type: 'login-success',
      message: intl.formatMessage({
        id: 'pages.login.loadingStatusMessge.loading',
      }),
    });
    await new Promise((resolve) => setTimeout(resolve, 300));
    setAccount(_account);
    if (_account) {
      const token = await getNewToken(_account ?? '444');
      if (token) {
        // console.log('登录成功', token)
        setLoadingStatus({
          type: 'login-success',
          message: intl.formatMessage({
            id: 'pages.login.loadingStatusMessge.login-success',
          }),
        });
        localStorage.token = token;
        setInitialState({
          token,
        });
        history.replace('/');
      } else {
        setLoadingStatus({
          type: 'login-fail',
          message: intl.formatMessage({
            id: 'pages.login.loadingStatusMessge.login-fail',
          }),
        });
        setTimeout(() => {
          setLoadingStatus({
            type: 'await',
            message: intl.formatMessage({
              id: 'pages.login.loadingStatusMessge.await',
            }),
          });
        }, 1e3);
      }
    } else {
      setLoadingStatus({
        type: 'account-fail',
        message: intl.formatMessage({
          id: 'pages.login.loadingStatusMessge.account-fail',
        }),
      });
    }
  };
  useEffect(() => {
    loadingStatus.type !== 'await' && init();
  }, []);

  const getNewToken = async (account: string) => {
    if (typeof account === 'string') {
      const web3 = myweb3();
      const signature = await web3.eth.personal.sign(dataToSign, account, password);
      const params = {
        accountaddress: account,
        message: dataToSign,
        signature: signature,
      };
      try {
        const res_getSignToken = await request.post('/api/bouadmin/main/jwtauth', { data: params });
        console.log(res_getSignToken);
        if (res_getSignToken.code === 200) {
          const { token } = res_getSignToken.data;
          return token;
        } else {
          message.error(res_getSignToken.msg || 'error');
          return '';
        }
      } catch (err) {
        setLoadingStatus({
          type: 'await',
          message: intl.formatMessage({
            id: 'pages.login.loadingStatusMessge.await',
          }),
        });
        message.error('error');
      }
    } else {
      console.log('connect..');
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.lang}>
        <SelectLang />
      </div>
      <div className={styles.main}>
        <div className={styles.logo}>
          <img src="/logo.svg" alt="" />
        </div>
        <div className={styles.logintitle}>
          <FormattedMessage id="pages.layouts.userLayout.title" />
        </div>
        <div className={styles.loadingStatus}>{loadingStatus.message}</div>
        {loadingStatus.type === 'await' && (
          <div className={styles.retry}>
            <Button onClick={init}>
              <FormattedMessage id="pages.login.address.submit" />
            </Button>
          </div>
        )}
        {loadingStatus.type === 'account-fail' && (
          <div className={styles.retry}>
            <Button onClick={init}>
              <FormattedMessage id="pages.login.retry" />
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Login;
