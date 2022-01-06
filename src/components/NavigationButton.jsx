import '../style/NavigationButton.css'
import { NavLink } from 'react-router-dom'

const NavigationButton = ({ to, text, children }) => {
  return (
    <NavLink
      to={to}
      className={isActive => (isActive ? 'nav-button nav-button-active' : 'nav-button nav-button-inactive')}
    >
      {children}
    </NavLink>
  )
}

export default NavigationButton
