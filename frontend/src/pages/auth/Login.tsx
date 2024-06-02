import { useState } from 'react';
import { useAuth } from '../../hooks/useAuth';

function Login() {
  const { login } = useAuth()
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault()
    console.log(email, password)
    login(email, password)
  }

  const handleEmail = (e) => {
    setEmail(e.target.value)
  }

  const handlePassword = (e) => {
    setPassword(e.target.value)
  }

  return (
    <>
      <form
        className='flex flex-col gap-5 p-5 rounded-lg shadow-lg border-[0.5px] bg-slate-50 border-flutter-blue border-opacity-15 shadow-flutter-blue/50'
        method='POST'
      >
        <h1 className='text-2xl font-bold text-center'>Login</h1>
        <label className='input input-bordered flex items-center gap-2'>
          <svg
            xmlns='http://www.w3.org/2000/svg'
            viewBox='0 0 16 16'
            fill='currentColor'
            className='w-4 h-4 opacity-70'
          >
            <path d='M2.5 3A1.5 1.5 0 0 0 1 4.5v.793c.026.009.051.02.076.032L7.674 8.51c.206.1.446.1.652 0l6.598-3.185A.755.755 0 0 1 15 5.293V4.5A1.5 1.5 0 0 0 13.5 3h-11Z' />
            <path d='M15 6.954 8.978 9.86a2.25 2.25 0 0 1-1.956 0L1 6.954V11.5A1.5 1.5 0 0 0 2.5 13h11a1.5 1.5 0 0 0 1.5-1.5V6.954Z' />
          </svg>
          <input
            type='email'
            className='grow'
            placeholder='Email'
            name='email'
            onChange={handleEmail}
          />
        </label>
        <label className='input input-bordered flex items-center gap-2'>
          <svg
            xmlns='http://www.w3.org/2000/svg'
            viewBox='0 0 16 16'
            fill='currentColor'
            className='w-4 h-4 opacity-70'
          >
            <path
              fillRule='evenodd'
              d='M14 6a4 4 0 0 1-4.899 3.899l-1.955 1.955a.5.5 0 0 1-.353.146H5v1.5a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1-.5-.5v-2.293a.5.5 0 0 1 .146-.353l3.955-3.955A4 4 0 1 1 14 6Zm-4-2a.75.75 0 0 0 0 1.5.5.5 0 0 1 .5.5.75.75 0 0 0 1.5 0 2 2 0 0 0-2-2Z'
              clipRule='evenodd'
            />
          </svg>
          <input type='password' className='grow' name='password' 
          onChange={handlePassword}
          />
        </label>
        <button onClick={handleLogin} className='btn btn-primary text-lg text-white bg-flutter-blue'>
          Signin
        </button>
        <p className='text-center text-sm'>
          Don't have an account?{' '}
          <a href='/signup' className='text-flutter-blue font-bold underline'>
            Signup
          </a>
        </p>
      </form>
    </>
  );
}

export default Login;
