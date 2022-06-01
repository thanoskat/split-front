import { useState } from 'react'
import axios from 'axios'

const SignUp = () => {

  const [email, setEmail] = useState('')
  const [username, setUsername] = useState('')
  const [emailError, setEmailError] = useState(false)
  const [usernameError, setUsernameError] = useState(false)
  const [loading, setLoading] = useState(false)

  const formSubmit = async () => {
    // setEmailError({
    //   content: 'Please enter a valid email address',
    //   pointing: 'below',
    // })
    try {
      setLoading(true)
      const res = await axios.post(`${process.env.REACT_APP_APIURL}/auth/signup`, { email: email, nickname: username })
      console.dir(res)
      setEmailError(false)
      setUsernameError(false)
      setLoading(false)
    }
    catch (error) {
      if (error.response.data.email) {
        setEmailError({
          content: error.response.data.email,
          pointing: 'above'
        })
      }
      else {
        setEmailError(false)
      }
      if (error.response.data.username) {
        setUsernameError({
          content: error.response.data.username,
          pointing: 'above'
        })
      }
      else {
        setUsernameError(false)
      }
      setLoading(false)
    }
  }

  const keyPress = (e) => {
    if (e.key === 'Enter') {
      formSubmit(e)
    }
  }

  return (
    // <div>
    //   <form onSubmit={formSubmit}>
    //     <input
    //       placeholder='Email'
    //       onChange={e => setEmail(e.target.value)}>
    //     </input>

    //     <input
    //       placeholder='username'
    //       onChange={ e => setusername(e.target.value)}>
    //     </input>
    //     <button type='submit'>
    //       Sign Up
    //     </button>
    //   </form>

    // </div>
    <div className='loginBox flex column ' style={{ backgroundColor: "var(--layer-1-color)", borderColor: "var(--layer-1-color)", borderStyle: "solid" }}>
    <div className='signUpMsg' style={{ color: "var(--light-color)" }}>
      Sign up with your email.
    </div>
    <form className = "flex column" onSubmit={formSubmit}>
      <div className='mailbox flex column '>
        <input className={`styledInput ${usernameError === false ? null : "inputErr"}`} placeholder='your name' value={username} onChange={e => setUsername(e.target.value)} onKeyPress={keyPress} />
        <div className='mailmsg t6'>{usernameError}</div>
      </div>
      <div className='mailbox flex column '>
        <input className={`styledInput ${emailError === false ? null : "inputErr"}`} placeholder='you@email' value={email} onChange={e => setEmail(e.target.value)} onKeyPress={keyPress} />
        <div className='mailmsg t6'>{emailError}</div>
      </div>
      <button type='submit' className={`shadow login-button flex justcont-center relative ${email && username !== "" ? "active" : null}`} disabled={email && username === "" ? true : false}>
        Create account
      </button>
    </form>
  </div>
  )
}

export default SignUp;
