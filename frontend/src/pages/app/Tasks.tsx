/* eslint-disable @typescript-eslint/no-unused-vars */
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
import { DragDropContext, Draggable, Droppable } from 'react-beautiful-dnd';
import { useEffect, useState } from 'react';
import Card from '../../components/Card';
import { useParams } from 'react-router-dom';
import { useLocalStorage } from '../../hooks/useLocalStorage';
import { socket } from '../../socket';
export const Tasks = () => {
  const [user, setUser] = useState('');
  const [newTaskStatus, setNewTaskStatus] = useState('To do');
  const [isConnected, setIsConnected] = useState(socket.connected);
  const { getItem } = useLocalStorage();

  useEffect(() => {
    const user = getItem('user');
    if (user) {
      setUser(JSON.parse(user));
    }
  }, []);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
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
  const { id } = useParams();
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
      console.log(removed);
      console.log(tasks[destinationColIndex].title);
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

      if (response.ok) {
        console.log('success');
      }
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

  async function createTask() {
    let s = 'PENDING';
    if (newTaskStatus.includes('In progress')) {
      s = 'IN_PROGRESS';
    } else if (newTaskStatus.includes('Completed')) {
      s = 'COMPLETED';
    }

    const response = await fetch('http://localhost:3000/task/', {
      method: 'POST',
      headers: {
        'Content-type': 'application/json',
        Authorization: `Bearer ${user.accessToken}`,
      },
      body: JSON.stringify({
        userId: user.id,
        groupId: Number.parseInt(id),
        title: title,
        description: description,
        status: s,
      }),
    });

    const data = await response.json();
    if (response.ok) {
      console.log(data);
    }
    console.log(response);
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
      console.log(data);
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
        console.log(newTasks);
      }
    }

    getTasks();
  }, [id, user]);

  useEffect(() => {
    function onConnect() {
      setIsConnected(true);
      socket.emit('joinBoard', id);
    }

    function onDisconnect() {
      setIsConnected(false);
      socket.emit('leaveBoard', id);
    }

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

    socket.on('connect', onConnect);
    socket.on('disconnect', onDisconnect);
    socket.on('onTaskChange', onTaskChange);

    return () => {
      socket.off('connect', onConnect);
      socket.off('disconnect', onDisconnect);
      socket.off('receivedMessage', onTaskChange);
    };
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
                      setNewTaskStatus(section.title);
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
                      {(provided, snapshot) => (
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
                            <div>{task.title}</div>
                            <div>Creator: Jethro Baring</div>
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
            placeholder='Type here'
            className='input input-bordered w-full'
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <textarea
            placeholder='Type here'
            className='input input-bordered w-full h-32'
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
          <button className='btn btn-primary w-full' onClick={createTask}>
            Add
          </button>
        </div>
        <form method='dialog' className='modal-backdrop'>
          <button>close</button>
        </form>
      </dialog>
    </DragDropContext>
  );
};
