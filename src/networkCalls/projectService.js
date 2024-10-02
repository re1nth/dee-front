// projectService.js

import { makeApiCall } from './apiService';

const listProjects = async (authToken) => {
  const url = 'http://localhost:9000/api/v1/projects';
  const method = 'GET';
  const headers = {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${authToken}`,
  };

  try {
    const response = await makeApiCall(url, method, {}, headers);
    
    console.log('listProjects Response:', response);

    const projects = response.map(project => ({
      id: project.id,
      name: project.name,
      description: project.description,
    }));

    return projects;
  } catch (error) {
    console.error('Error fetching projects:', error);
    throw error;
  }
};

const createProject = async (authToken, name, description) => {
    const url = 'http://localhost:9000/api/v1/projects';
    const method = 'POST';
    const headers = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${authToken}`,
    };

    const body = {
        description: description,
        name: name
      };
  
    try {
      const response = await makeApiCall(url, method, {}, headers, body);
      
      console.log('createProject Response:', response);
  
      return response;
    } catch (error) {
      console.error('Error creating project:', error);
      throw error;
    }
  };
  
const editProject = async (authToken, projectId, name, description) => {
  const url = `http://localhost:9000/api/v1/projects/${projectId}`;
  const method = 'PUT';
  const headers = {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${authToken}`,
  };

  const body = {
    description: description,
    name: name
  };

  try {
    const response = await makeApiCall(url, method, {}, headers, body);
    
    console.log('editProject Response:', response);

    return response;
  } catch (error) {
    console.error('Error editing project:', error);
    throw error;
  }
};

export { listProjects, createProject, editProject };