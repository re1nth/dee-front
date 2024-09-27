// components/Task.js
import React from 'react';
import { useDrag } from 'react-dnd';
import { Card, Checkbox } from 'antd';
import { ItemTypes } from '../constants';

const Task = ({ task, columnId }) => {
  const [, drag] = useDrag({
    type: ItemTypes.TASK,
    item: { id: task.id, columnId },
  });

  return (
    <Card
      ref={drag}
      className="task"
      style={{ 
        marginBottom: '8px', 
        borderRadius: '4px', 
        boxShadow: '0 1px 3px rgba(0,0,0,0.1)', 
        height: '60px', // Adjust the height as needed
        display: 'flex',
        alignItems: 'center'
      }}
    >
      <Checkbox style={{ marginRight: '8px' }} />
      {task.title}
    </Card>
  );
};

export default Task;