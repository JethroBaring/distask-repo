import { BrowserRouter, Route, Routes } from 'react-router-dom';
import AuthLayout from './layouts/AuthLayout';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import AppLayout from './layouts/AppLayout';
import { AuthContext } from './context/AuthContext';
import { useAuth } from './hooks/useAuth';
import { useEffect } from 'react';
import { Group } from './pages/app/Group';
import { Groups } from './pages/app/Groups';
import { Default } from './pages/app/Default';
import { Tasks } from './pages/app/Tasks';

function App() {
  const { user, login, logout, setUser } = useAuth();

  useEffect(() => {
    console.log(user);

    // if(user) {
    // window.location.href = "https://www.facebook.com"
    // }
  }, [user]);

  return (
    <AuthContext.Provider value={{ user, setUser }}>
      <BrowserRouter>
        <Routes>
          <Route path='/auth' element={<AuthLayout />}>
            <Route path='login' element={<Login />} />
            <Route path='register' element={<Register />} />
          </Route>
          <Route path='/' element={<Groups />}>
            <Route index element={<Default />} />
            <Route path='/message/:id' element={<Group />} />
            <Route path='/tasks/:id' element={<Tasks />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthContext.Provider>
  );
}

export default App;
