import { NavLink } from 'react-router-dom'
import { useContext } from 'react'
import { AuthenticationContext } from '../contexts/AuthenticationContext'
import useAxios from '../utility/useAxios'
import { Dropdown, Segment, Label, Icon, Menu } from 'semantic-ui-react'

function NavigationBar() {
  const api = useAxios()
  const { signOut, sessionData } = useContext(AuthenticationContext)

  const onLogoutClick = async () => {
    console.log("onLogoutClick")
    try {
      await api.post('/auth/signout', { sessionID: sessionData.id })
    }
    catch(error) {
      console.dir(error)
    }
    signOut()
  }

  const userNavigationButton = () => {
    if(sessionData && sessionData.id) {
      return(
        <Dropdown text={sessionData.userNickname} className='link item'>
          <Dropdown.Menu>
            <Dropdown.Header>User info</Dropdown.Header>
            <Dropdown.Header>{sessionData.userId}</Dropdown.Header>
            <Dropdown.Header>{sessionData.userEmail}</Dropdown.Header>
            <Dropdown.Divider/>
            <Dropdown.Header>session id</Dropdown.Header>
            <Dropdown.Header>{sessionData.id}</Dropdown.Header>
            <Dropdown.Divider/>
            <Dropdown.Item onClick={onLogoutClick}>
              Sign out
            </Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
      )
    }
    else {
      return(<>
        <Menu.Item
          as={NavLink}
          exact
          to="/signup"
          name="sign up"/>
        <Menu.Item
          as={NavLink}
          exact
          to="/login"
          name="sign in"/>
      </>)
    }
  }

  return(
    <Segment basic inverted>
      <Menu inverted pointing secondary >
        <Menu.Item
          as={NavLink}
          exact
          to="/about"
          name="about"/>
        <Menu.Item
          as={NavLink}
          exact
          to="/users"
          name="Users"/>
        <Menu.Item
          as={NavLink}
          exact
          to="/mygroups"
          name="My groups"/>
        <Menu.Item
          as={NavLink}
          exact
          to="/profile"
          name="profile"/>
        <Menu.Menu position='right'>
          <Menu.Item icon as='a'>
            <Icon name='bell'/>
            <Label size='mini' color='red' floating>
              22
            </Label>
          </Menu.Item>
          {userNavigationButton()}
        </Menu.Menu>
      </Menu>
    </Segment>
  );
}

export default NavigationBar;
