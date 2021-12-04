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
    type: ['image/jpg', 'image/png', 'image/gif', 'image/jp2', 'image/jpeg'],
    helpText: 'Only support jpg, png, gif, jpeg, jp2!',
  },
  video: { type: ['video/mp4'], helpText: 'Only support jpg, png, gif, jpeg, jp2!' },
};

const SupportedImageType = ['image/jpg', 'image/png', 'image/gif', 'image/jp2', 'image/jpeg'];
const SupportedVideoType = ['video/mp4'];

const AvatarUploader: React.FC<IAvatarUploaderProps> = ({
  value,
  onChange,
  sizeLimit,
  fileType,
}) => {
  const isMounted = useRef<boolean>(false);

  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    isMounted.current = true;
    return () => {
      isMounted.current = false;
    };
  }, []);

  function beforeUpload(file: RcFile) {
    const isTypeLegal = supportedFile[fileType].type.find(
      (supportedType) => supportedType === file.type,
    );
    if (!isTypeLegal) {
      message.error(supportedFile[fileType].helpText);
    }

    const isSizeLegal = file.size / 1024 / 1024 < sizeLimit;
    if (!isSizeLegal) {
      message.error(`Image must smaller than ${sizeLimit}M!`);
    }

    return isTypeLegal &&  isSizeLegal;
  }

  const handleChange = (info: UploadChangeParam) => {
    if (info.file.status === 'uploading' && isMounted.current) {
      setLoading(true);
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
              setLoading(false);
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
      {loading ? <LoadingOutlined /> : <PlusOutlined />}
      <div style={{ marginTop: 8 }}>Upload</div>
    </div>
  );

  return (
    <Upload
      name="avatar"
      accept=".mp4,"
      listType="picture-card"
      className="avatar-uploader"
      showUploadList={false}
      beforeUpload={beforeUpload}
      onChange={handleChange}
    >
      {!loading && value ? (
        <video src={value} style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
      ) : (
        uploadButton
      )}
    </Upload>
  );
};

export default AvatarUploader;
