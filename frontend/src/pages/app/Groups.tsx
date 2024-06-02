/* eslint-disable @typescript-eslint/no-unused-vars */
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Outlet } from 'react-router-dom';
import { useLocalStorage } from '../../hooks/useLocalStorage';

export const Groups = () => {
  const [user, setUser] = useState('');
  const [search, setSearch] = useState('')
  const { getItem } = useLocalStorage();
  const { id } = useParams();
  useEffect(() => {
    const user = getItem('user');
    if (user) {
      setUser(JSON.parse(user));
    }
  }, []);
  const [groups, setGroups] = useState([]);
  const [g, setG] = useState([])
  const [groupId, setGroupId] = useState(0);
  const [groupName, setGroupName] = useState('');
  const [error, setError] = useState('');
  // const [active, setActive] = useState(window.location.pathname.split('/')[1]);
  async function joinGroup() {
    console.log('lol');
    const response = await fetch('http://localhost:3000/group/join', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MywiaWF0IjoxNzE3MzEzMDY4LCJleHAiOjE3MTc1NzIyNjh9.bYiQNXhP7RqzYODmmq-F8mczpR5GGp8Rf4eCKeJDIFo`,
      },
      body: JSON.stringify({
        userId: user.id,
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
        Authorization: `Bearer ${user.acessToken}`,
      },
      body: JSON.stringify({
        name: groupName,
        creator: user.id,
      }),
    });

    const data = await response.json();

    if (response.ok) {
      window.location.href = `/message/${data.id}`;
    }
  }
  function handleSearch(e) {
    e.preventDefault()
    const updatedGroups = g.filter(group => group.group.name.toLowerCase().includes(search.toLowerCase()))
    setGroups(updatedGroups)
  }
  useEffect(() => {
    async function getGroups() {
      const response = await fetch(`http://localhost:3000/groups/${user.id}`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MywiaWF0IjoxNzE3MzEzMDY4LCJleHAiOjE3MTc1NzIyNjh9.bYiQNXhP7RqzYODmmq-F8mczpR5GGp8Rf4eCKeJDIFo`,
        },
      });

      const data = await response.json();

      if (response.ok) {
        setGroups(data.results);
        setG(data.results)
      }
    }

    getGroups();
  }, [user.id]);

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
          <form className='flex gap-3 items-center p-3 relative' onSubmit={handleSearch}>
            <input
              type='text'
              className='input w-full'
              placeholder='Search...'
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <button className='absolute right-[25px]'>
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
                  d='m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z'
                />
              </svg>
            </button>
          </form>
          <div className='flex flex-col gap-3 p-3'>
            {groups.map((group) => {
              return (
                <Link to={`/message/${group.group.id}`} key={group.group.id}>
                  <div
                    className={`rounded-lg hover:bg-gradient-to-r from-slate-300 to-slate-400 h-20 flex items-center p-3 gap-3 cursor-pointer ${
                      id == group.group.id ? 'bg-gradient-to-r from-slate-300 to-slate-400' : ''
                    }`}
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
        <div className='bg-gradient-to-r from-slate-100 to-slate-300 rounded-lg flex-1 flex flex-col'>
          <h1 className='text-2xl font-bold flex justify-between items-center p-3'>
            {window.location.pathname.split('/')[1] === "message" 
            ?
            "Messages"
            :
            window.location.pathname.split('/')[1] === "tasks" ?
            "Tasks"
            :
            ""
            }
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
