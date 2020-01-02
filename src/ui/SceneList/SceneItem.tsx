import React from 'react';
import PropTypes from 'prop-types';
import { Icon, List } from 'antd';
import { ItemProperty } from './ItemProperty';

export const SceneItem = ({ item, type }) => {
  const properties = item.map(({ name, type, value, ...options }) => (
    <List.Item key={name}>
      <ItemProperty type={type} name={name} value={value} options={options} />
    </List.Item>
  ));

  return (
    <List>
      {properties}
    </List>
  );
}

SceneItem.propTypes = {
  item: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
  type: PropTypes.string.isRequired,
}
