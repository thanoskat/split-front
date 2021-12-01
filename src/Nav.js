import './Nav.css'
import { Link, NavLink } from 'react-router-dom'
import { useContext, useEffect, useState } from 'react'
import { AuthenticationContext } from './AuthenticationContext'
import useAxios from './utility/useAxios'
import { Button, Grid, Segment, Label, Icon, Menu } from 'semantic-ui-react'

function Nav() {
  const api = useAxios()
  const { signOut, sessionID } = useContext(AuthenticationContext)
  const [ userNickName, setUserNickName ] = useState('')
  const [ userId, setUserId ] = useState('')
  const [activeItem, setActiveItem] = useState('Home')

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
  const handleItemClick = (e, { name }) => setActiveItem(name)
  const { Column, Row } = Grid
  return (
  // https://react.semantic-ui.com/augmentation/
  // <Segment inverted>
  //   <Grid columns='equal'>
  //     <Column>
  //       <Button
  //         color='orange'
  //         inverted
  //         as={NavLink}
  //         exact
  //         to="/about"
  //         style={isActive => ({backgroundColor:isActive ? "orange" : "purple"})}
  //       >About</Button>
  //     </Column>
  //     <Column>
  //       <Button
  //         as={NavLink}
  //         to='/users'
  //         className={isActive => (!isActive ? 'active-button' : 'noactive-button')}
  //       >Users</Button>
  //     </Column>
  //     <Column>
  //       <Button
  //         inverter
  //         as={NavLink}
  //         to='/login'
  //         style={isActive => (
  //           {
  //             backgroundColor:isActive ? "orange" : "grey",
  //             color:isActive ? "black" : "black",
  //             borderRadius: 0,
  //           }
  //         )}
  //       >Sign in</Button>
  //     </Column>
  //     <Column>
  //       <Button color='twitter' as={Link} to='/signup'>Sign up</Button>
  //     </Column>
  //     <Column>
  //       <Button onClick={onLogoutClick}>Sign out</Button>
  //     </Column>
  //     <Column>
  //       <Button as={Link} to='/profile'>Profile</Button>
  //     </Column>
  //     <Column>
  //       <Button as={Link} to='/mygroups'>My Groups</Button>
  //     </Column>
  //     <Column>
  //       <Menu icon compact>
  //         <Menu.Item as='a'>
  //           <Icon name='bell'/>
  //           <Label color='red' floating>
  //             22
  //           </Label>
  //         </Menu.Item>
  //       </Menu>
  //     </Column>
  //     <Column>
  //       <Button icon>
  //         <Button.Content>
  //           <Icon name='bell'/>
  //           <Label color='red' floating>
  //           </Label>
  //         </Button.Content>
  //       </Button>
  //     </Column>
  //     <Column>
  //       {userNickName}{'\n'}{userId}
  //     </Column>
  //   </Grid>
  // </Segment>
  <Segment basic inverted>
    <Menu inverted pointing secondary>
      <Menu.Item
        as={NavLink}
        exact
        to="/about"
        name="about"
        active={activeItem === 'about'}
        onClick={handleItemClick}/>
      <Menu.Item
        as={NavLink}
        exact
        to="/users"
        name="Users"
        active={activeItem === 'Users'}
        onClick={handleItemClick}/>
      <Menu.Item
        as={NavLink}
        exact
        to="/login"
        name="signin"
        active={activeItem === 'signin'}
        onClick={handleItemClick}/>
      <Menu.Item
        as={NavLink}
        exact
        to="/signup"
        name="signup"
        active={activeItem === 'signup'}
        onClick={handleItemClick}/>
      <Menu.Item
        as={NavLink}
        exact
        to="/mygroups"
        name="My groups"
        active={activeItem === 'My groups'}
        onClick={handleItemClick}/>
      <Menu.Item
        as={NavLink}
        exact
        to="/profile"
        name="profile"
        active={activeItem === 'profile'}
        onClick={handleItemClick}/>
      <Menu.Item icon as='a'>
        <Icon name='bell'/>
        <Label size='mini' color='red' floating>
          22
        </Label>
      </Menu.Item>
      <Menu.Item
        position='right'
        name="Sign out"
        active={activeItem === 'Sign out'}
        onClick={onLogoutClick}/>
    </Menu>
  </Segment>
  );
}

export default Nav;
