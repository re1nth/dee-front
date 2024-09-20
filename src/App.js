// App.js
import React from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { Row, Col } from 'antd';
import Column from './components/Column';
import useKanban from './hooks/useKanban';
import './App.css';

const App = () => {
  const { data, moveTask, addTask } = useKanban();

  return (
    <DndProvider backend={HTML5Backend}>
      <Row gutter={16} className="board">
        {data.columns.map((column) => (
          <Col span={6} key={column.id}>
            <Column column={column} moveTask={moveTask} addTask={addTask} />
          </Col>
        ))}
      </Row>
    </DndProvider>
  );
};

export default App;