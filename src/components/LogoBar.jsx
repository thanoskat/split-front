import '../style/UserBar.css'
import useAxios from '../utility/useAxios'
import { useDispatch } from 'react-redux'
import { signOut } from '../redux/authSlice'
import store from '../redux/store'

const UserBar = () => {

  const api = useAxios()
  const dispatch = useDispatch()
  const sessionData = store.getState().authReducer.sessionData

  const logoutClick = async () => {
    try {
      await api.post('/auth/signout', { sessionID: sessionData.id })
    } catch (error) {
      console.dir(error)
    }
    dispatch(signOut())
    // signOut()
  }

  return (
    <div id='logo-bar' className='flex alignitems-end justcont-end'>
      <div style={{ left: '14px', top: '0px', position: 'absolute', color: 'white' }}>α</div>
      <div className="shadow logout-button flex relative alignitems-center" onClick={logoutClick}>
        {sessionData.userNickname}
      </div>
    </div>
  )
}

export default UserBar
