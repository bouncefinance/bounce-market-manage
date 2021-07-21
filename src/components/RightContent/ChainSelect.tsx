// const {} = useModel('login');
import React from 'react';
import { Select, Image, message } from 'antd';
import { TokenSymbol } from '@/types';
import { useModel } from 'umi';
import { useBoolean } from 'ahooks';
import { isPre } from '@/tools/const';

const { Option } = Select;
const styles = {
  option: {
    display: 'flex',
    alignItems: 'center',
  },
  iconBox: {
    width: 20,
    height: 20,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
    borderRadius: '50%',
    marginRight: 5,
  },
};
// 测试网络 or 正式网络
const symbols = isPre
  ? [TokenSymbol.BSC, TokenSymbol.RINKEBY]
  : [TokenSymbol.BSC, TokenSymbol.ETH, TokenSymbol.HECO, TokenSymbol.MATIC];
const ChainSelect: React.FC = () => {
  const [loading, { toggle }] = useBoolean(false);
  const {
    state: { chainSymbol },
    reducers: { onChainLogin },
  } = useModel('login');

  return (
    <Select
      loading={loading}
      style={{ width: 150 }}
      value={chainSymbol}
      onChange={(value: TokenSymbol) => {
        toggle(true);
        onChainLogin(value).then(() => {
          message.success(`Switched NFT network to ${value}`);
          setTimeout(() => {
            toggle(false);
            window.location.reload();
          }, 500);
        });
      }}
    >
      {symbols.map((label) => {
        const symbol = label.toUpperCase();
        return (
          <Option key={symbol} value={TokenSymbol[symbol]}>
            <div style={styles.option}>
              <div style={styles.iconBox}>
                <Image preview={false} src={`/tokens/${label}.svg`} />
              </div>
              {symbol}
            </div>
          </Option>
        );
      })}
    </Select>
  );
};
export default ChainSelect;
