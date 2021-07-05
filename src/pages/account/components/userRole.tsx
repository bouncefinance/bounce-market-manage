import React from 'react';
import { message, Select } from 'antd';
import { useState } from 'react';
import { UserRoleEnum, UserRoleType } from '../actions/apiType';
import { updateUserRole } from '../actions/updateUser';
const { Option } = Select

const UserRoleView: React.FC<{
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
    const isOk = await updateUserRole({ id, identity: _value as unknown as UserRoleType })
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
        { value: UserRoleEnum.Normal, label: 'Normal', key: 1 },
        { value: UserRoleEnum.Verified, label: 'Verified', key: 2 },
      ].map(({ value, label, key }) => <Option key={key} value={value}>{label}</Option>)}
    </Select>
  </>
}

export default UserRoleView