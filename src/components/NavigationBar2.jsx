import '../style/NavigationBar2.css';
import { NavigationButton, NotificationButton } from '.'

function NavigationBar2() {

  return(
    <div className='main-flex-container'>
      <div className="my-menu">
        <NotificationButton/>
        <NavigationButton to='/main'>Main</NavigationButton>
        <NavigationButton to='/figmamain'>FigmaMain</NavigationButton>
        <NavigationButton to='/users'>Users</NavigationButton>
        <NavigationButton to='/mygroups'>My groups</NavigationButton>
        <NavigationButton to='/profile'>Profile</NavigationButton>
        <NavigationButton to='/test'>Test</NavigationButton>
        <NavigationButton to='/maintest'>Main Test</NavigationButton>
      </div>
    </div>
  )
}

export default NavigationBar2;
