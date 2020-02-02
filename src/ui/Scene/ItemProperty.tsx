import React from 'react';
import PropTypes from 'prop-types';
import { Icon, List, Input, InputNumber, Row, Form } from 'antd';
import Grid from 'antd/lib/card/Grid';

const getInput = ({ type, onChange, value, options }) => {
  switch (type) {
    case 'number':
    case 'float':
      return <InputNumber defaultValue={value} />
    case 'int':
      return <InputNumber defaultValue={value} step={1} />
    case 'string':
      return <Input defaultValue={value} placeholder={options.placeholder} />
    case 'vector3':
      return <>
        <Row>x <InputNumber defaultValue={value.x} /></Row>
        <Row>y <InputNumber defaultValue={value.y} /></Row>
        <Row>z <InputNumber defaultValue={value.y} /></Row>
      </>
  }

}

export const ItemProperty = (item) => {
  const { name } = item;
  return (
    <Form.Item label={name}>
      {getInput(item)}
    </Form.Item>
  );
}

ItemProperty.propTypes = {
  name: PropTypes.string.isRequired,
  value: PropTypes.any.isRequired,
  type: PropTypes.string.isRequired,
  options: PropTypes.shape({}).isRequired,
}
