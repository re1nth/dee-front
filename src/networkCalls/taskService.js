// taskService.js

import makeApiCall from './apiService';

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

    const tasks = response.map(task => ({
      user_story: task.user_story,
      subject: task.subject,
      id: task.id
    }));

    const groupedTasks = tasks.reduce((acc, task) => {
      const { user_story, id, subject } = task;
      if (!acc[user_story]) {
        acc[user_story] = {
          id: user_story,
          tasks: []
        };
      }
      acc[user_story].tasks.push({ id, title: subject });
      return acc;
    }, {});

    const formattedTasks = Object.values(groupedTasks);

    return formattedTasks;
  } catch (error) {
    console.error('Error listing tasks:', error);
    throw error;
  }
};

export { listTasksForScene };