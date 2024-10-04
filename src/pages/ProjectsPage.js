import React, { useEffect, useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, Row, Col, Modal, Input, Button, Form } from 'antd';
import { EditOutlined } from '@ant-design/icons';
import { listProjects, createProject, editProject } from '../networkCalls/projectService';
import { AuthContext } from '../AuthContext';
import '../ProjectsPage.css';

const { Meta } = Card;

const ProjectsPage = () => {
  const [projects, setProjects] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [editingProject, setEditingProject] = useState(null);
  const [form] = Form.useForm();
  const [editForm] = Form.useForm();
  const { authToken, setAuthToken } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    const authenticateUser = async () => {
      console.log("Hello authenticateUser entered");
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

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    form.resetFields();
  };

  const handleSave = async () => {
    try {
      const values = await form.validateFields();
      const description = values.description || ''; // Handle null or undefined description
      const newProject = await createProject(authToken, values.name, description);
      setProjects(prevProjects => [...prevProjects, newProject]);
      setIsModalVisible(false);
      form.resetFields();
    } catch (error) {
      console.error('Error creating project:', error);
    }
  };

  const showEditModal = (project) => {
    setEditingProject(project);
    editForm.setFieldsValue({
      name: project.name,
      description: project.description,
    });
    setIsEditModalVisible(true);
  };

  const handleEditCancel = () => {
    setIsEditModalVisible(false);
    editForm.resetFields();
  };

  const handleEditSave = async () => {
    try {
      const values = await editForm.validateFields();
      const description = values.description || ''; // Handle null or undefined description
      await editProject(authToken, editingProject.id, values.name, description);
      setProjects(prevProjects =>
        prevProjects.map(project =>
          project.id === editingProject.id
            ? { ...project, name: values.name, description: description }
            : project
        )
      );
      setIsEditModalVisible(false);
      editForm.resetFields();
    } catch (error) {
      console.error('Error editing project:', error);
    }
  };

  return (
    <div className="page-container">
      <h1 className="page-title">Welcome to Dee-Day</h1>
      <button
        className="add-project-button"
        onClick={showModal}
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
              <div className="edit-icon" onClick={(e) => { e.stopPropagation(); showEditModal(project); }}>
                <EditOutlined />
              </div>
              <Meta title={project.name} description={project.description} />
            </Card>
          </Col>
        ))}
      </Row>
      <Modal
        title="Create New Project"
        visible={isModalVisible}
        onCancel={handleCancel}
        footer={[
          <Button key="cancel" onClick={handleCancel}>
            Cancel
          </Button>,
          <Button key="save" type="primary" onClick={handleSave}>
            Save
          </Button>,
        ]}
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="name"
            label="Project Name"
            rules={[{ required: true, message: 'Please enter the project name' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="description"
            label="Project Description"
          >
            <Input.TextArea />
          </Form.Item>
        </Form>
      </Modal>
      <Modal
        title="Edit Project"
        visible={isEditModalVisible}
        onCancel={handleEditCancel}
        footer={[
          <Button key="cancel" onClick={handleEditCancel}>
            Cancel
          </Button>,
          <Button key="save" type="primary" onClick={handleEditSave}>
            Save
          </Button>,
        ]}
      >
        <Form form={editForm} layout="vertical">
          <Form.Item
            name="name"
            label="Project Name"
            rules={[{ required: true, message: 'Please enter the project name' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="description"
            label="Project Description"
          >
            <Input.TextArea />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default ProjectsPage;