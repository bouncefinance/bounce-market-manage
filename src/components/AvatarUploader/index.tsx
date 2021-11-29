import React, { useEffect, useRef, useState } from 'react';
import { Upload, message } from 'antd';
import { LoadingOutlined, PlusOutlined } from '@ant-design/icons';
import { fileUploader } from '@/services/uploader';
import type { RcFile, UploadChangeParam } from 'antd/lib/upload';

interface IAvatarUploaderProps {
  value?: any;
  sizeLimit: number;
  onChange?: (value: string | undefined) => void;
}

const SupportedImgType = ['image/jpg', 'image/png', 'image/gif', 'image/jp2', 'image/jpeg'];

const AvatarUploader: React.FC<IAvatarUploaderProps> = ({ sizeLimit, onChange }) => {
  const isUnmounted = useRef<boolean>(false);

  const [loading, setLoading] = useState<boolean>(false);
  const [imageUrl, setImageUrl] = useState<string>();

  useEffect(() => {
    return () => {
      isUnmounted.current = false;
    };
  }, []);

  function beforeUpload(file: RcFile) {
    const isTypeLegal = SupportedImgType.find((supportedType) => supportedType === file.type);
    if (!isTypeLegal) {
      message.error('Only support jpg, png, gif, jpeg, jp2!');
    }

    const isSizeLegal = file.size / 1024 / 1024 < sizeLimit;
    if (!isSizeLegal) {
      message.error(`Image must smaller than ${sizeLimit / 1024 / 1024}M!`);
    }

    return isTypeLegal && isSizeLegal;
  }

  const handleChange = (info: UploadChangeParam) => {
    if (info.file.status === 'uploading') {
      setImageUrl(undefined);
      setLoading(true);
      return;
    }
    if (info.file.status === 'done' && info.file.originFileObj) {
      const formData = new FormData();
      formData.append('filename', info.file.originFileObj);

      if (!isUnmounted.current) {
        fileUploader(formData).then((res) => {
          if (res.result?.path) {
            setImageUrl(res.result.path);

            onChange?.(res.result.path);

            setTimeout(() => {
              setLoading(false);
            }, 1000);
          } else {
            message.error('Upload failed');
          }
        });
      }
    }
  };

  const uploadButton = (
    <div>
      {loading ? <LoadingOutlined /> : <PlusOutlined />}
      <div style={{ marginTop: 8 }}>Upload</div>
    </div>
  );

  return (
    <Upload
      name="avatar"
      accept=".jpg, .png, .gif, .jpeg, .jp2,"
      listType="picture-card"
      className="avatar-uploader"
      showUploadList={false}
      beforeUpload={beforeUpload}
      onChange={handleChange}
    >
      {imageUrl ? <img src={imageUrl} alt="avatar" style={{ width: '100%' }} /> : uploadButton}
    </Upload>
  );
};

export default AvatarUploader;
