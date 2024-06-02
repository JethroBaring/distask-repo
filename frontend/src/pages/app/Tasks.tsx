/* eslint-disable @typescript-eslint/no-unused-vars */
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
import { DragDropContext, Draggable, Droppable } from 'react-beautiful-dnd';
import { useEffect, useState } from 'react';
import Card from '../../components/Card';
import { useParams } from 'react-router-dom';
import { useLocalStorage } from '../../hooks/useLocalStorage';

export const Tasks = () => {
  const [user, setUser] = useState('');
  const [selectedTask, setSelectedTask] = useState({});
  const [tasks, setTasks] = useState([
    {
      id: '1',
      title: ' 📃 To do',
      tasks: [],
    },
    {
      id: '2',
      title: ' ✏️ In progress',
      tasks: [],
    },
    {
      id: '3',
      title: ' ✔️ Completed',
      tasks: [],
    },
  ]);

  const { getItem } = useLocalStorage();
  const { id } = useParams();

  useEffect(() => {
    const user = getItem('user');
    if (user) {
      setUser(JSON.parse(user));
    }
  }, []);


  const onDragEnd = async (result) => {
    if (!result.destination) return;
    const { source, destination } = result;

    if (source.droppableId !== destination.droppableId) {
      const sourceColIndex = tasks.findIndex(
        (e) => e.id === source.droppableId
      );
      const destinationColIndex = tasks.findIndex(
        (e) => e.id === destination.droppableId
      );

      const sourceCol = tasks[sourceColIndex];
      const destinationCol = tasks[destinationColIndex];

      const sourceTask = [...sourceCol.tasks];
      const destinationTask = [...destinationCol.tasks];

      const [removed] = sourceTask.splice(source.index, 1);

      destinationTask.splice(destination.index, 0, removed);
      tasks[sourceColIndex].tasks = sourceTask;
      tasks[destinationColIndex].tasks = destinationTask;

      setTasks(tasks);
      let status = 'PENDING';
      if (tasks[destinationColIndex].title.includes('In progress')) {
        status = 'IN_PROGRESS';
      } else if (tasks[destinationColIndex].title.includes('Completed')) {
        status = 'COMPLETED';
      }

      const response = await fetch(`http://localhost:3000/task/${removed.id}`, {
        method: 'PATCH',
        headers: {
          'Content-type': 'application/json',
          Authorization: `Bearer ${user.accessToken}`,
        },
        body: JSON.stringify({
          status: status,
        }),
      });

    } else {
      const sourceColIndex = tasks.findIndex(
        (e) => e.id === source.droppableId
      );
      const sourceCol = tasks[sourceColIndex];

      const [removed] = sourceCol.tasks.splice(source.index, 1);

      sourceCol.tasks.splice(destination.index, 0, removed);
      setTasks([...tasks]);
    }
  };

  async function deleteTask(taskId: number) {
    const response = await fetch(`http://localhost:3000/task/${taskId}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${user.accessToken}`,
      },
    });

    if (response.ok) {
      window.location.href = `/tasks/${id}`;
    }
  }

  async function createTask() {
    const response = await fetch('http://localhost:3000/task/', {
      method: 'POST',
      headers: {
        'Content-type': 'application/json',
        Authorization: `Bearer ${user.accessToken}`,
      },
      body: JSON.stringify({
        userId: user.id,
        groupId: Number.parseInt(id),
        title: selectedTask.title,
        description: selectedTask.description,
        status: selectedTask.status,
      }),
    });

    const data = await response.json();
    if (response.ok) {
      window.location.href = `/tasks/${id}`;
    }
    console.log(response);
  }

  async function updateTask() {
    const response = await fetch(`http://localhost:3000/task/${selectedTask.id}`, {
      method: 'PATCH',
      headers: {
        'Content-type': 'application/json',
        Authorization: `Bearer ${user.accessToken}`,
      },
      body: JSON.stringify({
        title: selectedTask.title,
        description: selectedTask.description,
      }),
    });

    if (response.ok) {
      window.location.href = `/tasks/${id}`;
    }
  }



  useEffect(() => {
    async function getTasks() {
      const response = await fetch(`http://localhost:3000/tasks/${id}`, {
        method: 'get',
        headers: {
          Authorization: `Bearer ${user.accessToken}`,
        },
      });

      const data = await response.json();
      if (response.ok) {
        const newTasks = tasks.map((column) => ({
          ...column,
          tasks: data.filter((task) => {
            if (column.title.includes('To do'))
              return task.status === 'PENDING';
            if (column.title.includes('In progress'))
              return task.status === 'IN_PROGRESS';
            if (column.title.includes('Completed'))
              return task.status === 'COMPLETED';
            return false;
          }),
        }));
        setTasks(newTasks);
      }
    }
    if (user) {
      getTasks();
    }
  }, [id, user]);


  useEffect(() => {
    function onTaskChange(data) {
      setTasks((prevTasks) => {
        const updatedTasks = prevTasks.map((column) => {
          if (column.id === data.sourceColId) {
            return {
              ...column,
              tasks: column.tasks.filter((task) => task.id !== data.task.id),
            };
          }
          if (column.id === data.destinationColId) {
            return {
              ...column,
              tasks: [...column.tasks, data.task],
            };
          }
          return column;
        });
        return updatedTasks;
      });
    }
  }, [id]);

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div className='flex gap-6 h-full pl-6 pr-6 pb-6'>
        {tasks.map((section) => (
          <Droppable key={`${section.id}`} droppableId={`${section.id}`}>
            {(provided) => (
              <div
                {...provided.droppableProps}
                className='flex-1 flex flex-col gap-3 rounded-lg'
                ref={provided.innerRef}
              >
                <div className='flex gap-3'>
                  <div>{section.title}</div>
                  <button
                    onClick={() => {
                      let s = 'PENDING';
                    if (section.title.includes('In progress')) {
                      s = 'IN_PROGRESS';
                    } else if (section.title.includes('Completed')) {
                      s = 'COMPLETED';
                    }

                      setSelectedTask({status: s});

                      document.getElementById('my_modal_2').showModal();
                    }}
                  >
                    +
                  </button>
                </div>
                <div className='flex flex-col gap-3'>
                  {section.tasks.map((task, index) => (
                    <Draggable
                      key={`${task.id}`}
                      draggableId={`${task.id}`}
                      index={index}
                    >
                      {
                      (provided, snapshot) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          style={{
                            ...provided.draggableProps.style,
                            opacity: snapshot.isDragging ? '0.5' : '1',
                          }}
                        >
                          <Card>
                            <div className='flex flex-col'>
                              <div className='text-lg font-semibold'>
                                {task.title}
                              </div>
                              <div>{task.description}</div>
                            </div>
                            <div className='flex justify-between'>
                              <div className='flex gap-2 items-center'>
                                <div className='w-8 rounded-full bg-slate-300 h-8 flex justify-center items-center'>
                                  {task.user.email.charAt(0).toUpperCase()}
                                  {task.user.email.charAt(1)}
                                </div>
                                <div className='text-sm'>{task.user.email}</div>
                              </div>
                              <div className='flex gap-2'>
                                <button
                                  onClick={() => {
                                    setSelectedTask(task);
                                    document.getElementById('update_task').showModal()
                                  }}
                                >
                                  <svg
                                    xmlns='http://www.w3.org/2000/svg'
                                    fill='none'
                                    viewBox='0 0 24 24'
                                    strokeWidth={1.5}
                                    stroke='currentColor'
                                    className='size-6'
                                  >
                                    <path
                                      strokeLinecap='round'
                                      strokeLinejoin='round'
                                      d='m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10'
                                    />
                                  </svg>
                                </button>
                                <button onClick={() => deleteTask(task.id)}>
                                  <svg
                                    xmlns='http://www.w3.org/2000/svg'
                                    fill='none'
                                    viewBox='0 0 24 24'
                                    strokeWidth={1.5}
                                    stroke='currentColor'
                                    className='size-6'
                                  >
                                    <path
                                      strokeLinecap='round'
                                      strokeLinejoin='round'
                                      d='m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0'
                                    />
                                  </svg>
                                </button>
                              </div>
                            </div>
                          </Card>
                        </div>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
              </div>
            )}
          </Droppable>
        ))}
      </div>
      <dialog id='my_modal_2' className='modal'>
        <div className='modal-box flex items-center flex-col gap-3 w-[400px]'>
          <h3 className='font-bold text-lg'>Enter task information</h3>
          <input
            type='text'
            placeholder='Type the title here'
            className='input input-bordered w-full'
            value={selectedTask?.title || ''}
            onChange={(e) =>  setSelectedTask(prevTask => ({
              ...prevTask,
              title: e.target.value,
            }))}
          />
          <textarea
            placeholder='Type the description here'
            className='input input-bordered w-full h-32'
            value={selectedTask?.description || ''}
            onChange={(e) => setSelectedTask(prevTask => ({
              ...prevTask,
              description: e.target.value,
            }))}
          />
          <button className='btn btn-primary w-full' onClick={createTask}>
            Add
          </button>
        </div>
        <form method='dialog' className='modal-backdrop'>
          <button>close</button>
        </form>
      </dialog>
      {/* Mao ni paras update */}
      <dialog id='update_task' className='modal'>
        <div className='modal-box flex items-center flex-col gap-3 w-[400px]'>
          <h3 className='font-bold text-lg'>Update task information</h3>
          <input
            type='text'
            className='input input-bordered w-full'
            value={selectedTask?.title || ''}
            onChange={(e) =>  setSelectedTask(prevTask => ({
              ...prevTask,
              title: e.target.value,
            }))}
          />
          <textarea
            className='input input-bordered w-full h-32'
            value={selectedTask?.description || ''}
            onChange={(e) => setSelectedTask(prevTask => ({
              ...prevTask,
              description: e.target.value,
            }))}
          />
          <button className='btn btn-primary w-full' onClick={updateTask}>
            Update
          </button>
        </div>
        <form method='dialog' className='modal-backdrop'>
          <button>close</button>
        </form>
      </dialog>
    </DragDropContext>
  );
};
