import './NotificationButton.css'
import { NavLink } from 'react-router-dom'

const NotificationButton = () => {
  return(
    <NavLink to='/notifications' exact className={isActive => (isActive ? 'notification-button notification-button-active' : 'notification-button notification-button-inactive')}>
      <i className='bell alarm icon'></i>
      <i className='red-dot circle icon'></i>
    </NavLink>
  )
}

export default NotificationButton