import { Link } from 'react-router-dom'
import { useContext } from 'react'
import { AuthenticationContext } from './AuthenticationContext'
import useAxios from './utility/useAxios'
import { Button, Grid, Segment } from 'semantic-ui-react'

function Nav() {
  const navStyle = {
    color: 'white'
  }
  const api = useAxios()
  const { signOut } = useContext(AuthenticationContext)

  const onLogoutClick = () => {
    api.post('/auth/signout', { sessionID: window.localStorage.getItem('sessionID') })
    signOut()
  }

  return (
    // <nav>
    //   <h3>Logo</h3>
    //   <ul className="nav-links">
    //   <Button to='/about'>
    //     <li>About</li>
    //   </Button>
    //   <Link style={navStyle} to='/users'>
    //     <li>Users</li>
    //   </Link>
    //   <Link style={navStyle} to='/login'>
    //     <li>Login</li>
    //   </Link>
    //   <button onClick={onLogoutClick}>
    //     <li>Logout</li>
    //   </button>
    //   </ul>
    // </nav>

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
      
    </Grid>
  </Segment>
  );
}

export default Nav;
