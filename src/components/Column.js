// components/Column.js
import React, { useState } from 'react';
import { useDrop } from 'react-dnd';
import { Card, Input, Button, Space } from 'antd';
import Task from './Task';
import { ItemTypes } from '../constants';
import { createUserStory } from '../networkCalls/userStoryService';

const Column = ({ column, moveTask, addTask, editColumnTitle, authToken, selectedSceneKey }) => {

  const [taskTitle, setTaskTitle] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [newTitle, setNewTitle] = useState(column.title);

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

  const handleEditTitle = async () => {
    if (newTitle.trim()) {
      // Handle success (e.g., update UI, show notification)
      editColumnTitle(column.id, newTitle);
      setIsEditing(false);
    }
  };

  return (
    <Card
      title={
        isEditing ? (
          <Input
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
            onPressEnter={handleEditTitle}
            onBlur={handleEditTitle}
            autoFocus
          />
        ) : (
          <div onClick={() => setIsEditing(true)}>{column.title}</div>
        )
      }
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