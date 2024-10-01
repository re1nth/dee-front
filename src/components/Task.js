// components/Task.js
import React, { useState } from 'react';
import { useDrag } from 'react-dnd';
import { Card, Checkbox } from 'antd';
import { ItemTypes } from '../constants';

const Task = ({ task, columnId, editTask }) => {

  const [isClosed, setIsClosed] = useState(task.isClosed);

  const handleCheckboxChange = async () => {
    // Update the task status in the backend
    console.log("Current task status and version : ", isClosed, task.version);

    await editTask(task.id, columnId, task.title, !isClosed, task.version);

    setIsClosed(!isClosed);
  };

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
    <Checkbox 
      style={{ marginRight: '8px' }} 
      checked={isClosed} 
      onChange={handleCheckboxChange}
      />
      {task.title}
    </Card>
  );
};

export default Task;