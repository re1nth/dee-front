// App.js
import React from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { Layout, Row, Col } from 'antd';
import Column from './components/Column';
import Sidebar from './components/Sidebar';
import AddColumn from './components/AddColumn';
import useKanban from './hooks/useKanban';
import './App.css';

const { Sider, Content } = Layout;

const App = () => {
  const { data, selectedScene, setSelectedScene, moveTask, addTask, addColumn, editColumnTitle } = useKanban();

  return (
    <Layout style={{ height: '100vh' }}>
      <Sider width={200} className="site-layout-background">
        <Sidebar scenes={data.scenes} selectedScene={selectedScene} setSelectedScene={setSelectedScene} />
      </Sider>
      <Layout style={{ padding: '0 24px 24px' }}>
        <Content style={{ padding: 24, margin: 0, minHeight: 280 }}>
          <DndProvider backend={HTML5Backend}>
            <Row gutter={16} className="board">
              {data.scenes[selectedScene].columns.map((column) => (
                <Col span={6} key={column.id}>
                  <Column column={column} moveTask={moveTask} addTask={addTask} editColumnTitle={editColumnTitle} />
                </Col>
              ))}
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