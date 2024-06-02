import { useEffect } from "react";
import { useUser } from "./useUser";
import { useLocalStorage } from "./useLocalStorage";
import jwt from 'jsonwebtoken'

export const useAuth = () => {
  // we can re export the user methods or object from this hook
  const { user, addUser, removeUser, setUser } = useUser();
  const { getItem } = useLocalStorage();

  useEffect(() => {
    const storedUser = getItem("user");
    if (storedUser) {
      addUser(JSON.parse(storedUser));
    }
  }, [addUser, getItem]);

  const login = async (email: string, password: string) => {
    const token = await fetch('http://localhost:3000/login', {
      method: 'POST',
      headers: {
        'Content-type': 'application/json'
      },
      body: JSON.stringify({
        email,
        password
      })
    })

    const tokenData = await token.json()

    const decoded = jwt.decode(tokenData.access) as {id: number}

    const information = await fetch(`http://localhost:3000/user/${decoded.id}`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${tokenData.access}`
      }
    })

    const informationData = await information.json()

    if(information.ok) {
      addUser({
        id: informationData.id,
        email: informationData.email,
        firstName: informationData.profile.firstName,
        lastName: informationData.profile.lastName,
        refreshToken: tokenData.refresh,
        accessToken: tokenData.access
      })
    }
  };

  const logout = () => {
    removeUser();
  };

  return { user, login, logout, setUser };
};