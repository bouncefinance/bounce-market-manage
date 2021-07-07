import React, { useState } from 'react';
import { Input, Button, Modal, Upload, message, Form, Select } from 'antd';
import styles from '../index.less';
import { useIntl } from 'umi';
import { LoadingOutlined, PlusOutlined } from '@ant-design/icons';
import type { RcFile } from 'antd/lib/upload';
import request from 'umi-request';
import { AuthorityRoleEnum } from '../actions/apiType';
import type { IAddAuthorityParams } from '../actions/addAuthority';
import addAuthority from '../actions/addAuthority';
import { Apis } from '@/services';

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

  const [loading, setLoading] = useState(false);
  const [imageUrl, setImageUrl] = useState('');
  const uploadButton = (
    <div>
      {loading ? <LoadingOutlined /> : <PlusOutlined />}
      <div style={{ marginTop: 8 }}>Upload</div>
    </div>
  );

  const [formLoading, setFormLoading] = useState(false);
  const [form] = Form.useForm();
  const onBeforeUpload = async (file: RcFile) => {
    if (file.type.indexOf('image/') < 0) {
      message.error('Please select the image type');
      return;
    }
    const formData = new FormData();
    formData.append('filename', file);
    setLoading(true);
    const result = await request.post(Apis.fileupload, {
      data: formData,
    });
    setLoading(false);
    if (result.code !== 200) {
      message.error(result.msg);
      return;
    }
    setImageUrl(result.result.path);
    form.setFieldsValue({ userImageUrl: result.result.path });
  };
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
    setImageUrl('');
  };
  const handleOk = () => {
    form.submit();
  };
  const handleCancel = () => {
    reset();
    setIsModalVisible(false);
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
      >
        <Form
          labelCol={{ span: 5 }}
          initialValues={{ opRole: AuthorityRoleEnum.super }}
          form={form}
          onFinish={onFinish}
        >
          <Form.Item
            name="opRole"
            label="Role"
            rules={[{ required: true, message: 'role not empty' }]}
          >
            <Select loading={loading} style={{ width: 220 }}>
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
            label="Address"
            rules={[{ required: true, message: 'address not empty' }]}
          >
            <Input allowClear placeholder="Input Address" />
          </Form.Item>
          <Form.Item
            name="username"
            label="User Name"
            rules={[{ required: true, message: 'user name not empty' }]}
          >
            <Input allowClear placeholder="Input note name" />
          </Form.Item>
          <Form.Item
            name="notename"
            label="Note Name"
            rules={[{ required: true, message: 'note name not empty' }]}
          >
            <Input allowClear placeholder="Input note name" />
          </Form.Item>
          <Form.Item
            name="userImageUrl"
            label="Avatar"
            rules={
              [
                // { required: true, message: 'avatar not empty' },
              ]
            }
          >
            <div className={[styles.avatarUploader, 'flex flex-center-y'].join(' ')}>
              <Upload
                name="Avatar"
                listType="picture-card"
                showUploadList={false}
                beforeUpload={onBeforeUpload}
                className={styles.updater}
              >
                {imageUrl ? <img src={imageUrl} alt="avatar" /> : uploadButton}
              </Upload>
              <div className={styles.avatarUploaderRight}>
                <p className={styles.tips}>Supports JPG, PNG, JPEG2000</p>
                <p className={styles.tips}>300x300 Recommended</p>
              </div>
            </div>
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default AuthorityTopView;
