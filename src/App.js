// App.js
import React, { useEffect, useContext } from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { Layout, Row, Col } from 'antd';
import Column from './components/Column';
import Sidebar from './components/Sidebar';
import AddColumn from './components/AddColumn';
import useKanban from './hooks/useKanban';
import loginUser from './networkCalls/authService';
import { AuthContext } from './AuthContext'; // Import the AuthContext
import './App.css';

const { Sider, Content } = Layout;

const App = () => {
  const { data, selectedScene, setSelectedScene, moveTask, addTask, addColumn, editColumnTitle } = useKanban();
  const { setAuthToken } = useContext(AuthContext); // Use the AuthContext

  useEffect(() => {
    const authenticateUser = async () => {
      try {
        const response = await loginUser('test-username', 'password');
        console.log('Username:', response.username);
        console.log('Auth Token:', response.auth_token);
        setAuthToken(response.auth_token); // Store the auth_token globally
      } catch (error) {
        console.error('Error logging in:', error);
      }
    };

    authenticateUser();
  }, [setAuthToken]);

  const renderColumns = () => {
    if (data?.scenes && data.scenes[selectedScene]?.columns) {
      return data.scenes[selectedScene].columns.map((column) => (
        <Col span={6} key={column.id}>
          <Column column={column} moveTask={moveTask} addTask={addTask} editColumnTitle={editColumnTitle} />
        </Col>
      ));
    } else {
      return (
        <Col span={24}>
          <div>No columns available</div>
        </Col>
      );
    }
  };

  return (
    <Layout style={{ height: '100vh' }}>
      <Sider width={200} className="site-layout-background">
        <Sidebar scenes={data?.scenes || {}} selectedScene={selectedScene} setSelectedScene={setSelectedScene} />
      </Sider>
      <Layout style={{ padding: '0 24px 24px' }}>
        <Content style={{ padding: 24, margin: 0, minHeight: 280 }}>
          <DndProvider backend={HTML5Backend}>
            <Row gutter={16} className="board">
              {renderColumns()}
              <Col span={6}>
                <AddColumn addColumn={addColumn} />
              </Col>
            </Row>
          </DndProvider>
        </Content>
      </Layout>
    </Layout>
  );
};

export default App;