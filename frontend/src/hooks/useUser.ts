import { useContext } from "react";
import { useLocalStorage } from "./useLocalStorage";
import { AuthContext } from "../context/AuthContext";

// NOTE: optimally move this into a separate file
export interface User {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  accessToken: string;
  refreshToken: string;
}

export const useUser = () => {
  const { user, setUser } = useContext(AuthContext);
  const { setItem } = useLocalStorage();

  const addUser = (x: User) => {
    setUser(x);
    setItem("user", JSON.stringify(x));
  };

  const removeUser = () => {
    setUser(null);
    setItem("user", "");
  };

  return { user, addUser, removeUser, setUser };
};