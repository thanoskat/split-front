import './App.css';
import { Link } from 'react-router-dom'
import { useContext } from 'react'
import { AuthenticationContext } from './AuthenticationContext'
import useAxios from './utility/useAxios'

function Nav() {
  const navStyle = {
    color: 'white'
  }
  const api = useAxios()
  const { signOut } = useContext(AuthenticationContext)

  const onLogoutClick = () => {
    api.post('/auth/signout', { sessionID: window.localStorage.getItem('sessionID') })
    signOut()
  }

  return (
    <nav>
      <h3>Logo</h3>
      <ul className="nav-links">
      <Link style={navStyle} to='/about'>
        <li>About</li>
      </Link>
      <Link style={navStyle} to='/users'>
        <li>Users</li>
      </Link>
      <Link style={navStyle} to='/login'>
        <li>Login</li>
      </Link>
      <button onClick={onLogoutClick}>
        <li>Logout</li>
      </button>
      </ul>
    </nav>
  );
}

export default Nav;
