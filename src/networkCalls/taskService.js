// taskService.js

import {makeApiCall} from './apiService';

// grouped tasks for a scene under a column
const listTasksForScene = async (authToken, projectId, sceneId) => {
  const url = 'http://localhost:9000/api/v1/tasks';
  const method = 'GET';
  const params = {
    project: projectId,
    milestone: sceneId,
  };
  const headers = {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${authToken}`,
  };

  try {
    const response = await makeApiCall(url, method, params, headers);

    console.log("Response from listing tasks for scene", response);

    const tasks = response.map(task => ({
      user_story: task.user_story,
      subject: task.subject,
      id: task.id,
      is_blocked: task.is_blocked,
      version: task.version
    }));

    const groupedTasks = tasks.reduce((acc, task) => {
      const { user_story, id, subject, is_blocked, version } = task;
      if (!acc[user_story]) {
        acc[user_story] = {
          id: user_story,
          tasks: []
        };
      }
      acc[user_story].tasks.push({ id, title: subject, isClosed: is_blocked, version: version }); 
      return acc;
    }, {});

    const formattedTasks = Object.values(groupedTasks);
    console.log("Formatted tasks here", formattedTasks);

    return formattedTasks;
  } catch (error) {
    console.error('Error listing tasks:', error);
    throw error;
  }
};

// create a task under a user story for a particular scene
const createTaskForColumn = async (authToken, projectId, sceneId, userStoryId, subject, isClosed ) => {
  const url = 'http://localhost:9000/api/v1/tasks';
  const method = 'POST';
  const headers = {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${authToken}`,
  };

  const body = {
    is_blocked: isClosed,
    milestone: sceneId,
    project: projectId,
    subject: subject,
    user_story: userStoryId
  };

  try {
    const response = await makeApiCall(url, method, {}, headers, body);
    const { id, subject, is_blocked, version } = response; // Extract id and name from response
    return { id, subject, is_blocked, version };
  } catch (error) {
    console.error('Error creating task:', error);
    throw error;
  }
};

// edit a task under a user story for a particular scene
const editTaskForColumn = async (authToken, taskId, subject, isClosed, version) => {
  const url = `http://localhost:9000/api/v1/tasks/${taskId}`;
  const method = 'PATCH';
  const headers = {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${authToken}`,
  };

  const body = {
    subject: subject,
    is_blocked: isClosed,
    version: version,
  };

  try {
    const { id, subject, is_blocked, version } = await makeApiCall(url, method, {}, headers, body);
    return { id, subject, is_blocked, version };
  } catch (error) {
    console.error('Error editing task:', error);
    throw error;
  }
};

// delete a task
const deleteTask = async (authToken, taskId) => {
  const url = `http://localhost:9000/api/v1/tasks/${taskId}`;
  const method = 'DELETE';
  const headers = {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${authToken}`,
  };

  try {
    await makeApiCall(url, method, {}, headers, {});
  } catch (error) {
    console.error('Error deleting task:', error);
    throw error;
  }
};

export { listTasksForScene, createTaskForColumn, deleteTask, editTaskForColumn};