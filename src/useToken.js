import { useState } from 'react';

const useToken = () => {

  const saveToken = userToken => {
    localStorage.setItem('token', JSON.stringify(userToken));
    setToken(userToken.token);
  };

  const getToken = () => {
    const tokenString = localStorage.getItem('token');
    const userToken = JSON.parse(tokenString);
    return userToken?.token
  }

  const [token, setToken] = useState(getToken());

  return {
    setToken: saveToken,
    token
  }
}

export default useToken
