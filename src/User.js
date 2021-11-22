import './App.css';
import { useState, useEffect } from 'react'
import useAxios from './utility/useAxios'
import { Card, Grid, Segment } from 'semantic-ui-react'

const User = ({ match }) => {

  const api = useAxios()
  useEffect(() => {
    fetchUser()
  },[])

  const [user, setUser] = useState({})

  const fetchUser = async () => {
    try{
      const response = await api.get(`/userinfo/${match.params.id}`)
      const user = response.data
      console.dir(user)
      setUser(user)
    }
    catch(error) {
      console.dir(error)
    }
  }

  return (
    <Grid centered>
      <Segment>
        <Card>
          <Card.Content>
            <Card.Header>Nickname: {user.nickname}</Card.Header>
            <Card.Meta>Email: {user.email}</Card.Meta>
            <Card.Description>
              {user._id}
            </Card.Description>
          </Card.Content>
        </Card>
      </Segment>
    </Grid>
  );
}

export default User;
