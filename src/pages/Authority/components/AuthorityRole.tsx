import React from 'react';
import { message, Select } from 'antd';
import { useState } from 'react';
import updateAuthority from '../actions/updateAuthority';
import { AuthorityRoleEnum, AuthorityRoleType } from '../actions/apiType';
const { Option } = Select

const AuthorityRoleView: React.FC<{
  id: number;
  value: string;
  /**
   * 操作完成回调
   * Set the completion of the callback
   */
  run?: () => void
}> = ({ value, id, run }) => {
  const [oldValue, setValue] = useState<string>(value)
  const [loading, setLoading] = useState(false)
  const onChange = async (_value: string) => {
    setLoading(true)
    const isOk = await updateAuthority({ id, opRole: _value as unknown as AuthorityRoleType })
    setLoading(false)
    if (isOk) {
      message.success('Set Success 🎉 🎉 🎉')
      setValue(_value)
      run && run()
      return
    }
    message.error('error')
  }
  return <>
    <Select loading={loading} value={oldValue} style={{ width: 220 }} onChange={onChange}>
      {[
        { value: AuthorityRoleEnum.super, label: 'Super administrator', key: 1 },
        { value: AuthorityRoleEnum.dropList, label: 'Drops administrator', key: 2 },
        { value: AuthorityRoleEnum.basis, label: 'Basis administrator', key: 3 },
      ].map(({ value, label, key }) => <Option key={key} value={value}>{label}</Option>)}
    </Select>
  </>
}

export default AuthorityRoleView
