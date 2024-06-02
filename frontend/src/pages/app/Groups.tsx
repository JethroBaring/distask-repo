import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Outlet } from 'react-router-dom';

export const Groups = () => {
  const [groups, setGroups] = useState([]);
  const [groupId, setGroupId] = useState(0);
  const [groupName, setGroupName] = useState('');
  const [error, setError] = useState('');

  async function joinGroup() {
    console.log('lol');
    const response = await fetch('http://localhost:3000/group/join', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MywiaWF0IjoxNzE3MzEzMDY4LCJleHAiOjE3MTc1NzIyNjh9.bYiQNXhP7RqzYODmmq-F8mczpR5GGp8Rf4eCKeJDIFo`,
      },
      body: JSON.stringify({
        userId: 3,
        groupId: groupId,
      }),
    });
    const data = await response.json();
    if (response.ok) {
      window.location.href = `/message/${data.groupId}`;
    }

    console.log(data);

    console.log(error);
  }

  async function createGroup() {
    const response = await fetch('http://localhost:3000/group/create', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MywiaWF0IjoxNzE3MzEzMDY4LCJleHAiOjE3MTc1NzIyNjh9.bYiQNXhP7RqzYODmmq-F8mczpR5GGp8Rf4eCKeJDIFo`,
      },
      body: JSON.stringify({
        name: groupName,
        creator: 3,
      }),
    });

    const data = await response.json();

    if (response.ok) {
      window.location.href = `/message/${data.id}`;
    }
  }

  useEffect(() => {
    async function getGroups() {
      const response = await fetch('http://localhost:3000/groups/3', {
        method: 'GET',
        headers: {
          Authorization: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MywiaWF0IjoxNzE3MzEzMDY4LCJleHAiOjE3MTc1NzIyNjh9.bYiQNXhP7RqzYODmmq-F8mczpR5GGp8Rf4eCKeJDIFo`,
        },
      });

      const data = await response.json();

      if (response.ok) {
        console.log(data.results);
        setGroups(data.results);
      }
    }

    getGroups();
  }, []);

  return (
    <>
      <div className='flex h-screen p-3 gap-3'>
        <div className='bg-slate-200 w-96 rounded-lg'>
          <div className='flex justify-between items-center'>
            <h1 className='text-2xl p-3 font-bold justify-between items-center'>
              Groups
            </h1>
            <button
              className='p-3'
              onClick={() =>
                document.getElementById('choices_modal').showModal()
              }
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
                  d='M12 9v6m3-3H9m12 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z'
                />
              </svg>
            </button>
          </div>
          <div className='flex flex-col gap-3 p-3'>
            {groups.map((group) => {
              return (
                <Link to={`/message/${group.group.id}`}>
                  <div
                    className='rounded-lg hover:bg-slate-300 h-20 flex items-center p-3 gap-3 cursor-pointer'
                    key={group.group.id}
                  >
                    <div className='h-16 w-16 rounded-full bg-slate-500' />
                    <div className='flex flex-col justify-center'>
                      <p className='font-semibold'>{group.group.name}</p>
                      <p>You: Hi guys</p>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
        <div className='bg-slate-200 rounded-lg flex-1 flex flex-col'>
          <h1 className='text-2xl font-bold flex justify-between items-center p-3'>
            Messages
          </h1>
          <Outlet />
        </div>
      </div>
      <dialog id='choices_modal' className='modal'>
        <div className='modal-box flex flex-col items-center gap-5 w-[300px]'>
          <button
            className='btn btn-primary w-full'
            onClick={() => document.getElementById('join_modal').showModal()}
          >
            Join
          </button>
          <button
            className='btn btn-primary w-full'
            onClick={() => document.getElementById('create_modal').showModal()}
          >
            Create
          </button>
        </div>
        <form method='dialog' className='modal-backdrop'>
          <button>close</button>
        </form>
      </dialog>

      <dialog id='join_modal' className='modal'>
        <div className='modal-box flex flex-col items-center gap-5 w-[300px]'>
          <h3 className='font-bold text-lg'>Enter Group ID</h3>
          <input
            type='number'
            placeholder='Type here'
            className='input input-bordered w-full'
            value={groupId}
            onChange={(e) => setGroupId(e.target.value)}
          />
          {error ? <div>{error}</div> : ''}
          <button className='btn btn-primary w-full' onClick={joinGroup}>
            Join
          </button>
        </div>
        <form method='dialog' className='modal-backdrop'>
          <button>close</button>
        </form>
      </dialog>
      <dialog id='create_modal' className='modal'>
        <div className='modal-box flex flex-col items-center gap-5 w-[300px]'>
          <h3 className='font-bold text-lg'>Enter Group Name</h3>
          <input
            type='text'
            placeholder='Type here'
            className='input input-bordered w-full'
            value={groupName}
            onChange={(e) => setGroupName(e.target.value)}
          />
          <button className='btn btn-primary w-full' onClick={createGroup}>
            Create
          </button>
        </div>
        <form method='dialog' className='modal-backdrop'>
          <button>close</button>
        </form>
      </dialog>
    </>
  );
};
