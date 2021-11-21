import './App.css';
import { useState, useEffect } from 'react'
import useAxios from './utility/useAxios'

const Group = ({ match }) => {

  useEffect(() => {
    fetchUser()
  },[])

  const [title, setTitle] = useState('')
  const [members, setMembers] = useState([])
  const api = useAxios()

  const fetchUser = async () => {
    console.log(`/groups/group/${match.params.groupid}`)
    const response = await api.get(`/groups/group/${match.params.groupid}`)
    const group = response.data
    setTitle(group.title)
    setMembers(group.members)
    console.log(group)
  }

  return (
    <div>
      <h1>title: {title}</h1>
      <h1>
        MEMBERS:
      </h1>
      {members.map(member => (
        <h1 key={member}>
          {member}
        </h1>
      ))}
    </div>
  );
}

export default Group;
