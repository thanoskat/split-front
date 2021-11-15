import './App.css';
import { useState, useEffect } from 'react'

const User = ({ match }) => {

  useEffect(() => {
    fetchUser()
  },[])

  const [user, setUser] = useState({})

  const fetchUser = async () => {
    const response = await fetch(`https://jsonplaceholder.typicode.com/users/${match.params.id}`)
    const user = await response.json()
    setUser(user)
  }

  return (
    <div>
      <h1>name: {user.name}</h1>
      <h1>username: {user.username}</h1>
      <h1>email: {user.email}</h1>
      <h1>phone: {user.phone}</h1>
    </div>
  );
}

export default User;
