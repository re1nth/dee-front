// hooks/useKanban.js
import { useState } from 'react';

const initialData = {
  columns: [
    {
      id: 'column-1',
      title: 'Director',
      tasks: [
        { id: 'task-1', title: 'Task 1' },
        { id: 'task-2', title: 'Task 2' },
      ],
    },
    {
      id: 'column-2',
      title: 'Cinematography',
      tasks: [],
    },
    {
      id: 'column-3',
      title: 'Art director',
      tasks: [{ id: 'task-3', title: 'Task 3' }],
    },
    {
      id: 'column-4',
      title: 'Direction department',
      tasks: [],
    },
  ],
};

const useKanban = () => {
  const [data, setData] = useState(initialData);

  const moveTask = (taskId, sourceColumnId, targetColumnId) => {
    const sourceColumn = data.columns.find((col) => col.id === sourceColumnId);
    const targetColumn = data.columns.find((col) => col.id === targetColumnId);
    const task = sourceColumn.tasks.find((task) => task.id === taskId);

    sourceColumn.tasks = sourceColumn.tasks.filter((task) => task.id !== taskId);
    targetColumn.tasks = [...targetColumn.tasks, task];

    setData({
      ...data,
      columns: data.columns.map((col) =>
        col.id === sourceColumnId ? sourceColumn : col.id === targetColumnId ? targetColumn : col
      ),
    });
  };

  const addTask = (columnId, taskTitle) => {
    const newTask = {
      id: `task-${Date.now()}`,
      title: taskTitle,
    };

    const updatedColumns = data.columns.map((column) => {
      if (column.id === columnId) {
        return {
          ...column,
          tasks: [...column.tasks, newTask],
        };
      }
      return column;
    });

    setData({
      ...data,
      columns: updatedColumns,
    });
  };

  return { data, moveTask, addTask };
};

export default useKanban;