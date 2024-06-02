import { BrowserRouter, Route, Routes } from 'react-router-dom';
import AuthLayout from './layouts/AuthLayout';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import { Group } from './pages/app/Messages';
import { Groups } from './pages/app/Groups';
import { Default } from './pages/app/Default';
import { Tasks } from './pages/app/Tasks';
import AuthProvider from './context/AuthProvider';
import { useLocalStorage } from './hooks/useLocalStorage';
import { useEffect, useState } from 'react';
import Landing from './components/Landing';

function App() {
  const [user, setUser] = useState('');
  const { getItem } = useLocalStorage();

  useEffect(() => {
    const user = getItem('user');
    if (user) {
      setUser(JSON.parse(user));
    }
  }, []);

  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path='/auth' element={<AuthLayout />}>
            <Route path='login' element={<Login />} />
            <Route path='register' element={<Register />} />
          </Route>
          {user ? (
            <Route path='/' element={<Groups />}>
              <Route index element={<Default />} />
              <Route path='/message/:id' element={<Group />} />
              <Route path='/tasks/:id' element={<Tasks />} />
            </Route>
          ) : (
            <Route path='/' element={<Landing />} />
          )}
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
