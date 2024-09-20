// hooks/initialData.js
const initialData = {
    scenes: {
      1: {
        columns: [
          {
            id: 'column-1',
            title: 'Director',
            tasks: [
              { id: 'task-1', title: 'Task 1' },
              { id: 'task-2', title: 'Task 2' },
            ],
          },
          {
            id: 'column-2',
            title: 'Cinematography',
            tasks: [],
          },
          {
            id: 'column-3',
            title: 'Art director',
            tasks: [{ id: 'task-3', title: 'Task 3' }],
          },
          {
            id: 'column-4',
            title: 'Direction department',
            tasks: [],
          },
        ],
      },
      2: {
        columns: [
          {
            id: 'column-1',
            title: 'Director',
            tasks: [],
          },
          {
            id: 'column-2',
            title: 'Cinematography',
            tasks: [],
          },
          {
            id: 'column-3',
            title: 'Art director',
            tasks: [],
          },
          {
            id: 'column-4',
            title: 'Direction department',
            tasks: [],
          },
        ],
      },
    },
  };
  
  export default initialData;