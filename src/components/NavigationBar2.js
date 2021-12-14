import './NavigationBar2.css';
import { NavigationButton } from '.'
import { useContext } from 'react'
import { AuthenticationContext } from '../contexts/AuthenticationContext'
import useAxios from '../utility/useAxios'
import NotificationButton from './NotificationButton'

function NavigationBar2() {
  const api = useAxios()
  const { signOut, sessionData } = useContext(AuthenticationContext)

  return(
    <div class='main-flex-container'>
      <div class="my-menu">
        <NotificationButton/>
        <NavigationButton to='/about'>About</NavigationButton>
        <NavigationButton to='/users'>Users</NavigationButton>
        <NavigationButton to='/mygroups'>My groups</NavigationButton>
        <NavigationButton to='/profile'>Profile</NavigationButton>
      </div>
    </div>
  )
}

export default NavigationBar2;
