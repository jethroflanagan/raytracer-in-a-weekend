import React from 'react';
import { Menu, Icon, Layout, Dropdown, Button } from 'antd';
import { Vector3 } from 'src/Vector';
import { SceneItem } from './SceneItem';

const CAMERA = 'camera';
const VOLUME_SPHERE = 'sphere';

interface SceneObject {
  name: string,
  type: string,
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
  const items: SceneObject[] = [
    {
      name: 'Camera',
      type: CAMERA,
      properties: [
        {
          name: 'Position',
          value: new Vector3(),
          type: 'vector3',
        },
        {
          name: 'Vertical FOV',
          value: 30,
          type: 'float',
        },
        {
          name: 'Look at',
          value: new Vector3(),
          type: 'vector3',
        },
        {
          name: 'Aperture',
          value: 0,
          type: 'float',
          min: 0,
          max: 1,
        },
        {
          name: 'Focal distance',
          value: 0,
          type: 'float',
        },
        {
          name: 'shutterOpenTime',
          value: 0,
          type: 'int',
        },
      ],
    },
    {
      name: 'Sphere1',
      type: VOLUME_SPHERE,
      properties: [
        {
          name: 'Position',
          value: new Vector3(),
          type: 'vector3',
        },
        {
          name: 'Radius',
          value: 3,
          type: 'float',
        },
        {
          name: 'Material',
          value: null,
          type: 'material',
        }
      ],
    },
  ];

  const list = items.map(({ name, type, properties }, i) => (
    <Menu.Item key={i}><Icon type={getIcon(type)} />{name}</Menu.Item>
  ));
  // <SceneItem item={properties} type={type} />


  const addList = (
    <Menu>
      <Menu.Item><Icon type="codepen-circle" />Volume</Menu.Item>
      <Menu.Item><Icon type="" />Transform</Menu.Item>
      <Menu.Item><Icon type="" />Background</Menu.Item>
    </Menu>
  );
  return (
    <Layout>
      <Layout.Sider theme="light">
        <Dropdown overlay={addList}>
          <Button>Add <Icon type="plus" /></Button>
        </Dropdown>
        <Menu mode="inline">
          {list}
        </Menu>

      </Layout.Sider>
      <Layout.Content>
        <SceneItem item={items[0].properties} type={items[0].type} />
      </Layout.Content>
    </Layout>
  );
}
