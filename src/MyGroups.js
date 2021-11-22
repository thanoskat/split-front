import './App.css';
import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import useAxios from './utility/useAxios'
import { Button, Form, Input, Segment, Grid } from 'semantic-ui-react'

function MyGroups() {

  const [groups, setGroups] = useState([])
  const [newGroupTitle, setNewGroupTitle] = useState('')
  const [message, setMessage] = useState('')
  const api = useAxios()

  useEffect(() => {
    fetchGroups()
    // eslint-disable-next-line
  }, [])

  const fetchGroups = async () => {
    try{
      const response = await api.get('/groups/mygroups')
      setGroups(response.data)
    }
    catch(error){
      console.dir("GETUSERSERROR: ", error)
    }
  }

  const deleteGroup = async (groupId) => {
    try {
      const response = await api.post('/groups/deletegroup', { groupId: groupId })
      if(response.status === 200) {
        await fetchGroups()
      }
    }
    catch(error) {
      console.dir(error)
    }
  }

  const formSubmit = async () => {
    try {
      const response = await api.post('/groups/creategroup', { title: newGroupTitle })
      if(response.status === 200) {
        // setMessage(`Group with title ${newGroupTitle} successfully created !`)
        await fetchGroups()
      }
    }
    catch(error) {
      console.dir(error)
      setMessage('Error creating group')
    }
  }

  return (
    <div>
      {groups.map(group => (
        // Warning: Each child in a list should have a unique "key" prop
        <h1 key={group._id}>
          <Link to={`/group/${group._id}`}>{group.title}</Link>
          <Button onClick={() => deleteGroup(group._id)}>Delete</Button>
        </h1>
      ))}
      <Grid centered>
        <Segment>
          <Form style={{ width:"300px" }} onSubmit={formSubmit}>
            <Form.Field
              fluid
              control={Input}
              label='Create a new group !'
              placeholder='Group title'
              onChange={e => setNewGroupTitle(e.target.value)}>
            </Form.Field>
            <Button type='submit'>Create</Button>
          </Form>
          <h4>{message}</h4>
        </Segment>
      </Grid>
    </div>
  );
}

export default MyGroups;
