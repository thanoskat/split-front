import '../style/UserBar.css'
import { useState, useRef, useEffect } from 'react'
// import { AuthenticationContext } from '../contexts/AuthenticationContext'
import useAxios from '../utility/useAxios'
import { NavigationButton } from '.'
import { useDispatch } from 'react-redux'
import { signOut } from '../redux/authSlice'
import store from '../redux/store'

const UserBar = () => {

  const dispatch = useDispatch()
  const sessionData = store.getState().authReducer.sessionData

  const api = useAxios()
  // const { signOut, sessionData } = useContext(AuthenticationContext)
  const [nicknameDropdownDisplay, setNicknameDropdownDisplay] = useState('none')
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
    }, []);

  const logoutClick = async () => {
    console.log('onLogoutClick')
    try {
      await api.post('/auth/signout', { sessionID: sessionData.id })
    } catch (error) {
      console.dir(error)
    }
    dispatch(signOut())
    // signOut()
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
      return(
        <div style={{ fontFamily: 'Inter'}}>
          <div className='nickname-dropdown' style={{display: nicknameDropdownDisplay}} ref={nicknameDropdownRef}>
            <div className='nickname-dropdown-section'>
              <div className='nickname-dropdown-item'>User ID</div>
              <div className='nickname-dropdown-item'>{sessionData.userId}</div>
            </div>
            <div className='nickname-dropdown-divider'/>
            <div className='nickname-dropdown-section'>
              <div className='nickname-dropdown-item'>email</div>
              <div className='nickname-dropdown-item'>{sessionData.userEmail}</div>
            </div>
            <div className='nickname-dropdown-divider'/>
            <div className='nickname-dropdown-section'>
              <div className='nickname-dropdown-item'>Session ID</div>
              <div className='nickname-dropdown-item'>{sessionData.id}</div>
            </div>
            <div className='nickname-dropdown-divider'/>
            <div className='nickname-dropdown-section'>
              <div onClick={logoutClick} className='nickname-dropdown-item'>Sign out</div>
            </div>
          </div>
          <button className='nickname-button' onClick={nicknameClick} ref={nicknameButtonRef}>
            <div>
              {sessionData.userNickname}
              <i className='nickname-arrow angle down icon'></i>
            </div>
          </button>
        </div>
      )
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
    <div className='userbar-flex-container'>
      <div className='userbar-left-items'>
        <div className='nickname-button'>LOGO?</div>
      </div>
      <div className='userbar-right-items'>
        {authenticationMenu()}
      </div>
    </div>
  )
}

export default UserBar
