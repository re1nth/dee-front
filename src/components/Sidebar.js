// components/Sidebar.js
import React from 'react';
import { Menu } from 'antd';

const Sidebar = ({ scenes, selectedScene, setSelectedScene }) => {
  return (
    <Menu
      mode="inline"
      selectedKeys={[selectedScene.toString()]}
      onClick={({ key }) => setSelectedScene(Number(key))}
      style={{ height: '100%', borderRight: 0 }}
    >
      {Object.keys(scenes).map((scene) => (
        <Menu.Item key={scene}>Scene {scene}</Menu.Item>
      ))}
    </Menu>
  );
};

export default Sidebar;