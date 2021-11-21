import './App.css';
import { useState, useEffect, useContext } from 'react'
import { Link } from 'react-router-dom'
import useAxios from './utility/useAxios'
import { AuthenticationContext } from './AuthenticationContext'

function Users() {

  const { accessToken } = useContext(AuthenticationContext)
  const [groups, setGroups] = useState([])
  const api = useAxios()

  useEffect(() => {
    fetchUsers()
  }, [])

  const fetchUsers = async () => {
    try{
      const response = await api.get('/groups/mygroups')
      console.log(response.data)
      setGroups(response.data)
    }
    catch(error){
      console.dir("GETUSERSERROR: ", error)
    }
  }

  return (
    <div>
      {groups.map(group => (
        // Warning: Each child in a list should have a unique "key" prop
        <h1 key={group._id}>
          <Link to={`/groups/group/${group._id}`}>{group.title}</Link>
        </h1>
      ))}
    </div>
  );
}

export default Users;
