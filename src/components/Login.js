import { useState } from 'react'
import axios from 'axios'
import { Form, Button, Input, Modal } from 'semantic-ui-react'
import './login.css';

const Login = () => {

  const [email, setEmail] = useState('')
  const [message, setMessage] = useState('')

  const formSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('http://localhost:4000/auth/sendlink', { email: email })
      setMessage(res.data)
    }
    catch (error) {
      setMessage(error.message)
    }
  }

  return (
    
      <Form style={{ width: "300px" }} onSubmit={formSubmit}>
        <Form.Field
          fluid
          control={Input}
          placeholder='Email'
          onChange={e => setEmail(e.target.value)}>
        </Form.Field>
        <Modal id="loginpopup"
          trigger={<Button type='submit' color="blue">Log In</Button>}
          header='Log In'
          content={message}
          actions={[{ key: 'done', content: 'Done', positive: true }]}
        />
      </Form>
  );
}

export default Login;