import { useState } from "react";

const useAuth = (initialValue) => {

  const [isAuth, setIsAuth] = useState(initialValue);

  function login() {
    setTimeout(() => {
      setIsAuth(true);
      localStorage.setItem('isAuth', JSON.stringify(isAuth));
    }, 1000);
  }

  function logout() {
    setTimeout(() => {
      setIsAuth(false);
      localStorage.setItem('isAuth', JSON.stringify(isAuth));
    }, 1000);
  }

  return [isAuth, login, logout];
}

export default useAuth
