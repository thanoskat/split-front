import { useState } from 'react'
import axios from 'axios'
import { Form, Button, Input, Grid, Segment } from 'semantic-ui-react'

const Login = () => {

  const [email, setEmail] = useState('')
  const [message, setMessage] = useState('')

  const formSubmit = async (e) => {
    e.preventDefault();
    try{
      const res = await axios.post('http://localhost:4000/auth/sendlink', { email: email })
      console.log(res.data.link)
      if(res && res.data){
        setMessage(res.data.link)
      }
    }
    catch(error){
      setMessage(error.message)
    }
  }

  return (
    <Grid centered>
      <Segment>
        <Form style={{ width:"300px" }} onSubmit={formSubmit}>
          <Form.Field
            fluid
            control={Input}
            label='Email'
            placeholder='Email'
            onChange={e => setEmail(e.target.value)}>
          </Form.Field>
          <Button type='submit'>Submit</Button>
        </Form>{message ? <a href={message}>Click me!</a> : <></>}
      </Segment>
    </Grid>
  );
}

export default Login;
