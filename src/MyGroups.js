import './App.css';
import { useState, useEffect, useContext } from 'react'
import { Link } from 'react-router-dom'
import useAxios from './utility/useAxios'
import { AuthenticationContext } from './AuthenticationContext'

function Users() {

  const { accessToken } = useContext(AuthenticationContext)
  const [users, setUsers] = useState([])
  const api = useAxios()

  useEffect(() => {
    fetchUsers()
  }, [])

  const fetchUsers = async () => {
    try{
      const response = await api.get('/groups/groupsinuserID')
      setUsers(response.data)
    }
    catch(error){
      console.dir("GETUSERSERROR: ", error)
    }
  }

  return (
    <div>
      {users.map(user => (
        // Warning: Each child in a list should have a unique "key" prop
        <h1 key={user._id}>
          <Link to={`/user/${user._id}`}>{user.nickname}</Link>
        </h1>
      ))}
    </div>
  );
}

export default Users;
