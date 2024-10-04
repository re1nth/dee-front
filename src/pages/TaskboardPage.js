import React, { useEffect, useContext, useMemo } from 'react';
import { useParams } from 'react-router-dom'; 
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { Layout, Row, Col } from 'antd';
import Column from '../components/Column';
import Sidebar from '../components/Sidebar';
import AddColumn from '../components/AddColumn';
import useKanban from '../hooks/useKanban';
import { AuthContext } from '../AuthContext';
import '../App.css';
import { listUserStories } from '../networkCalls/userStoryService';
import { listTasksForScene } from '../networkCalls/taskService';

const { Sider, Content } = Layout;

const TaskboardPage = () => {
  const { projectId } = useParams(); // Extract projectId from URL parameters
  
  const { data, setData, selectedScene, setSelectedScene, selectedSceneKey, setSelectedSceneKey, moveTask, addTask, editTask, addColumn, editColumnTitle } = useKanban(projectId);
  const { authToken, setAuthToken } = useContext(AuthContext);

  // Memoize data.scenes to prevent unnecessary re-renders
  const memoizedScenes = useMemo(() => data.scenes, [data.scenes]);

  useEffect(() => {
    const authenticateUser = async () => {
      console.log("Hello authenticateUser entered");
    };

    authenticateUser();
  }, [setAuthToken]);

  useEffect(() => {
    console.log("Hello useEffect coming with selectedSceneKey", selectedSceneKey);

    if (selectedSceneKey !== null && authToken) {
      console.log("Entering useEffect coming with selectedSceneKey", selectedSceneKey);

      const fetchColumns = async () => {
        try {
          
          // list all the user stories for the selected scene
          const response = await listUserStories(authToken, projectId, selectedSceneKey);

          // list all the tasks under each user story
          const groupedTasksForScene = await listTasksForScene(authToken, projectId, selectedSceneKey);
          console.log("Tasks for the scene", groupedTasksForScene);

          const columns = Array.isArray(response) ? response : [response];

          const updatedColumns = columns.map(column => {
            const matchingGroup = groupedTasksForScene.find(group => group.id === column.id);
            return {
              id: column.id,
              title: column.subject,
              version : column.version,
              tasks: matchingGroup ? matchingGroup.tasks : [],
            };
          });

          setData(prevData => ({
            ...prevData,
            scenes: {
              ...prevData.scenes,
              [selectedScene]: {
                ...prevData.scenes[selectedScene],
                columns: updatedColumns,
              },
            },
          }));
        } catch (error) {
          console.error('Error fetching user stories:', error);
        }
      };

      fetchColumns();
    }
    console.log("Done useEffect coming with selectedSceneKey");

  }, [selectedScene, selectedSceneKey, authToken, setData, projectId]);

  const renderColumns = () => {
    console.log("Rendering columns for the scene", selectedScene);
    if (memoizedScenes && selectedScene !== null && memoizedScenes[selectedScene]?.columns) {
      return memoizedScenes[selectedScene].columns.map((column) => (
        <Col span={6} key={column.id}>
          <Column column={column} moveTask={moveTask} addTask={addTask} editTask = {editTask} editColumnTitle={editColumnTitle} authToken ={authToken} selectedSceneKey={selectedSceneKey}/>
        </Col>
      ));
    } else {
      return (
        <Col span={24}>
          <div>No columns available</div>
        </Col>
      );
    }
  };

  return (
    <Layout style={{ height: '100vh' }}>
      <Sider width={200} className="site-layout-background">
        <Sidebar projectId = {projectId} scenes={memoizedScenes || {}} selectedScene={selectedScene || 0} setSelectedScene={setSelectedScene} setSelectedSceneKey={setSelectedSceneKey} />
      </Sider>
      <Layout style={{ padding: '0 24px 24px' }}>
        <Content style={{ padding: 24, margin: 0, minHeight: 280 }}>
          <DndProvider backend={HTML5Backend}>
            <Row gutter={16} className="board">
              {renderColumns()}
              <Col span={6}>
                <AddColumn addColumn={addColumn} authToken = {authToken} selectedSceneKey = {selectedSceneKey}/>
              </Col>
            </Row>
          </DndProvider>
        </Content>
      </Layout>
    </Layout>
  );
};

export default TaskboardPage;
