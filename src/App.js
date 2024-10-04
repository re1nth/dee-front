import React, {useContext, useEffect} from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Cookies from 'js-cookie';
import AuthPage from './pages/AuthPage';
import ProjectsPage from './pages/ProjectsPage';
import TaskboardPage from './pages/TaskboardPage';
import TeamPage from './pages/TeamPage';
import NotFoundPage from './pages/NotFoundPage'; // Import the NotFoundPage component
import { AuthContext } from './AuthContext';

const App = () => {

  const { authToken, setAuthToken } = useContext(AuthContext);

  useEffect(() => {
    const token = Cookies.get('authToken');
    if (token) {
      setAuthToken(token);
    }
  }, [setAuthToken]);

  return (
    <Router>
      <Routes>
        {authToken ? (
          console.log("Hello authToken is not null"),
          <>
            <Route path="/projects" element={<ProjectsPage />} />
            <Route path="/projects/:projectId/Taskboard" element={<TaskboardPage />} />
            <Route path="/team" element={<TeamPage />} />
            <Route path="/" element={<AuthPage />} />
          </>
        ) : (
          <>
          <Route path="*" element={<NotFoundPage />} />
          <Route path="/" element={<AuthPage />} />
          </>
        )}
      </Routes>
    </Router>
  );
};

export default App;