/* eslint-disable @typescript-eslint/no-unused-vars */
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Outlet } from 'react-router-dom';
import { useLocalStorage } from '../../hooks/useLocalStorage';

export const Groups = () => {
  const [user, setUser] = useState('');
  const [search, setSearch] = useState('');
  const { getItem } = useLocalStorage();
  const { id } = useParams();
  useEffect(() => {
    const user = getItem('user');
    if (user) {
      setUser(JSON.parse(user));
    }
  }, []);
  const [groups, setGroups] = useState([]);
  const [g, setG] = useState([]);
  const [groupId, setGroupId] = useState(0);
  const [groupName, setGroupName] = useState('');
  const [error, setError] = useState('');

  async function joinGroup() {
    const response = await fetch('http://localhost:3000/group/join', {
      method: 'post',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${user.accessToken}`,
      },
      body: JSON.stringify({
        userId: user.id,
        groupId: Number.parseInt(groupId),
      }),
    });
    const data = await response.json();
    console.log(response);
    if (response.ok) {
      window.location.href = `/message/${data.groupId}`;
    }

    console.log('hayst');
  }

  async function createGroup() {
    const response = await fetch('http://localhost:3000/group/create', {
      method: 'post',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${user.accessToken}`,
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
    e.preventDefault();
    const updatedGroups = g.filter((group) =>
      group.group.name.toLowerCase().includes(search.toLowerCase())
    );
    setGroups(updatedGroups);
  }
  useEffect(() => {
    async function getGroups() {
      const response = await fetch(`http://localhost:3000/groups/${user.id}`, {
        method: 'get',
        headers: {
          Authorization: `Bearer ${user.accessToken}`,
        },
      });
      console.log(response);
      const data = await response.json();

      if (response.ok) {
        setGroups(data.results);
        setG(data.results);
        console.log(data.results)
      }
    }
    if (user.id) {
      getGroups();
    }
  }, [user.id]);

  return (
    <>
      <div className='flex h-screen p-3 gap-3'>
        <div className='bg-slate-200 w-96 rounded-lg'>
          <div className='flex justify-between items-center'>
            <h1 className='text-2xl p-3 font-bold justify-between items-center'>
              Groups
            </h1>
            <div className='flex gap-2 p-3'>
              <button
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
              {/* <button
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
              </button> */}
            </div>
          </div>
          <form
            className='flex gap-3 items-center p-3 relative'
            onSubmit={handleSearch}
          >
            <input
              type='text'
              className='input w-full bg-slate-50'
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
                      id == group.group.id
                        ? 'bg-gradient-to-r from-slate-300 to-slate-400'
                        : ''
                    }`}
                  >
                    <div className='h-16 w-16 rounded-full bg-slate-500 flex items-center justify-center text-2xl text-white'>
                      {group.group.name.charAt(0).toUpperCase()}{group.group.name.charAt(1)}
                    </div>
                    <div className='flex flex-col justify-center'>
                      <p className='font-semibold'>{group.group.name}</p>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
        <div className='bg-gradient-to-r from-slate-100 to-slate-300 rounded-lg flex-1 flex flex-col'>
          <div className='text-2xl font-bold flex justify-between items-center p-3'>
            <h1 className=''>
              {window.location.pathname.split('/')[1] === 'message'
                ? 'Messages'
                : window.location.pathname.split('/')[1] === 'tasks'
                ? 'Tasks'
                : ''}
            </h1>
            {window.location.pathname.split('/')[1] === 'message' ? (
              <Link className='cursor-pointer' to={`/tasks/${id}`}>
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
                    d='M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 0 0 2.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 0 0-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 0 0 .75-.75 2.25 2.25 0 0 0-.1-.664m-5.8 0A2.251 2.251 0 0 1 13.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25ZM6.75 12h.008v.008H6.75V12Zm0 3h.008v.008H6.75V15Zm0 3h.008v.008H6.75V18Z'
                  />
                </svg>
              </Link>
            ) : window.location.pathname.split('/')[1] === 'tasks' ? (
              <Link className='cursor-pointer' to={`/message/${id}`}>
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
                    d='M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.129.166 2.27.293 3.423.379.35.026.67.21.865.501L12 21l2.755-4.133a1.14 1.14 0 0 1 .865-.501 48.172 48.172 0 0 0 3.423-.379c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0 0 12 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018Z'
                  />
                </svg>
              </Link>
            ) : (
              ''
            )}
          </div>
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
