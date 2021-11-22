import './App.css';
import { useState, useEffect } from 'react'
import useAxios from './utility/useAxios'
import { Segment, Grid, List, Button, Dropdown } from 'semantic-ui-react'

const Group = ({ match }) => {


  const [creator, setCreator] = useState('')
  const [title, setTitle] = useState('')
  const [members, setMembers] = useState([])
  const [allUsers, setAllUsers] = useState([])
  const [selectedUserId, setSelectedUserId] = useState('')
  const api = useAxios()

  const fetchGroup = async () => {
    try {
      const response = await api.get(`/groups/group/${match.params.groupid}`)
      const group = response.data
      setCreator(group.creator)
      setTitle(group.title)
      setMembers(group.members)
    }
    catch(error) {
      console.dir(error)
    }
  }

  const fetchAllUsers = async () => {
    try{
      const response = await api.get('/getusers')
      const userArray = []
      response.data.map((user) => (userArray.push({key: user._id, value: user._id, text: user.nickname})))
      setAllUsers(userArray)

      //// TODO Clear before append
      // response.data.map((user) => {
      //   setAllUsers((array) => [...array, { key: user._id, value: user._id, text: user.nickname }])
      // })
    }
    catch(error) {
      console.dir(error)
    }
  }

  // No dependacies = Run after every render
  // Empty [] dependancies = Run only after first render
  useEffect(() => {
    fetchGroup()
    fetchAllUsers()
    console.log('useEffect ran')
  }, [])

  const dropDownChange = (e, { value }) => {
    setSelectedUserId(value)
  }

  const addSelectedUserToGroup = async () => {
    try {
      const res = await api.post('/groups/addUserToGroup', {userID: selectedUserId, groupID: match.params.groupid})
      if(res.status === 200) {
        await fetchGroup()
      }
    }
    catch(error) {
      console.dir(error)
    }
  }

  const removeUserFromGroup = async () => {
    try{
      const res = await api.post('/groups/removeuserfromgroup', {userID: selectedUserId, groupID: match.params.groupid})
      if(res.status === 200) {
        await fetchGroup()
      }
    }
    catch(error) {
      console.dir(error)
    }
  }

  const { Row, Column } = Grid
  const { Item, Content, Header, Description, Icon } = List

  return (
    <Grid columns={2} textAlign='left'>
      <Row>
        <Column>
          <Segment>
            <Header as='h1'>Group title: {title}</Header>
            <Header as='h2'>creator: {creator}</Header>
          </Segment>
        </Column>
        <Column>
          <Segment>
            <Header as='h2'>Members:</Header>
            <List divided relaxed>
              {members.map(member => (
                <Item key={member._id}>
                  <Icon name='user' size='large' verticalAlign='middle' />
                  <Content>
                    <Header>{member.nickname}</Header>
                    <Description>id: {member._id}</Description>
                  </Content>
                </Item>
              ))}
              <Item>
                <Grid columns={3}>
                  <Row>
                    <Column>
                      <Button onClick={addSelectedUserToGroup}>ADD</Button>
                      <Button onClick={removeUserFromGroup}>REMOVE</Button>
                    </Column>
                    <Column>
                      <Segment>
                        <Dropdown onChange={dropDownChange} fluid placeholder='Select a user' options={allUsers}/>
                      </Segment>
                    </Column>
                  </Row>
                </Grid>
              </Item>
            </List>
          </Segment>
      </Column>
      </Row>
    </Grid>
  );
}

export default Group;
