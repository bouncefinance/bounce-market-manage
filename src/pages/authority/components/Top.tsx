import React, { useState } from 'react';
import { Input, Button, Modal, Upload, message, Form, Select, Divider, Image } from 'antd';
import styles from '../index.less';
import { useIntl, useRequest } from 'umi';
import { AuthorityRoleEnum } from '../actions/apiType';
import type { IAddAuthorityParams } from '../actions/addAuthority';
import addAuthority from '../actions/addAuthority';
import { defaultUserPageParams, getUserList } from '@/services/user';
import Text from 'antd/lib/typography/Text';
import { ImgErrorUrl } from '@/tools/const';

const { Option } = Select;
const { Search } = Input;

const AuthorityTopView: React.FC<{ onSearch: (v: string) => void; run: () => void }> = ({
  onSearch,
  run,
}) => {
  const intl = useIntl();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const onAdd = () => {
    setIsModalVisible(true);
  };

  const [formLoading, setFormLoading] = useState(false);
  const [form] = Form.useForm();
  const [address, setAddress] = useState('');

  const onFinish = async (values: IAddAuthorityParams) => {
    setFormLoading(true);
    const res = await addAuthority(values);
    setFormLoading(false);
    if (res.code !== 1) {
      message.error(res.msg || 'error');
      return;
    }
    message.success('Set Success 🎉 🎉 🎉');
    setIsModalVisible(false);
    run?.();
  };
  const reset = () => {
    form.resetFields();
    setAddress('');
  };
  const handleOk = () => {
    form.submit();
  };
  const handleCancel = () => {
    reset();
    setIsModalVisible(false);
  };

  const {
    data: userSearchResult,
    loading: userSearchLoading,
    run: userSearchRun,
    params,
  } = useRequest((props, value = '') => getUserList({ ...props }, value), {
    throttleInterval: 500,
    manual: true,
  });
  const matchUser = userSearchResult?.[0];
  const onUserSearch = (e: any) => {
    const { value } = e.target;
    setAddress(value);
    if (value) {
      userSearchRun({ ...params, ...defaultUserPageParams }, value);
    }
  };
  return (
    <>
      <div className={['flex flex-space-x', styles.topHandle].join(' ')}>
        <div style={{ width: '500px' }}>
          <Search
            placeholder="Input Address or Name"
            allowClear
            onSearch={onSearch}
            size="middle"
          />
        </div>
        <Button onClick={onAdd}>{intl.formatMessage({ id: 'component.button.add' })}</Button>
      </div>
      <Modal
        confirmLoading={formLoading}
        maskClosable={false}
        title="Add Administrator"
        visible={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
        width={640}
      >
        <Form
          labelCol={{ span: 6 }}
          initialValues={{ opRole: AuthorityRoleEnum.super }}
          form={form}
          onFinish={onFinish}
        >
          <Form.Item
            name="opRole"
            label="Role"
            rules={[{ required: true, message: 'role not empty' }]}
          >
            <Select style={{ width: 250 }}>
              {[
                { value: AuthorityRoleEnum.super, label: 'Super administrator', key: 1 },
                { value: AuthorityRoleEnum.dropList, label: 'Drops administrator', key: 2 },
                { value: AuthorityRoleEnum.basis, label: 'Basis administrator', key: 3 },
              ].map(({ value, label, key }) => (
                <Option key={key} value={value}>
                  {label}
                </Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item
            name="address"
            label="Address / UserName"
            rules={[{ required: true, message: 'address not empty' }]}
          >
            <Input
              allowClear
              value={address}
              placeholder="Input Address or Username"
              onChange={onUserSearch}
              onInput={onUserSearch}
            />
          </Form.Item>
          <Form.Item
            name="notename"
            label="Note Name"
            rules={[{ required: true, message: 'note name not empty' }]}
          >
            <Input allowClear placeholder="Input note name" />
          </Form.Item>
          {userSearchLoading === false && address && matchUser && (
            <>
              <Divider plain>Match of user</Divider>
              <Form.Item label="Address">
                <Text>{matchUser.accountaddress}</Text>
              </Form.Item>
              <Form.Item label="User Id">
                <Text>{matchUser.id}</Text>
              </Form.Item>
              <Form.Item label="Avatar">
                <div className={[styles.avatarUploader, 'flex flex-center-y'].join(' ')}>
                  <Upload
                    name="Avatar"
                    disabled
                    listType="picture-card"
                    showUploadList={false}
                    className={styles.updater}
                  >
                    {matchUser ? (
                      <Image src={matchUser.imgurl} placeholder={ImgErrorUrl} alt="avatar" />
                    ) : (
                      <></>
                    )}
                  </Upload>
                </div>
              </Form.Item>
            </>
          )}
        </Form>
      </Modal>
    </>
  );
};

export default AuthorityTopView;
