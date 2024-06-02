import { createContext, useContext, useEffect, useState } from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage';
import jwt from 'jsonwebtoken';

// Define the type for your user object
interface User {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  refreshToken: string;
  accessToken: string;
}

// Define the type for your context value
// Define the type for your context value
interface AuthContextType {
    user: User | null;
    login: (email: string, password: string) => Promise<void>;
    logout: () => void;
  }
  
  const AuthContext = createContext<AuthContextType>({
    user: null,
    login: async () => {},
    logout: () => {},
  });

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const { getItem, setItem, removeItem } = useLocalStorage();

  const login = async (email: string, password: string) => {
    const token = await fetch('http://localhost:3000/login', {
      method: 'POST',
      headers: {
        'Content-type': 'application/json',
      },
      body: JSON.stringify({
        email,
        password,
      }),
    });

    const tokenData = await token.json();

    const decoded = jwt.decode(tokenData.access) as { id: number };

    const information = await fetch(
      `http://localhost:3000/user/${decoded.id}`,
      {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${tokenData.access}`,
        },
      }
    );

    const informationData = await information.json();

    if (information.ok) {
      setItem(
        'user',
        JSON.stringify({
          id: informationData.id,
          email: informationData.email,
          firstName: informationData.profile.firstName,
          lastName: informationData.profile.lastName,
          refreshToken: tokenData.refresh,
          accessToken: tokenData.access,
        })
      );
    }
  };
  const logout = async () => {
    removeItem('user');
  };

  useEffect(() => {
    const getUser = () => {
      const user = getItem('user');
      if (user) {
        setUser(JSON.parse(user));
      }
    };

    getUser();
  }, []);

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
export default AuthProvider;
