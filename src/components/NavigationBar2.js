import './NavigationBar2.css';
import { NavigationButton } from '.'
import NotificationButton from './NotificationButton'

function NavigationBar2() {

  return(
    <div className='main-flex-container'>
      <div className="my-menu">
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
