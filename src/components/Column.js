// components/Column.js
import React, { useState } from 'react';
import { useDrop } from 'react-dnd';
import { Card, Input, Button, Space } from 'antd';
import Task from './Task';
import { ItemTypes } from '../constants';

const Column = ({ column, moveTask, addTask }) => {
  const [taskTitle, setTaskTitle] = useState('');

  const [, drop] = useDrop({
    accept: ItemTypes.TASK,
    drop: (item) => moveTask(item.id, item.columnId, column.id),
  });

  const handleAddTask = () => {
    if (taskTitle.trim()) {
      addTask(column.id, taskTitle);
      setTaskTitle('');
    }
  };

  return (
    <Card
      title={column.title}
      ref={drop}
      className="column"
      headStyle={{ backgroundColor: '#f0f2f5', fontWeight: 'bold' }}
      bodyStyle={{ padding: '16px' }}
    >
      <Space direction="vertical" style={{ width: '100%' }}>
        {column.tasks.map((task) => (
          <Task key={task.id} task={task} columnId={column.id} />
        ))}
        <Input
          placeholder="New task"
          value={taskTitle}
          onChange={(e) => setTaskTitle(e.target.value)}
          onPressEnter={handleAddTask}
        />
        <Button type="primary" onClick={handleAddTask}>
          Add Task
        </Button>
      </Space>
    </Card>
  );
};

export default Column;