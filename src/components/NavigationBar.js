import { NavLink } from 'react-router-dom'
import { useContext, useEffect, useState } from 'react'
import { AuthenticationContext } from '../contexts/AuthenticationContext'
import useAxios from '../utility/useAxios'
import { Dropdown, Segment, Label, Icon, Menu } from 'semantic-ui-react'

function NavigationBar() {
  const api = useAxios()
  const { signOut, sessionID } = useContext(AuthenticationContext)
  console.log(`Nav authContext sessionID ${sessionID}`)
  const [userNickName, setUserNickName] = useState('')
  const [userId, setUserId] = useState('')

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
    console.log("onLogoutClick")
    try {
      await api.post('/auth/signout', { sessionID: sessionID })
    }
    catch(error) {
      console.dir(error)
    }
    signOut()
    await getUserInfo()
  }

  useEffect(() => {
    console.log("Nav useEffect ran")
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
    if(sessionID) {getUserInfo()}
    // eslint-disable-next-line
  }, [])

  const userNavigationButton = () => {
    console.log(`userNavigationButton check if sessionID ${sessionID}`)
    if(sessionID) {
      return(
        <Dropdown text={userNickName} className='link item'>
          <Dropdown.Menu>
            <Dropdown.Header>user id</Dropdown.Header>
            <Dropdown.Header>{userId}</Dropdown.Header>
            <Dropdown.Divider/>
            <Dropdown.Header>session id</Dropdown.Header>
            <Dropdown.Header>{sessionID}</Dropdown.Header>
            <Dropdown.Divider/>
            <Dropdown.Item fluid onClick={onLogoutClick}>
              Sign out
            </Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
      )
    }
    else {
      return(
        <Menu.Item
          as={NavLink}
          exact
          to="/login"
          name="sign in"/>
      )
    }
  }

  return(
    <Segment basic inverted>
      <Menu inverted pointing secondary >
        <Menu.Item
          as={NavLink}
          exact
          to="/about"
          name="about"
          // active={activeItem === 'about'}
          // onClick={handleItemClick}
          />
        <Menu.Item
          as={NavLink}
          exact
          to="/users"
          name="Users"
          // active={activeItem === 'Users'}
          // onClick={handleItemClick}
          />
        {/* <Menu.Item
          as={NavLink}
          exact
          to="/login"
          name="sign in"/> */}
        <Menu.Item
          as={NavLink}
          exact
          to="/signup"
          name="sign up"/>
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
          {/* <Menu.Item
            name="Sign out"
            onClick={onLogoutClick}/> */}
          <Menu.Menu>
          {userNavigationButton()}
          </Menu.Menu>
        </Menu.Menu>
      </Menu>
    </Segment>
  );
}

export default NavigationBar;
