import { Link } from 'react-router-dom'
import { useContext } from 'react'
import { AuthenticationContext } from './AuthenticationContext'
import useAxios from './utility/useAxios'
import { Button, Grid, Segment } from 'semantic-ui-react'

function Nav() {
  const api = useAxios()
  const { signOut, sessionID } = useContext(AuthenticationContext)

  const onLogoutClick = async () => {
    try{
      await api.post('/auth/signout', { sessionID: sessionID })
    }
    catch(error) {
      console.dir(error)
    }
    signOut()
  }

  return (
  // https://react.semantic-ui.com/augmentation/
  <Segment inverted>
    <Grid columns='equal'>
      <Grid.Column>
        <Button as={Link} to='/about'>About</Button>
      </Grid.Column>
      <Grid.Column>
        <Button as={Link} to='/users'>Users</Button>
      </Grid.Column>
      <Grid.Column>
        <Button as={Link} to='/login'>Sign in</Button>
      </Grid.Column>
      <Grid.Column>
        <Button as={Link} to='/signup'>Sign up</Button>
      </Grid.Column>
      <Grid.Column>
        <Button onClick={onLogoutClick}>Sign out</Button>
      </Grid.Column>
      <Grid.Column>
        <Button as={Link} to='/profile'>Profile</Button>
      </Grid.Column>
      <Grid.Column>
        <Button as={Link} to='/mygroups'>My Groups</Button>
      </Grid.Column>
    </Grid>
  </Segment>
  );
}

export default Nav;
