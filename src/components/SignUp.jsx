import { useState } from 'react'
import axios from 'axios'
import isEmail from 'validator/lib/isEmail';
import IonIcon from '@reacticons/ionicons'
import { Link } from 'react-router-dom'
//import { get } from '@reduxjs/toolkit/node_modules/immer/dist/internal';

const SignUp = () => {

  const [email, setEmail] = useState('')
  const [username, setUsername] = useState('')
  const [emailError, setEmailError] = useState("")
  const [usernameError, setUsernameError] = useState(false)
  const [loading, setLoading] = useState(false)
  const [link, setLink] = useState('')
  const [showMsg, setShowMsg] = useState(false)
  //const [searchParams, setSearchParams] = useSearchParams()

  //const showMsg = searchParams.get("filter") === "active"

  const formSubmit = async (e) => {
    e.preventDefault();

    if (!isEmail(email)) {
      setEmailError("Please enter a valid email")
      if (username.length <= 6) {
        setUsernameError("Username should be at least 6 characters long")
      }
      return
    }

    if (username.length <= 6) {
      setUsernameError("Username should be at least 6 characters long")
      if (!isEmail(email)) {
        setEmailError("Please enter a valid email")
      }
      return
    }

    try {
      setLoading(true)
      const res = await axios.post(`${process.env.REACT_APP_APIURL}/auth/signup`, { email: email, nickname: username })
      console.dir(res)
      setLink(res.data.link)
      setLoading(false)
      // setSearchParams({ filter: "active" })
      setShowMsg(true)
    }
    catch (error) {
      setLoading(false)
      setEmailError(error.response.data.message)
    }
  }

  const keyPress = (e) => {
    if (e.key === 'Enter') {
      formSubmit(e)
    }
  }

  const EmailMsg = ({ email }) => {
    return (
      <div className='loginBox flex column ' style={{ backgroundColor: "var(--layer-1-color)", borderColor: "var(--layer-1-color)", borderStyle: "solid" }}>
        <div className='whiteSpace-initial text-align-center'>
          An email has been sent to {email}
        </div>
      </div>
    )
  }

  return (

    <div className='loginBox flex column ' style={{ backgroundColor: "var(--layer-1-color)", borderColor: "var(--layer-1-color)", borderStyle: "solid" }}>
      {showMsg ? <EmailMsg email={email}/> :
        <div>
          <div className='signUpMsg' style={{ color: "var(--light-color)" }}>
            Sign up with your email.
          </div>
          <form className="flex column" onSubmit={formSubmit}>
            <div className='mailbox flex column '>
              <input className={`styledInput ${usernameError === false ? null : "inputErr"}`} placeholder='your name' value={username} onChange={e => setUsername(e.target.value)} onKeyPress={keyPress} />
              <div className='mailmsg t6'>{usernameError}</div>
            </div>
            <div className='mailbox flex column '>
              <input className={`styledInput ${emailError === "" ? null : "inputErr"}`} placeholder='you@email' value={email} onChange={e => setEmail(e.target.value)} onKeyPress={keyPress} />
              <div className='mailmsg t6'>{emailError}</div>
            </div>
            <button type='submit' className={`shadow login-button flex justcont-center relative ${email && username !== "" ? "active" : null}`} disabled={email && username === "" ? true : false}>
              {loading ? <IonIcon name='sync' className='t3 spin' /> : "Create account"}
            </button>
          </form>
          <div style={{ padding: "1rem 0 0 0" }}>
            Have an account? <Link to="/login" style={{ color: "var(--label-color-6)", textDecoration: 'none' }}>Log In</Link>
          </div>
        </div>}
    </div>
  )
}

export default SignUp;
