import './Nav.css'
import { Link, NavLink } from 'react-router-dom'
import { useContext, useEffect, useState } from 'react'
import { AuthenticationContext } from './AuthenticationContext'
import useAxios from './utility/useAxios'
import { Button, Grid, Segment } from 'semantic-ui-react'

function Nav() {
  const api = useAxios()
  const { signOut, sessionID } = useContext(AuthenticationContext)
  const [ userNickName, setUserNickName ] = useState('')
  const [ userId, setUserId ] = useState('')

  async function getUserInfo() {
    try {
      const res = await api.get('/auth/getuserinfo')
      setUserId(res.data.id)
      setUserNickName(res.data.nickname)
    }
    catch(error) {
      console.dir(error)
    }
  }

  const onLogoutClick = async () => {
    try {
      await api.post('/auth/signout', { sessionID: sessionID })
    }
    catch(error) {
      console.dir(error)
    }
    signOut()
    getUserInfo()
  }

  // useEffect(() => {
  //   getUserInfo()
  //   // eslint-disable-next-line
  // }, [])

  const { Column } = Grid

  return (
  // https://react.semantic-ui.com/augmentation/
  <Segment inverted>
    <Grid columns='equal'>
      <Column>
        <Button
          color='orange'
          inverted
          as={NavLink}
          exact
          to="/about"
          style={isActive => ({backgroundColor:isActive ? "orange" : "purple"})}
        >About</Button>
      </Column>
      <Column>
        <Button
          as={NavLink}
          to='/users'
          className={isActive => (!isActive ? 'active-button' : 'noactive-button')}
        >Users</Button>
      </Column>
      <Column>
        <Button
          inverter
          as={NavLink}
          to='/login'
          style={isActive => (
            {
              backgroundColor:isActive ? "orange" : "grey",
              color:isActive ? "black" : "black",
              borderRadius: 0,
            }
          )}
        >Sign in</Button>
      </Column>
      <Column>
        <Button color='twitter' as={Link} to='/signup'>Sign up</Button>
      </Column>
      <Column>
        <Button onClick={onLogoutClick}>Sign out</Button>
      </Column>
      <Column>
        <Button as={Link} to='/profile'>Profile</Button>
      </Column>
      <Column>
        <Button as={Link} to='/mygroups'>My Groups</Button>
      </Column>
      <Column>
        {userNickName}{'\n'}{userId}
      </Column>
    </Grid>
  </Segment>
  );
}

export default Nav;
