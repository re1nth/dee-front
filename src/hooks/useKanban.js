// hooks/useKanban.js
import { useState, useEffect, useContext } from 'react';
import {listScenesForProject} from '../networkCalls/sceneService'; // Import the listScenesForProject method
import { AuthContext } from '../AuthContext'; // Import the AuthContext

const createInitialData = (scenesData) => {
  const scenes = {};

  for (let index = 0; index < scenesData.length; index++) {
    const { id, name } = scenesData[index];
    scenes[index] = {
      key: id,
      name: name,
      columns: [],
    };
  }

  return { scenes };
};

const useKanban = () => {
  const initialData = createInitialData([]);
  const [data, setData] = useState(initialData);
  const [selectedScene, setSelectedScene] = useState(0);
  const { authToken } = useContext(AuthContext); // Use the AuthContext to get the authToken

  useEffect(() => {
    const fetchAndSetScenes = async () => {
      try {
        // Fetch scenes data and set the initial data
        const scenesData = await listScenesForProject(1, authToken);

        const initialData = createInitialData(scenesData);
        setData(initialData);
        
        //point the selection scene appropriately
        const initialSceneKey = scenesData.length > 0 ? 0 : null;
        setSelectedScene(initialSceneKey);
      } catch (error) {
        console.error('Error fetching scenes:', error);
      }
    };

    if (authToken) {
      fetchAndSetScenes();
    }
  }, [authToken]);

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
    console.log('Entered addColumn sdsdsd', title);

    const newColumn = {
      id: `column-${Date.now()}`,
      title,
      tasks: [],
    };

    console.log("Selected scene : ", selectedScene);

    const scene = data.scenes[selectedScene];
    
    if (scene.columns.length === 0) {
      console.log('No columns available');
    } else {
      console.log('Columns are available', scene.columns);
    }

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