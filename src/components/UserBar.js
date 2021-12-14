import './UserBar.css'
import { useContext, useState, useRef, useEffect } from 'react'
import { AuthenticationContext } from '../contexts/AuthenticationContext'
import useAxios from '../utility/useAxios'
import { Dropdown, Segment, Label, Icon, Menu } from 'semantic-ui-react'
import { NavLink } from 'react-router-dom'
import { NavigationButton } from '.'

const UserBar = () => {
  const api = useAxios()
  const { signOut, sessionData } = useContext(AuthenticationContext)
  const [nicknameDropdownDisplay, setNicknameDropdownDisplay] = useState('none')
  const [notificationDropdownDisplay, setNotificationDropdownDisplay] = useState('none')
  const nicknameDropdownRef = useRef(null);
  const nicknameButtonRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      // If click event is outside of references
      if (nicknameButtonRef.current && nicknameDropdownRef.current && !nicknameDropdownRef.current.contains(event.target) && !nicknameButtonRef.current.contains(event.target)) {
        // Dropdown display none
        setNicknameDropdownDisplay('none')
      }
    }
    // Add a listener for mouse click
    document.addEventListener("mousedown", handleClickOutside);
    // Remove listener when done with it
    return(() => {document.removeEventListener("mousedown", handleClickOutside)})
    }, [nicknameDropdownRef, nicknameButtonRef]);

  const logoutClick = async () => {
    console.log('onLogoutClick')
    try {
      await api.post('/auth/signout', { sessionID: sessionData.id })
    } catch (error) {
      console.dir(error)
    }
    signOut()
  }

  const bellClick = async () => {
    if(notificationDropdownDisplay === 'none') {
      setNotificationDropdownDisplay('flex')
    }
    else {
      setNotificationDropdownDisplay('none')
    }
  }

  const nicknameClick = () => {
    if(nicknameDropdownDisplay === 'none') {
      setNicknameDropdownDisplay('flex')
    }
    else {
      setNicknameDropdownDisplay('none')
    }
  }

  const authenticationMenu = () => {
    if(sessionData && sessionData.id) {
      return(<>
        <div class='nickname-dropdown' style={{display: nicknameDropdownDisplay}} ref={nicknameDropdownRef}>
          <div class='nickname-dropdown-section'>
            <div class='nickname-dropdown-item'>User ID</div>
            <div class='nickname-dropdown-item'>{sessionData.userId}</div>
          </div>
          <div class='nickname-dropdown-divider'/>
          <div class='nickname-dropdown-section'>
            <div class='nickname-dropdown-item'>email</div>
            <div class='nickname-dropdown-item'>{sessionData.userEmail}</div>
          </div>
          <div class='nickname-dropdown-divider'/>
          <div class='nickname-dropdown-section'>
            <div class='nickname-dropdown-item'>Session ID</div>
            <div class='nickname-dropdown-item'>{sessionData.id}</div>
          </div>
          <div class='nickname-dropdown-divider'/>
          <div class='nickname-dropdown-section'>
            <div onClick={logoutClick} class='nickname-dropdown-item'>Sign out</div>
          </div>
        </div>
        <button class='nickname-button' onClick={nicknameClick} ref={nicknameButtonRef}>
          <div>
            {sessionData.userNickname}
            <i class='nickname-arrow angle down icon'></i>
          </div>
        </button>
      </>)
    }
    else {
      return(
        <>
          <NavigationButton to='/signup'>Sign Up</NavigationButton>
          <NavigationButton to='/login'>Sign In</NavigationButton>
        </>
      )
    }
  }

  return (
    <div class='userbar-flex-container'>
      <div class='userbar-left-items'>
        <div class='nickname-button'>LOGO?</div>
        <img style={{width: '44x', height: '40px'}} src="logo192.png"/>
      </div>
      <div class='userbar-right-items'>
        {authenticationMenu()}
      </div>
    </div>
  )
}

export default UserBar
