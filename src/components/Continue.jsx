import { Header } from '.'
import axios from 'axios'
import { useState } from 'react'
import { useDispatch } from 'react-redux'
import { signIn } from '../redux/authSlice'
import IonIcon from '@reacticons/ionicons'
import { useNavigate } from 'react-router-dom'

const Continue = () => {

  const navigate = useNavigate()
  const dispatch = useDispatch()
  const [continueErrorMessage, setContinueErrorMessage] = useState('')
  const [loading, setLoading] = useState(false)

  const continueSignUp = async () => {
    setContinueErrorMessage('')
    setLoading(true)
    try {
      const res = await axios.post(`${process.env.REACT_APP_APIURL}/auth/sign-in`, {}, { withCredentials: true })
      dispatch(signIn({ accessToken: res.data.accessToken, sessionData: res.data.sessionData }))
      setLoading(false)
      navigate('/')
    }
    catch(error) {
      setContinueErrorMessage(error.response?.data.message)
      setLoading(false)
    }
  }

  return (
    <div id='loginpage' className='flex column' style={{ color: 'var(--light-color)' }}>
      <Header />
      <div className='loginBox flex column' style={{ gap: '14px', backgroundColor: 'var(--layer-1-color)', borderColor: 'var(--layer-1-color)', borderStyle: 'solid' }}>
        <div>
          <div className='whiteSpace-initial text-align-center'>
            A link has been sent to your email.
          </div>
          <div className='whiteSpace-initial text-align-center'>
            Click it to continue.
          </div>
        </div>
        {!loading && <button
          className='shadow login-button flex justcont-center relative active'
          onClick={() => continueSignUp()}
        >
          Continue
        </button>}
        {loading && <button className={`shadow login-button flex justcont-center relative active`}>
          <IonIcon name='sync' className='t3 spin' />
        </button>}
        <div className='mailmsg t6'>{continueErrorMessage}</div>
      </div>
    </div>
  )
}

export default Continue