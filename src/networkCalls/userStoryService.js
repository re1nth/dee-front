// userStoryService.js

import makeApiCall from './apiService';

const listUserStories = async (authToken, projectId, milestoneId) => {
  const url = 'http://localhost:9000/api/v1/userstories';
  const method = 'GET';
  const params = {
    project: projectId,
    milestone: milestoneId,
  };
  const headers = {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${authToken}`,
  };

  try {
    const response = await makeApiCall(url, method, params, headers);

    const userStories = response
    .map(userStory => ({ id: userStory.id, subject: userStory.subject })); // Extract the id and name from each scene

    return userStories;
  } catch (error) {
    console.error('Error listing user stories:', error);
    throw error;
  }
};

const createUserStory = async (authToken, projectId, milestoneId, subject) => {
  const url = 'http://localhost:9000/api/v1/userstories';
  const method = 'POST';
  const body = {
    project: projectId,
    milestone: milestoneId,
    subject: subject,
  };

  const headers = {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${authToken}`,
  };

  try {
    console.log("Creating user story with body", body);
    const response = await makeApiCall(url, method, null, headers, body);
    return response;
  } catch (error) {
    console.error('Error creating user story:', error);
    throw error;
  }
};

export { listUserStories, createUserStory };