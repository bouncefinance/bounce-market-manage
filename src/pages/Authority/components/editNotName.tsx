import React from 'react';
import { Input, Button, Modal, message } from 'antd';
import { EditOutlined } from '@ant-design/icons';
import { useState } from 'react';
import { useIntl } from 'umi';
import updateAuthority from '../actions/updateAuthority';

const styles: Record<string, React.CSSProperties> = {
  editName: {
    marginRight: '10px',
  },
};

const AuthorityRowEditNoteName: React.FC<{
  id: number;
  value: string;
  /**
   * 操作完成回调
   * Set the completion of the callback
   */
  run?: () => void;
}> = ({ value, id, run }) => {
  const intl = useIntl();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [inputValue, setInputValue] = useState(value);
  const [oldValue, setOldValue] = useState(value);
  const [loading, setLoading] = useState(false);
  const handleOk = async () => {
    setLoading(true);
    const isOk = await updateAuthority({ id, notename: inputValue });
    setLoading(false);
    if (isOk) {
      message.success('Set Success 🎉 🎉 🎉');
      setIsModalVisible(false);
      setOldValue(inputValue);
      run?.();
      return;
    }
    message.error('error');
  };
  const resetData = () => {
    setInputValue(value);
  };
  const handleCancel = () => {
    resetData();
    setIsModalVisible(false);
  };
  return (
    <>
      <div>
        <span style={styles.editName}>{oldValue}</span>
        <Button type="link" loading={loading} size="small" onClick={() => setIsModalVisible(true)}>
          <EditOutlined />
          <span>{intl.formatMessage({ id: 'component.button.edit' })}</span>
        </Button>
      </div>
      <Modal
        title="Edit Note Name"
        visible={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
      >
        <Input
          value={inputValue}
          onChange={(e) => {
            setInputValue(e.target.value);
          }}
          placeholder="input Note name"
        />
      </Modal>
    </>
  );
};

export default AuthorityRowEditNoteName;
