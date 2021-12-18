/* eslint-disable no-nested-ternary */
import React, { useEffect, useRef, useState } from 'react';
import { Upload, message } from 'antd';
import { LoadingOutlined, PlusOutlined } from '@ant-design/icons';
import { fileUploader } from '@/services/uploader';
import type { RcFile, UploadChangeParam } from 'antd/lib/upload';

type SupportedFileType = 'image' | 'video';

interface IAvatarUploaderProps {
  value?: any;
  sizeLimit: number;
  onChange?: (value: string | undefined) => void;
  fileType: SupportedFileType;
}

const supportedFile = {
  image: {
    accept: '.jpg, .png, .jp2, .jpeg',
    uploadedType: ['image/jpg', 'image/png', 'image/gif', 'image/jp2', 'image/jpeg'],
    helpText: 'Only support jpg, png, gif, jpeg, jp2!',
  },
  video: {
    accept: '.mp4',
    uploadedType: ['video/mp4'],
    helpText: 'Only support jpg, png, gif, jpeg, jp2!',
  },
};

const AvatarUploader: React.FC<IAvatarUploaderProps> = ({
  value,
  onChange,
  sizeLimit,
  fileType,
}) => {
  const isMounted = useRef<boolean>(false);

  const [uploading, setUploading] = useState<boolean>(false);

  useEffect(() => {
    isMounted.current = true;
    return () => {
      isMounted.current = false;
    };
  }, []);

  function beforeUpload(file: RcFile) {
    const isTypeLegal = supportedFile[fileType].uploadedType.find(
      (supportedType) => supportedType === file.type,
    );
    if (!isTypeLegal) {
      message.error(supportedFile[fileType].helpText);
    }

    const isSizeLegal = file.size / 1024 / 1024 < sizeLimit;
    if (!isSizeLegal) {
      message.error(`Image must smaller than ${sizeLimit}M!`);
    }

    return isTypeLegal && isSizeLegal;
  }

  const handleChange = (info: UploadChangeParam) => {
    if (info.file.status === 'uploading' && isMounted.current) {
      setUploading(true);
      return;
    }
    if (info.file.status === 'done' && info.file.originFileObj) {
      const formData = new FormData();
      formData.append('filename', info.file.originFileObj);

      fileUploader(formData).then((res) => {
        if (res.result?.path) {
          if (isMounted.current) {
            // 设置表单内的imgUrl
            onChange?.(res.result.path);

            setTimeout(() => {
              setUploading(false);
            }, 1000);
          }
        } else {
          message.error('Upload failed');
        }
      });
    }
  };

  const uploadButton = (
    <div>
      {uploading ? <LoadingOutlined /> : <PlusOutlined />}
      <div style={{ marginTop: 8 }}>{uploading ? 'Uploading' : 'Upload'}</div>
    </div>
  );

  const showUploadResult = () => {
    return fileType === 'video' ? (
      <video src={value} style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
    ) : (
      <img
        src={value}
        alt="avatar"
        style={{ width: '100%', height: '100%', objectFit: 'contain' }}
      />
    );
  };

  return (
    <Upload
      name="avatar"
      accept={supportedFile[fileType].accept}
      listType="picture-card"
      showUploadList={false}
      className="avatar-uploader"
      beforeUpload={beforeUpload}
      onChange={handleChange}
    >
      {!uploading && value ? showUploadResult() : uploadButton}
    </Upload>
  );
};

export default AvatarUploader;
