import React, { useEffect, useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, Row, Col } from 'antd';
import { listProjects } from '../networkCalls/projectService';
import { AuthContext } from '../AuthContext';
import loginUser from '../networkCalls/authService';
import '../ProjectsPage.css';

const { Meta } = Card;

const ProjectsPage = () => {
  const [projects, setProjects] = useState([]);
  const { authToken, setAuthToken } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    const authenticateUser = async () => {
      console.log("Hello authenticateUser entered");
      try {
        const response = await loginUser('test-username', 'password');
        console.log('Username:', response.username);
        console.log('Auth Token:', response.auth_token);
        setAuthToken(response.auth_token);
      } catch (error) {
        console.error('Error logging in:', error);
      }
    };

    authenticateUser();
  }, [setAuthToken]);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        console.log("Trying to fetch projects");
        const projectsList = await listProjects(authToken);
        setProjects(projectsList);
      } catch (error) {
        console.error('Error fetching projects:', error);
      }
    };

    if (authToken) {
      fetchProjects();
    } else {
      console.log("No auth token found in ProjectsPage");
    }

  }, [authToken]);

  const handleCardClick = (projectId) => {
    navigate(`/projects/${projectId}/Taskboard`);
  };

  return (
    <div className="page-container">
      <h1 className="page-title">Welcome to Dee-Day</h1>
      <button
        className="add-project-button"
      >
        Add Project
      </button>
      <Row gutter={[16, 16]} wrap={false}>
        {projects.map(project => (
          <Col key={project.id} flex="0 0 auto">
            <Card
              hoverable
              className="card"
              bodyStyle={{
                padding: '15px', // Reduced padding
              }}
              onClick={() => handleCardClick(project.id)}
            >
              <Meta title={project.name} description={project.description} />
            </Card>
          </Col>
        ))}
      </Row>
    </div>
  );
};

export default ProjectsPage;