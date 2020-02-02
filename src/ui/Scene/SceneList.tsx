import React, { useState } from 'react';
import { Menu, Icon, Layout, Dropdown, Button } from 'antd';
import { Vector3 } from 'src/Vector';
import { SceneItem } from './SceneItem';

const CAMERA = 'camera';
const VOLUME_SPHERE = 'sphere';

interface SceneObject {
  name: string,
  type: string,
  id: string,
  properties: {
    name: string,
    value: any,
    type: string,
    [options: string]: any,
  }[],
}

const getIcon = (type) => {
  switch (type) {
    case CAMERA: return 'video-camera';
    case VOLUME_SPHERE: return 'codepen-circle';
    default:
      return '';
  }
}

export function SceneList (props) {
  const [active, setActive] = useState("camera")
  const [items, setItems] = useState([
    {
      name: 'Camera',
      id: 'camera',
      type: CAMERA,
      properties: [
        {
          name: 'Position',
          id: 'position',
          value: new Vector3(),
          type: 'vector3',
        },
        {
          name: 'Vertical FOV',
          id: 'verticalFOV',
          value: 30,
          type: 'float',
        },
        {
          name: 'Look at',
          id: 'lookAt',
          value: new Vector3(),
          type: 'vector3',
        },
        {
          name: 'Aperture',
          id: 'aperture',
          value: 0,
          type: 'float',
          min: 0,
          max: 1,
        },
        {
          name: 'Focal distance',
          id: 'focalDistance',
          value: 0,
          type: 'float',
        },
        {
          name: 'Shutter open time',
          id: 'shutterOpenTime',
          value: 0,
          type: 'int',
        },
      ],
    },
    {
      name: 'Sphere1',
      id: 'sphere1',
      type: VOLUME_SPHERE,
      properties: [
        {
          name: 'Position',
          id: 'position',
          value: new Vector3(),
          type: 'vector3',
        },
        {
          name: 'Radius',
          id: 'radius',
          type: 'float',
          value: 3,
        },
        {
          name: 'Material',
          id: 'material',
          value: null,
          type: 'material',
        }
      ],
    },
  ])
  const addItem = (item) => {
    console.log(item);
    // setItems(items.concat(item))
  }

  // const items: SceneObject[] = ;

  const list = items.map(({ name, type, properties, id }, i) => (
    <Menu.Item key={i} onClick={() => setActive(id)}><Icon type={getIcon(type)} />{name}</Menu.Item>
  ));
  // <SceneItem item={properties} type={type} />

  const activeItem = items.find(item => item.id === active);
  const availableItems = (
    <Menu onClick={addItem}>
      <Menu.Item><Icon type="codepen-circle" />Volume</Menu.Item>
      {/* <Menu.Item><Icon type="" />Transform</Menu.Item> */}
      <Menu.Item><Icon type="" />Background</Menu.Item>
    </Menu>
  );
  return (
    <Layout>
      <Layout.Sider theme="light">
        <Dropdown overlay={availableItems}>
          <Button>Add <Icon type="plus" /></Button>
        </Dropdown>
        <Menu mode="inline">
          {list}
        </Menu>

      </Layout.Sider>
      <Layout.Content>
        <SceneItem item={activeItem.properties} type={activeItem.type} />
      </Layout.Content>
    </Layout>
  );
}
