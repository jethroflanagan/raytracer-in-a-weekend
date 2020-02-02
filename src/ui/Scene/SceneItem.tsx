import React from 'react';
import PropTypes from 'prop-types';
import { Icon, List, Form } from 'antd';
import { ItemProperty } from './ItemProperty';

export const SceneItem = ({ item, type }) => {
  const properties = item.map(({ name, type, value, ...options }) => (
    <List.Item key={name}>
      <ItemProperty type={type} name={name} value={value} options={options} />
    </List.Item>
  ));

  return (
    <Form layout="horizontal" onSubmit={() => {}}>
      <List>
        {properties}
      </List>
    </Form>
  );
}

SceneItem.propTypes = {
  item: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
  type: PropTypes.string.isRequired,
}
