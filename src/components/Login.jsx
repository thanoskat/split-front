import '../style/Login.css'
import { useState } from 'react'
import axios from 'axios'
import { Container } from './'

const Login = () => {

  const [email, setEmail] = useState('')
  const [message, setMessage] = useState('')
  const [link, setLink] = useState('')
  const [linkText, setLinkText] = useState('')

  const formSubmit = async (e) => {
    console.log(e)
    e.preventDefault();
    try {
      const res = await axios.post('http://localhost:4000/auth/sendlink', { email: email })
      console.log(res)
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
    <Container>
      <div className='login-box'>
        <input placeholder="Email" value={email} onInput={e => setEmail(e.target.value)} onKeyPress={keyPress}/>
        <button onClick={formSubmit}>Submit</button>
        <a href={link}>{linkText}</a>
        <div>{message}</div>
      </div>
    </Container>
  );
}

export default Login;
