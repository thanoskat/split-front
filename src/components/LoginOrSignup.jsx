import '../style/Login.css'
import { useState } from 'react'
import axios from 'axios'
import { Link } from 'react-router-dom'


const LoginOrSignup = () => {

  const [email, setEmail] = useState('')
  const [message, setMessage] = useState('')
  const [link, setLink] = useState('')
  const [linkText, setLinkText] = useState('')

  const loginSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(`${process.env.REACT_APP_APIURL}/auth/sendlink`, { email: email })
      if (res && res.data && res.data.link) {
        if (res.data === "Cannot read property '_id' of null") {
          setMessage("The email you entered does not correspond to an account. Please try again.")
          setLinkText('')
        }
        else {
          setLink(res.data.link)
          setLinkText('EMAIL LINK!')
        }
      }
    }
    catch (error) {
      setMessage(error.message)
    }
  }

  const loginkeyPress = (e) => {
    if (e.key === 'Enter') {
      loginSubmit(e)
    }
  }

  return (
    <div className='loginBox flex column ' style={{ backgroundColor: "var(--layer-1-color)", borderColor: "var(--layer-1-color)", borderStyle: "solid" }}>
      <div className='signUpMsg' style={{ color: "var(--light-color)" }}>
        Enter your email to log in.
      </div>
      <form className="flex column" onSubmit={loginSubmit}>
        <div className='mailbox flex column '>
          <input className={`styledInput ${message === "" ? null : "inputErr"}`} placeholder='you@email' value={email} onChange={e => setEmail(e.target.value)} onKeyPress={loginkeyPress} />
          <div className='mailmsg t6'>{message}</div>
        </div>
        <button type="submit" className={`shadow login-button flex justcont-center relative ${email !== "" ? "active" : null}`} disabled={email === "" ? true : false} >
          Log In
        </button>
        <a href={link}>{linkText}</a>
        <div className="or flex justcont-center alignitems-center" style={{ color: "var(--light-color)" }}>OR</div>
        <Link to="/signup" style={{ textDecoration: 'none' }}>
          <div className='shadow signUp-button flex justcont-center relative' >
            Create new account
          </div>
        </Link>
      </form>
    </div>)
}


export default LoginOrSignup;