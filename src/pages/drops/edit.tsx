import React from 'react';
import { PageContainer } from '@ant-design/pro-layout';
import { Button, Card, Form, Input, Image } from 'antd';
import ImageUploader from '@/components/ImageUploader';
import { useState } from 'react';
import styles from './index.less';
import ColorPicker from '@/components/ColorPicker';

const DropEdit: React.FC = () => {
  const [coverImage, setCoverImage] = useState<any>(null);
  const handleEdit = (data) => {
    console.log(data);
  };
  return (
    <PageContainer>
      <Card>
        <Form labelCol={{ span: 6 }} wrapperCol={{ span: 14 }} onFinish={handleEdit}>
          <Form.Item name="cover" label="Cover">
            <ImageUploader
              maxCount={1}
              onChange={(file, items) => {
                setCoverImage(file);
              }}
            />
          </Form.Item>
          <Form.Item label="Preview">
            {coverImage && (
              <div className={styles['cover-image']}>
                <div className={styles['preview']}>
                  <Image
                    width={300}
                    height={100}
                    src={coverImage?.thumbUrl || coverImage?.url}
                    preview={false}
                  />
                </div>
                <div className={styles['preview']}>
                  <Image
                    width={80}
                    height={100}
                    src={coverImage?.thumbUrl || coverImage?.url}
                    preview={false}
                  />
                </div>
              </div>
            )}
          </Form.Item>
          <Form.Item name="bgcolor" label="Background Color">
            <ColorPicker />
          </Form.Item>
          <Form.Item name="title" label="Title">
            <Input />
          </Form.Item>
          <Form.Item name="descript" label="Description">
            <Input />
          </Form.Item>
          <Form.Item name="dropdate" label="Drop Date">
            <Input />
          </Form.Item>
          <Form.Item label="Social Link">
            <Form.Item name="instagram">
              <Input addonBefore="Instagram" />
            </Form.Item>
            <Form.Item name="twitter">
              <Input addonBefore="Twitter" />
            </Form.Item>
            <Form.Item name="website">
              <Input addonBefore="Website" />
            </Form.Item>
          </Form.Item>
          <Form.Item style={{ textAlign: 'right' }}>
            <Button type="primary" htmlType="submit">
              Submit
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </PageContainer>
  );
};
export default DropEdit;
