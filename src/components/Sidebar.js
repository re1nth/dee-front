// components/Sidebar.js
import React, { useState, useEffect, useContext } from 'react';
import { Menu, Button } from 'antd';
import { AuthContext } from '../AuthContext'; // Adjust the import path as necessary
import {createSceneForProject} from '../networkCalls/sceneService';

const Sidebar = ({ scenes, selectedScene, setSelectedScene, setSelectedSceneKey }) => {
  const [sceneCount, setSceneCount] = useState(Object.keys(scenes).length);
  const { authToken } = useContext(AuthContext); // Retrieve authToken from AuthContext

  useEffect(() => {
    setSceneCount(Object.keys(scenes).length);
  }, [scenes]);

  const addNewScene = async () => {
    console.log('Before adding new scene', scenes);
    const newSceneKey = sceneCount;

    // Call to create a new scene and wait for the response
    try {
      const response = await createSceneForProject(1, `Scene ${newSceneKey + 1}`, authToken);
      scenes[newSceneKey] = { key: response.id, name: response.name, columns: [] }; // Initialize with key, name, and empty columns

      setSceneCount(newSceneKey + 1);
      setSelectedScene(newSceneKey);
      setSelectedSceneKey(response.id);
      console.log('After adding new scene', scenes);
    } catch (error) {
      console.error('Error creating scene:', error);
    }
  };

  return (
    <div style={{ height: '100vh', overflowY: 'auto' }}>
      <Menu
        mode="inline"
        selectedKeys={[selectedScene !==undefined ? selectedScene.toString() : '']}
        onClick={({ key }) => {
          setSelectedScene(Number(key));
          setSelectedSceneKey(scenes[Number(key)]? scenes[Number(key)]?.key : null);
        }}
        style={{ height: '100%', borderRight: 0 }}
      >
      {scenes && Object.values(scenes).length > 0 ? (
        Object.values(scenes).map((scene, index) => (
          <Menu.Item key={index}>{scene.name}</Menu.Item>
        ))
        ) : (
          <Menu.Item key="no-scenes" disabled>
            No scenes available
          </Menu.Item>
        )}
        <Menu.Item key="add-new-scene" disabled>
          <Button type="primary" onClick={addNewScene} style={{ width: '100%' }}>
            Add New Scene
          </Button>
        </Menu.Item>
      </Menu>
  </div>
  );
};

export default Sidebar;