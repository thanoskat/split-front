import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import useAxios from '../utility/useAxios'
import {Button} from "."

function Users() {

  const [users, setUsers] = useState([])
  const api = useAxios()

  useEffect(() => {
    console.log('useEffect() ran')
    fetchUsers()
    // eslint-disable-next-line
  }, [])

  const fetchUsers = async () => {
    try {
      console.log('fetchUsers() ran')
      const response = await api.get('/getusers')
      setUsers(response.data)
    }
    catch(error) {
      console.dir("GETUSERSERROR: ", error)
    }
  }

  return (
    <div>
      {users.map(user => (
        // Warning: Each child in a list should have a unique "key" prop
        <Button key={user._id} placeholder="hello">
          <Link to={`/users/${user._id}`}>{user.nickname}</Link>
        </Button>
      ))}
    </div>
  );
}

export default Users;
