import AvatarUploader from '@/components/AvatarUploader';
import type { IUserInfo, ModalAction } from '@/services/airdrop/types';
import { Button, Form, Input, Modal } from 'antd';
import React, { useEffect } from 'react';

export type IUserInfoModalProps = {
  modalAction: ModalAction;
  userIndex: number;
  isModalVisible: boolean;
  setIsModalVisible: any;
  userInfoArr: IUserInfo[];
  setUserInfoArr: any;
};

const UserInfoModal: React.FC<IUserInfoModalProps> = ({
  modalAction,
  userIndex,
  isModalVisible,
  setIsModalVisible,
  userInfoArr,
  setUserInfoArr,
}) => {
  const [form] = Form.useForm();

  useEffect(() => {
    if (modalAction === 'edit') {
      const image = {
        uid: 0,
        name: 'image file',
        status: 'done',
        thumbUrl: userInfoArr[userIndex].useravatars || '',
        url: userInfoArr[userIndex].useravatars || '',
      };

      form.setFieldsValue({
        userName: userInfoArr[userIndex].usernames,
        avatarimg: image,
      });
    }
  }, [modalAction]);

  useEffect(() => {
    form.resetFields();
  }, [isModalVisible]);

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const handleSubmit = (values: {
    userName: string | undefined;
    avatarimg: string | undefined;
  }) => {
    const tempArr = userInfoArr;
    tempArr[userIndex] = { useravatars: values.avatarimg || '', usernames: values.userName || '' };

    setUserInfoArr(
      tempArr.map((userInfo) => {
        return userInfo;
      }),
    );
    setIsModalVisible(false);
  };

  return (
    <Modal
      title="Basic Modal"
      visible={isModalVisible}
      footer={false}
      onCancel={handleCancel}
      destroyOnClose
    >
      <Form
        form={form}
        name="basic"
        labelCol={{ span: 4 }}
        wrapperCol={{ span: 18 }}
        initialValues={{ remember: true }}
        autoComplete="off"
        onFinish={handleSubmit}
      >
        <Form.Item name="userName" label="username">
          <Input />
        </Form.Item>

        <Form.Item label="avatar">
          <Form.Item name="avatarimg" noStyle>
            <AvatarUploader sizeLimit={4} />
          </Form.Item>
          <span>Support jpg, png, gif, jpeg, jp2. Max size: 10MB.</span>
        </Form.Item>

        <Form.Item wrapperCol={{ offset: 10, span: 2 }} style={{ textAlign: 'right' }}>
          <Button type="primary" htmlType="submit">
            {'Save'}
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default UserInfoModal;
