import { Header } from '.'
import { useState } from 'react'
import axios from 'axios'
import { Link } from 'react-router-dom'
import { useNavigate } from 'react-router-dom'
import IonIcon from '@reacticons/ionicons'

const SignIn = () => {

  const navigate = useNavigate()
  const [signInForm, setSignInForm] = useState({
    email: ''
  })
  const [submitErrorMessage, setSubmitErrorMessage] = useState('')
  const [signInErrorMessages, setSignInErrorMessages] = useState({})
  const [loading, setLoading] = useState(false)

  const submitSignIn = async (e) => {
    e.preventDefault()
    setSignInErrorMessages({})
    setSubmitErrorMessage('')
    setLoading(true)

    try {
      await axios.post(
        `${process.env.REACT_APP_APIURL}/auth/request-sign-in`,
        { email: signInForm.email },
        { withCredentials: true }
      )
      setLoading(false)
      navigate('/continue')
      }
    catch(error) {
      if(error.response) {
        if(Array.isArray(error.response.data)) {
          const tempErrorMessages = {}
          error.response.data.reverse().forEach(err => {
            if(err.field === 'email') tempErrorMessages.email = err.message
          })
          setSignInErrorMessages(tempErrorMessages)
        }
        if(error.response.data.message) {
          setSubmitErrorMessage(error.response.data.message)
        }
      }
      else {
        if(error.message === 'Network Error') setSubmitErrorMessage('Unable to establish connection to server')
        else setSubmitErrorMessage(error.message)
      }
      setLoading(false)
    }
  }

  const keyPress = (e) => {
    if (e.key === 'Enter') {
      submitSignIn(e)
    }
  }

  const changeEmail = (e) => {
    setSignInErrorMessages({...signInErrorMessages, email: null})
    setSignInForm({ ...signInForm, email: e.target.value })
    setSubmitErrorMessage('')
  }

  return (
    <div id='loginpage' className='flex column ' style={{ color: 'var(--light-color)' }}>
      <Header />
      <div className='loginBox flex column' style={{ backgroundColor: 'var(--layer-1-color)', borderColor: 'var(--layer-1-color)', borderStyle: 'solid' }}>
        <div className='signUpMsg' style={{ color: 'var(--light-color)' }}>
          Enter your email to sign in.
        </div>
        <div className='flex column'>
          <div className='mailbox flex column'>
            <input
              inputmode='email'
              value={signInForm.email}
              className={`styledInput ${signInErrorMessages.email ? 'inputErr' : null}`}
              placeholder='john@rambo.com'
              onChange={e => changeEmail(e)}
              onKeyPress={keyPress}
            />
            <div className='mailmsg t6'>{signInErrorMessages.email}</div>
          </div>
          {!loading && <button
            onClick={submitSignIn}
            className={`shadow login-button flex justcont-center relative active`}
          >
            Sign In
          </button>}
          {loading && <button className={`shadow login-button flex justcont-center relative active`}>
            <IonIcon name='sync' className='t3 spin' />
          </button>}
          <div className='mailmsg t6'>{submitErrorMessage}</div>
          <div className='or flex justcont-center alignitems-center' style={{ color: 'var(--light-color)' }}>OR</div>
          <Link to='/signup' style={{ textDecoration: 'none' }}>
            <div className='shadow signUp-button flex justcont-center relative' >
              Create new account
            </div>
          </Link>
        </div>
      </div>
    </div>
  )
}

export default SignIn
