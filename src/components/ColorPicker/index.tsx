import { Button, Tooltip } from 'antd';
import React from 'react';
import { SketchPicker } from 'react-color';
import Styles from './index.less';

interface ColorPickerProps {
  onChange?: (color: string) => void;
  value?: string;
}

const ColorPicker: React.FC<ColorPickerProps> = ({ onChange, value = '#000' }) => {
  const handleChange = (color: any) => {
    onChange?.(color?.hex || color);
  };
  return (
    <div>
      <Tooltip
        trigger="click"
        overlayStyle={{ maxWidth: 300 }}
        title={
          <div style={{ color: '#000' }}>
            <SketchPicker width="250px" color={value} onChange={handleChange} />
          </div>
        }
      >
        <div className={Styles['color-preview-box']}>
          <div style={{ backgroundColor: value }} />
        </div>
      </Tooltip>
      <Button type="link" onClick={() => handleChange('#000')}>
        重置
      </Button>
    </div>
  );
};

export default ColorPicker;
