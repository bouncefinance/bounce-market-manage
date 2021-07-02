import { Button, Tooltip } from 'antd';
import React from 'react';
import { SketchPicker } from 'react-color';
import Styles from './index.less';

interface ColorPickerProps {
  onChange: (color: string) => void;
  value?: string;
}

const ColorPicker: React.FC<ColorPickerProps> = ({ onChange, value }) => {
  const handleChange = (color: any) => {
    onChange?.(typeof color === 'string' ? color : color.hex);
  };
  return (
    <div>
      <Tooltip trigger="click" title={<SketchPicker color={value} onChange={handleChange} />}>
        <div className={Styles['color-preview-box']}>
          <div style={{ backgroundColor: value }} />
        </div>
      </Tooltip>
      <Button type="link" onClick={() => handleChange(value || '#000')}>
        重置
      </Button>
    </div>
  );
};

export default ColorPicker;
