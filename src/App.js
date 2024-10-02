import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import AuthPage from './pages/AuthPage';
import HomePage from './pages/HomePage';
import ProjectsPage from './pages/ProjectsPage';
import TaskboardPage from './pages/TaskboardPage';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<AuthPage />} />
        <Route path="/home" element={<HomePage />} />
        <Route path="/projects" element={<ProjectsPage />} />
        <Route path="/projects/:projectId/Taskboard" element={<TaskboardPage />} />
      </Routes>
    </Router>
  );
};

export default App;