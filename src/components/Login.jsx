import '../style/Login.css'
import { useState } from 'react'
import axios from 'axios'

const Login = () => {

  const [email, setEmail] = useState('')
  const [message, setMessage] = useState('')
  const [link, setLink] = useState('')
  const [linkText, setLinkText] = useState('')

  const formSubmit = async (e) => {


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

  const keyPress = (e) => {
    if (e.key === 'Enter') {
      formSubmit(e)
    }
  }
//check text overflows
  return (
    <div id="loginpage" className=' flex column ' style={{ color: "var(--light-color)" }}>
      <div className='logo t66 flex alignitems-center'>
        α
      </div>
      <div className='appName flex column alignitems-center t05'>
        αlphaSplit
        <div className='appDescr t5'>
          The tool for organising your shared finances.
        </div>
      </div>
      <div className='loginBox flex column ' style={{ backgroundColor: "var(--layer-1-color)", borderColor: "var(--layer-1-color)", borderStyle: "solid" }}>
        <div className='signUpMsg' style={{ color: "var(--light-color)" }}>
          Enter your email to log in.
        </div>
        <div className='mailbox flex column '>
          <input className={`styledInput ${message === "" ? null : "inputErr"}`} placeholder='you@email' value={email} onInput={e => setEmail(e.target.value)} onKeyPress={keyPress} />
          <div className='mailmsg t6'>{message}</div>
        </div>
        <button className={`shadow login-button flex justcont-center relative ${email !== "" ? "active" : null}`} disabled={email === "" ? true : false} onClick={formSubmit}>
          Log In
        </button>
        <a href={link}>{linkText}</a>
        <div className="or flex justcont-center alignitems-center" style={{ color: "var(--light-color)" }}>OR</div>
        <div className='shadow signUp-button flex justcont-center relative'>
          Create new account
        </div>

      </div>
    </div>
  );
}

export default Login;
