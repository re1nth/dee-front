// hooks/useKanban.js
import { useState, useEffect, useContext } from 'react';
import {listScenesForProject} from '../networkCalls/sceneService'; // Import the listScenesForProject method
import { AuthContext } from '../AuthContext'; // Import the AuthContext
import { createUserStory, modifyUserStoryTitle } from '../networkCalls/userStoryService';
import { createTaskForColumn, deleteTask, editTaskForColumn } from '../networkCalls/taskService';

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

  // This refers to the index of the selected scene in the sidebar
  const [selectedScene, setSelectedScene] = useState(0);

  // This refers to the key of the selected scene in the sidebar
  const [selectedSceneKey, setSelectedSceneKey] = useState(null);

  // Use the AuthContext to get the authToken
  const { authToken } = useContext(AuthContext); 

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
        setSelectedSceneKey(scenesData[initialSceneKey].id);
      } catch (error) {
        console.error('Error fetching scenes:', error);
      }
    };

    if (authToken) {
      fetchAndSetScenes();
    }
  }, [authToken]);

  const moveTask = async (taskId, sourceColumnId, targetColumnId) => {
    const scene = data.scenes[selectedScene];
    const sourceColumn = scene.columns.find((col) => col.id === sourceColumnId);
    const targetColumn = scene.columns.find((col) => col.id === targetColumnId);
    const task = sourceColumn.tasks.find((task) => task.id === taskId);

    sourceColumn.tasks = sourceColumn.tasks.filter((task) => task.id !== taskId);

    // Delete the task from one user story
    deleteTask(authToken, taskId);

    // Create a task for another user story
    const { id, subject, is_blocked, version } = await createTaskForColumn(authToken, 1, selectedSceneKey, targetColumnId, task.title, task.isClosed);
    console.log('Created task:', { id, subject, is_blocked, version });

    // Change the properties before it will be added to the target column
    task.id = id;
    task.subject = subject;
    task.is_blocked = is_blocked;
    task.version = version;
    
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

  const addTask = async (columnId, taskTitle) => {
    // Create a task for a column under the selected scene
    const response = await createTaskForColumn(authToken, 1, selectedSceneKey, columnId, taskTitle, false);

    console.log("Response from creating task:", response);

    const newTask = {
      id: response.id,
      title: response.subject,
      isClosed: response.is_blocked,
      version: response.version,
    };

    console.log('Adding task:', newTask);

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

  const editTask = async (taskId, columnId, newTitle, isClosed, version) => {
    // Create a task for a column under the selected scene
    const response = await editTaskForColumn(authToken, taskId, newTitle, isClosed, version);
    console.log("Response from editing task:", response);

    const newTask = {
      id: response.id,
      title: response.subject,
      isClosed: response.is_blocked,
      version: response.version,
    };

    console.log('Adding task:', newTask);

    const scene = data.scenes[selectedScene];
    const updatedColumns = scene.columns.map((column) => {
      if (column.id === columnId) {
        return {
          ...column,
          tasks: column.tasks.map(task => 
            task.id === taskId ? { ...task, ...newTask } : task
          )
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

  const addColumn = async (title) => {
    console.log('Entered addColumn with', title);

    const response = await createUserStory(authToken, 1, selectedSceneKey, title);
  
    // Extract properties inline
    const { subject, id, version } = response;
    console.log('Response from creating user story:', { subject, id, version });
  
    const newColumn = {
      id: id,
      title: subject,
      version: version,
      tasks: [],
    };

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

  const editColumnTitle = (columnId, columnVersion, newTitle) => {
    const scene = data.scenes[selectedScene];

    // Edit the existing user story with the new title
    modifyUserStoryTitle(authToken, columnId, newTitle, columnVersion);

    // If the patch request is successful, version number will increment by 1
    const updatedColumns = scene.columns.map((column) => {
      if (column.id === columnId) {
        return {
          ...column,
          title: newTitle,
          version: columnVersion+1,
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

  return { data, setData, selectedScene, setSelectedScene, selectedSceneKey, setSelectedSceneKey, moveTask, addTask, editTask, addColumn, editColumnTitle };
};

export default useKanban;