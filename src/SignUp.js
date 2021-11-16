import { useState } from 'react'
import { Form, Checkbox, Button, Grid, Label } from 'semantic-ui-react'

const SignUp = () => {

  const [email, setEmail] = useState('')
  const [nickname, setNickname] = useState('')
  const [text, setText] = useState('')

  return(
    <Grid centered>
      <Form>
        <Form.Field>
          <label>Email</label>
          <Form.Input placeholder='Email' onChange={e => setEmail(e.target.value)}/>
        </Form.Field>
        <Form.Field>
          <label>Nickname</label>
          <Form.Input placeholder='Nickname' onChange={e => setNickname(e.target.value)}/>
        </Form.Field>
        <Form.Field>
          <Checkbox label='I agree to the Terms and Conditions' />
        </Form.Field>
        <Button type='submit'>Submit</Button>
      </Form>
    </Grid>
  )
}

export default SignUp;
