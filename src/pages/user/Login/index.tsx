import styles from './index.less';
import { message, Button } from 'antd';
import React, { useState } from 'react';
import { FormattedMessage, SelectLang, useHistory, useIntl, useModel } from 'umi';

type ILoadingStatusType = 'await' | 'account-fail' | 'login-success' | 'loading' | 'login-fail';
interface ILoadingStatus {
  type: ILoadingStatusType;
  message: string;
}

const Login: React.FC = () => {
  const history = useHistory();
  const intl = useIntl();
  const {
    reducers: { onChainLogin, onSignature },
  } = useModel('login');
  const { setInitialState } = useModel('@@initialState');
  const [loadingStatus, setLoadingStatus] = useState<ILoadingStatus>({
    type: 'await',
    message: intl.formatMessage({
      id: 'pages.login.loadingStatusMessge.await',
    }),
  });
  const setLoginLoading = (type: ILoadingStatusType) => {
    setLoadingStatus({
      type,
      message: intl.formatMessage({
        id: `pages.login.loadingStatusMessge.${type}`,
      }),
    });
  };
  /**
   * 链接钱包
   */
  const onConnectWallet = async () => {
    setLoginLoading('loading');
    const handleLoginFail = (err: any) => {
      message.error(err);
      setLoginLoading('login-fail');
      setTimeout(() => setLoginLoading('await'), 1e3);
    };
    onSignature()
      .then(() => {
        onChainLogin()
          .then((res) => {
            setInitialState({
              currentUser: { ...res },
            });
            setLoginLoading('login-success');
            history.replace('/');
          })
          .catch((err) => {
            setLoginLoading('await');
            message.error(`Login failed ${err}`);
          });
      })
      .catch(handleLoginFail);
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
            <Button onClick={onConnectWallet}>
              <FormattedMessage id="pages.login.address.submit" />
            </Button>
          </div>
        )}
        {loadingStatus.type === 'account-fail' && (
          <div className={styles.retry}>
            <Button onClick={onConnectWallet}>
              <FormattedMessage id="pages.login.retry" />
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Login;
