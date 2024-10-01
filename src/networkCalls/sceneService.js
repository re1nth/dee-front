// sceneService.js

import {makeApiCall} from './apiService';

const listScenesForProject = async (projectId, authToken) => {
  const url = 'http://localhost:9000/api/v1/milestones'; // Assuming the URL is correct
  console.log("Project ID:", projectId);
  const params = { project: projectId };
  const method = 'GET';
  const headers = {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${authToken}`,
  };

  try {
    const response = await makeApiCall(url, method, params, headers);
    
    const scenes = response
    .sort((a, b) => a.name.localeCompare(b.name)) // Sort scenes by name
    .map(scene => ({ id: scene.id, name: scene.name })); // Extract the id and name from each scene

    return scenes;
  } catch (error) {
    console.error('Error fetching milestones:', error);
    throw error;
  }
};

const createSceneForProject = async (projectId, sceneName, authToken) => {
  const url = 'http://localhost:9000/api/v1/milestones';
  const method = 'POST';
  const headers = {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${authToken}`,
  };

  // Get current date and time
  const now = new Date();
  const estimatedStart = now.toISOString().split('T')[0]; // Format as YYYY-MM-DD
  const estimatedFinish = new Date(now.getTime() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]; // 14 days later

  const body = {
    name : sceneName,
    project: projectId,
    estimated_finish: estimatedFinish,
    estimated_start: estimatedStart,
  };

  try {
    //url, method = 'GET', params = {}, headers = {}, body = null
    const response = await makeApiCall(url, method, {}, headers, body);

    console.log('createSceneForProject Response:', response);

    const { id, name } = response; // Extract id and name from response
    console.log('Created Scene:', { id, name });
    return { id, name }; // Return the extracted id and name
  } catch (error) {
    console.error('Error creating scene:', error);
    throw error;
  }
};

export { listScenesForProject, createSceneForProject };