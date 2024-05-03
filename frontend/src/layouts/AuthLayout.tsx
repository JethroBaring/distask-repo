import { Outlet } from 'react-router-dom';

const AuthLayout = () => {
  return (
    <div>
      <div className='h-screen w-screen flex justify-center items-center bg-grid'>
        <Outlet />
      </div>
    </div>
  );
};

export default AuthLayout