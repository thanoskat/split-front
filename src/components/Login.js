import './login.css'
import { useState } from 'react'
import axios from 'axios'
import { Container } from './'
// import { Form, Button, Input, Modal } from 'semantic-ui-react'

const Login = () => {

  const [email, setEmail] = useState('')
  const [message, setMessage] = useState('')

  const formSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('http://localhost:4000/auth/sendlink', { email: email })
      console.log(res.data.link)
      if(res && res.data){
        setMessage(res.data.link)
      }
    }
    catch (error) {
      setMessage(error.message)
    }
  }

  return (
    <Container>
      <div className='login-box'>
        <input placeholder="Email" value={email} onInput={e => setEmail(e.target.value)}/>
        <button onClick={formSubmit}>Submit</button>
        <a href={message}>Click me!</a>
      </div>
    </Container>
  );
}

export default Login;