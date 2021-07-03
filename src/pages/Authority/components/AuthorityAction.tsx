import React from 'react';
import { Button, message, Modal } from 'antd';
import { useState } from 'react';
import { deleteAuthority } from '../actions/updateAuthority';
import { ExclamationCircleOutlined } from '@ant-design/icons';
import { useIntl } from 'umi';
const { confirm } = Modal

const AuthorityActionView: React.FC<{
  id: number;
  address: string;
  /**
   * 操作完成回调
   * Set the completion of the callback
   */
  run?: () => void
}> = ({ id, address, run }) => {
  const intl = useIntl()
  const [loading, setLoading] = useState(false)
  const onDelete = async () => {
    setLoading(true)
    const isOk = await deleteAuthority({ id, address })
    setLoading(false)
    if (isOk) {
      message.success('Delete Success 🎉 🎉 🎉')
      run && run()
      return
    }
    message.error('error')
  }

  const onDeleteConfirm = () => {
    confirm({
      title: 'Delete Administrator',
      icon: <ExclamationCircleOutlined />,
      content: `Confirm that you want to delete this Administrator ?`,
      onOk: () => onDelete(),
    });
  }
  return <>
    <Button loading={loading} onClick={() => onDeleteConfirm()}>{intl.formatMessage({ id: 'component.button.del' })}</Button>
  </>
}

export default AuthorityActionView
