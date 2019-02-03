import React from 'react';
import { Icon } from 'antd';

const ToggleBox = ({ search }) => (
  <span>
    Advanced Search{' '}
    {!search ? (
      <Icon type="down" theme="outlined" />
    ) : (
      <Icon type="up" theme="outlined" />
    )}
  </span>
);

export default ToggleBox;
