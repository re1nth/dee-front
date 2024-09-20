// hooks/kanbanUtils.js
export const moveTask = (data, selectedScene, taskId, sourceColumnId, targetColumnId) => {
    const scene = data.scenes[selectedScene];
    const sourceColumn = scene.columns.find((col) => col.id === sourceColumnId);
    const targetColumn = scene.columns.find((col) => col.id === targetColumnId);
    const task = sourceColumn.tasks.find((task) => task.id === taskId);
  
    sourceColumn.tasks = sourceColumn.tasks.filter((task) => task.id !== taskId);
    targetColumn.tasks = [...targetColumn.tasks, task];
  
    return {
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
    };
  };
  
  export const addTask = (data, selectedScene, columnId, taskTitle) => {
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
  
    return {
      ...data,
      scenes: {
        ...data.scenes,
        [selectedScene]: {
          ...scene,
          columns: updatedColumns,
        },
      },
    };
  };
  
  export const addScene = (data) => {
    const newSceneId = Object.keys(data.scenes).length + 1;
    return {
      ...data,
      scenes: {
        ...data.scenes,
        [newSceneId]: {
          columns: [],
        },
      },
    };
  };
  
  export const addColumn = (data, selectedScene, title) => {
    const newColumn = {
      id: `column-${Date.now()}`,
      title,
      tasks: [],
    };
  
    const scene = data.scenes[selectedScene];
    return {
      ...data,
      scenes: {
        ...data.scenes,
        [selectedScene]: {
          ...scene,
          columns: [...scene.columns, newColumn],
        },
      },
    };
  };