// const {} = useModel('login');
import React from 'react';
import { Select, Image } from 'antd';
import { TokenSymbol } from '@/types';
import { useModel } from 'umi';
import { useBoolean } from 'ahooks';

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
const ChainSelect: React.FC = () => {
  const symbols = Object.keys(TokenSymbol);
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
        onChainLogin(value).then(() => toggle(false));
      }}
    >
      {symbols.map((label) => (
        <Option key={label} value={TokenSymbol[label]}>
          <div style={styles.option}>
            <div style={styles.iconBox}>
              <Image preview={false} src={`/tokens/${TokenSymbol[label]}.svg`} />
            </div>
            {label}
          </div>
        </Option>
      ))}
    </Select>
  );
};
export default ChainSelect;
