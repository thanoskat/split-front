import { useState } from 'react'
import { Form, Checkbox, Button, Grid } from 'semantic-ui-react'

const SignUp = () => {

  const [email, setEmail] = useState('')
  const [nickname, setNickname] = useState('')



  return(
    <Grid centered>
      <Form>
        <Form.Field>
          <label>Email</label>
          <input placeholder='Email' />
        </Form.Field>
        <Form.Field>
          <label>Nickname</label>
          <input placeholder='Nickname' />
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
