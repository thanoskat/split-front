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
      if(res && res.data && res.data.link) {
        if(res.data === "Cannot read property '_id' of null") {
          setMessage("Email is not correct!")
          setLinkText('')
        }
        else {
          setLink(res.data.link)
          setMessage("Email sent!")
          setLinkText('EMAIL LINK!')
        }
      }
    }
    catch(error) {
      setMessage(error.message)
    }
  }

  const keyPress = (e) => {
    if(e.key === 'Enter') {
      formSubmit(e)
    }
  }

  return (
    <div>
      <div className='login-box'>
        <input placeholder="Email" value={email} onInput={e => setEmail(e.target.value)} onKeyPress={keyPress}/>
        <button onClick={formSubmit}>Submit</button>
        <a href={link}>{linkText}</a>
        <div>{message}</div>
      </div>
    </div>
  );
}

export default Login;
