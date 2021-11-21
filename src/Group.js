import './App.css';
import { useState, useEffect } from 'react'
import useAxios from './utility/useAxios'

const Group = ({ match }) => {

  useEffect(() => {
    fetchUser()
  },[])

  const [creator, setCreator] = useState('')
  const [title, setTitle] = useState('')
  const [members, setMembers] = useState([])
  const api = useAxios()

  const fetchUser = async () => {
    try {
      const response = await api.get(`/groups/group/${match.params.groupid}`)
      const group = response.data
      setCreator(group.creator)
      setTitle(group.title)
      setMembers(group.members)
      console.log(group)
    }
    catch(error) {
      console.dir(error)
    }
  }

  return (
    <div>
      <h1>title: {title}</h1>
      <h1>creator: {creator}</h1>
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
