import { Header } from '.'
import { useState } from 'react'
import axios from 'axios'
import IonIcon from '@reacticons/ionicons'
import { Link } from 'react-router-dom'
import { useNavigate } from 'react-router-dom'

const SignUp = () => {
  const navigate = useNavigate()
  const [signUpForm, setSignUpForm] = useState({
    nickname: '',
    email: ''
  })
  const [submitErrorMessage, setSubmitErrorMessage] = useState('')
  const [signUpErrorMessages, setSignUpErrorMessages] = useState({})
  const [loading, setLoading] = useState(false)
  // console.log({signUpForm, submitErrorMessage, signUpErrorMessages, loading})

  const submitSignUp = async (e) => {
    e.preventDefault()
    setSignUpErrorMessages({})
    setSubmitErrorMessage('')
    setLoading(true)

    try {
      await axios.post(
        `${process.env.REACT_APP_APIURL}/auth/request-sign-up`,
        { email: signUpForm.email, nickname: signUpForm.nickname },
        { withCredentials: true }
      )
      setLoading(false)
      navigate('/continue')
    }
    catch (error) {
      if(error.response) {
        if(Array.isArray(error.response.data)) {
          const tempErrorMessages = {}
          error.response.data.reverse().forEach(err => {
            if(err.field === 'nickname') tempErrorMessages.nickname = err.message
            if(err.field === 'email') tempErrorMessages.email = err.message
          })
          setSignUpErrorMessages(tempErrorMessages)
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
      submitSignUp(e)
    }
  }

  const changeNickname = (e) => {
    setSignUpErrorMessages({ ...signUpErrorMessages, nickname: null })
    setSignUpForm({ ...signUpForm, nickname: e.target.value })
    setSubmitErrorMessage('')
  }

  const changeEmail = (e) => {
    setSignUpErrorMessages({...signUpErrorMessages, email: null})
    setSignUpForm({ ...signUpForm, email: e.target.value })
    setSubmitErrorMessage('')
  }

  return (
    <div id='loginpage' className='flex column ' style={{ color: 'var(--light-color)' }}>
      <Header />
      <div className='loginBox flex column' style={{ backgroundColor: 'var(--layer-1-color)', borderColor: 'var(--layer-1-color)', borderStyle: 'solid' }}>
        <div>
          <div className='signUpMsg' style={{ color: 'var(--light-color)' }}>
            Sign up with your email.
          </div>
          <div className='flex column' >
            <div className='mailbox flex column '>
              <input
                className={`styledInput ${signUpErrorMessages.nickname ? 'inputErr' : ''}`}
                placeholder='John'
                value={signUpForm.nickname}
                onChange={e => changeNickname(e)}
                onKeyPress={keyPress}
              />
              <div className='mailmsg t6'>{signUpErrorMessages.nickname}</div>
            </div>
            <div className='mailbox flex column '>
              <input
                className={`styledInput ${signUpErrorMessages.email ? 'inputErr' : ''}`}
                placeholder='john@rambo.com'
                inputmode='email'
                value={signUpForm.email}
                onChange={e => changeEmail(e)}
                onKeyPress={keyPress}
              />
              <div className='mailmsg t6'>{signUpErrorMessages.email}</div>
            </div>
            {!loading && <button
              onClick={submitSignUp}
              className={`shadow login-button flex justcont-center relative active`}
              // className={`shadow login-button flex justcont-center relative ${signUpForm.email && signUpForm.nickname !== '' ? 'active' : null}`}
              // disabled={signUpForm.email && signUpForm.nickname === '' ? true : false}
            >
              Create account
            </button>}
            {loading && <button className={`shadow login-button flex justcont-center relative active`}>
              <IonIcon name='sync' className='t3 spin' />
            </button>}
            <div className='mailmsg t6'>{submitErrorMessage}</div>
          </div>
          <div style={{ padding: '1rem 0 0 0' }}>
            Have an account? <Link to='/login' style={{ color: 'var(--label-color-6)', textDecoration: 'none' }}>Sign In</Link>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SignUp
