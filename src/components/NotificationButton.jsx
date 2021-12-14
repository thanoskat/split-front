import './NotificationButton.css'
import { NavLink } from 'react-router-dom'

const NotificationButton = () => {
  return(
    <NavLink to='/' exact className={isActive => (isActive ? 'notification-button notification-button-active' : 'notification-button notification-button-inactive')}>
      <i class='bell alarm icon'></i>
      <i class='red-dot circle icon'></i>
    </NavLink>
  )
}

export default NotificationButton