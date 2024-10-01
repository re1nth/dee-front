// components/AddColumn.js
import React, { useState } from 'react';
import { Input, Button, Card } from 'antd';

const AddColumn = ({ addColumn, authToken, selectedSceneKey }) => {
  const [columnTitle, setColumnTitle] = useState('');
  
  const handleAddColumn = async() => {

    if (columnTitle.trim()) {
      addColumn(columnTitle);
      setColumnTitle('');
    }
  };

  return (
    <Card className="column" bodyStyle={{ padding: '16px' }}>
      <Input
        placeholder="Add Department"
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