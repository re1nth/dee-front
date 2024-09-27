// components/AddColumn.js
import React, { useState } from 'react';
import { Input, Button, Card } from 'antd';

const AddColumn = ({ addColumn }) => {
  const [columnTitle, setColumnTitle] = useState('');
  
  const handleAddColumn = () => {
    console.log("Hello Laila add column");
    if (columnTitle.trim()) {
      addColumn(columnTitle);
      setColumnTitle('');
    }
  };

  return (
    <Card className="column" bodyStyle={{ padding: '16px' }}>
      <Input
        placeholder="New column title"
        value={columnTitle}
        onChange={(e) => setColumnTitle(e.target.value)}
        onPressEnter={handleAddColumn}
      />
      <Button type="primary" onClick={handleAddColumn} style={{ marginTop: '8px' }}>
        Add Column
      </Button>
    </Card>
  );
};

export default AddColumn;