import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import useAxios from '../utility/useAxios'

function Users() {

  const [users, setUsers] = useState([])
  const api = useAxios()

  useEffect(() => {
    fetchUsers()
    // eslint-disable-next-line
  }, [])

  const fetchUsers = async () => {
    try{
      const response = await api.get('/getusers')
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
        <button key={user._id}>
          <Link to={`/users/${user._id}`}>{user.nickname}</Link>
        </button>
      ))}
    </div>
  );
}

export default Users;
