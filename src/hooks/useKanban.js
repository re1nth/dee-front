// hooks/useKanban.js
import { useState } from 'react';

const initialData = {
  scenes: {
    1: {
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
    },
    2: {
      columns: [
        {
          id: 'column-1',
          title: 'Director',
          tasks: [],
        },
        {
          id: 'column-2',
          title: 'Cinematography',
          tasks: [],
        },
        {
          id: 'column-3',
          title: 'Art director',
          tasks: [],
        },
        {
          id: 'column-4',
          title: 'Direction department',
          tasks: [],
        },
      ],
    },
  },
};

const useKanban = () => {
  const [data, setData] = useState(initialData);
  const [selectedScene, setSelectedScene] = useState(1);

  const moveTask = (taskId, sourceColumnId, targetColumnId) => {
    const scene = data.scenes[selectedScene];
    const sourceColumn = scene.columns.find((col) => col.id === sourceColumnId);
    const targetColumn = scene.columns.find((col) => col.id === targetColumnId);
    const task = sourceColumn.tasks.find((task) => task.id === taskId);

    sourceColumn.tasks = sourceColumn.tasks.filter((task) => task.id !== taskId);
    targetColumn.tasks = [...targetColumn.tasks, task];

    setData({
      ...data,
      scenes: {
        ...data.scenes,
        [selectedScene]: {
          ...scene,
          columns: scene.columns.map((col) =>
            col.id === sourceColumnId ? sourceColumn : col.id === targetColumnId ? targetColumn : col
          ),
        },
      },
    });
  };

  const addTask = (columnId, taskTitle) => {
    const newTask = {
      id: `task-${Date.now()}`,
      title: taskTitle,
    };

    const scene = data.scenes[selectedScene];
    const updatedColumns = scene.columns.map((column) => {
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
      scenes: {
        ...data.scenes,
        [selectedScene]: {
          ...scene,
          columns: updatedColumns,
        },
      },
    });
  };

  const addColumn = (title) => {
    const newColumn = {
      id: `column-${Date.now()}`,
      title,
      tasks: [],
    };

    const scene = data.scenes[selectedScene];
    const updatedColumns = [...scene.columns, newColumn];

    setData({
      ...data,
      scenes: {
        ...data.scenes,
        [selectedScene]: {
          ...scene,
          columns: updatedColumns,
        },
      },
    });
  };

  const editColumnTitle = (columnId, newTitle) => {
    const scene = data.scenes[selectedScene];
    const updatedColumns = scene.columns.map((column) => {
      if (column.id === columnId) {
        return {
          ...column,
          title: newTitle,
        };
      }
      return column;
    });

    setData({
      ...data,
      scenes: {
        ...data.scenes,
        [selectedScene]: {
          ...scene,
          columns: updatedColumns,
        },
      },
    });
  };

  return { data, selectedScene, setSelectedScene, moveTask, addTask, addColumn, editColumnTitle };
};

export default useKanban;