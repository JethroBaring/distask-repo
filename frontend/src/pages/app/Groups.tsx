import { Outlet } from 'react-router-dom';

export const Groups = () => {
  const samples = [1, 2, 3, 5, 6, 7, 8];
  return (
    <>
      <div className='flex h-screen p-3 gap-3'>
        <div className='bg-slate-200 w-96 rounded-lg'>
          <div className='flex justify-between items-center'>
            <h1 className='text-2xl p-3 font-bold justify-between items-center'>
              Groups
            </h1>
            <p className='p-5'>+</p>
          </div>
          <div className='flex flex-col gap-3 p-3'>
            {samples.map((sample) => {
              return (
                <div className='rounded-lg hover:bg-slate-300 h-20 flex items-center p-3 gap-3 cursor-pointer' key={sample}>
                  <div className='h-16 w-16 rounded-full bg-slate-500'/>
                  <div className='flex flex-col justify-center'>
                    <p className='font-semibold'>Sample Name</p>
                    <p>You: Hi guys</p>
                  </div>
                </div>
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
    </>
  );
};
