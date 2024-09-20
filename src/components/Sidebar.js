// components/Sidebar.js
import React, { useState } from 'react';
import { Menu, Button } from 'antd';

const Sidebar = ({ scenes, selectedScene, setSelectedScene }) => {
  const [sceneCount, setSceneCount] = useState(Object.keys(scenes).length);

  const addNewScene = () => {
    const newSceneKey = sceneCount + 1;
    scenes[newSceneKey] = { columns: [] }; // Initialize with empty columns
    setSceneCount(newSceneKey);
    setSelectedScene(newSceneKey);
  };

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
      <Menu.Item key="add-new-scene" disabled>
        <Button type="primary" onClick={addNewScene} style={{ width: '100%' }}>
          Add New Scene
        </Button>
      </Menu.Item>
    </Menu>
  );
};

export default Sidebar;