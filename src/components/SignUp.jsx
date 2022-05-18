import { useState } from 'react'
import axios from 'axios'

const SignUp = () => {

  const [email, setEmail] = useState('')
  const [nickname, setNickname] = useState('')
  const [emailError, setEmailError] = useState(false)
  const [nicknameError, setNicknameError] = useState(false)
  const [loading, setLoading] = useState(false)

  const formSubmit = async () => {
    // setEmailError({
    //   content: 'Please enter a valid email address',
    //   pointing: 'below',
    // })
    try {
      setLoading(true)
      const res = await axios.post(`${process.env.REACT_APP_APIURL}/auth/signup`, { email: email, nickname: nickname })
      console.dir(res)
      setEmailError(false)
      setNicknameError(false)
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
      if (error.response.data.nickname) {
        setNicknameError({
          content: error.response.data.nickname,
          pointing: 'above'
        })
      }
      else {
        setNicknameError(false)
      }
      setLoading(false)
    }
  }

  return (
    <div>
      <form onSubmit={formSubmit}>
        <input
          placeholder='Email'
          onChange={e => setEmail(e.target.value)}>
        </input>

        <input
          placeholder='Nickname'
          onChange={ e => setNickname(e.target.value)}>
        </input>
        <button type='submit'>
          Sign Up
        </button>
      </form>

    </div>

    // <Form onSubmit={formSubmit} loading={loading}>
    //   <Form.Field
    //     fluid
    //     control={Input}
    //     label='Email'
    //     placeholder='Email'
    //     onChange={e => setEmail(e.target.value)}
    //     error={emailError}>
    //   </Form.Field>
    //   <Form.Field
    //     fluid
    //     control={Input}
    //     label='Nickname'
    //     placeholder='Nickname'
    //     onChange={e => setNickname(e.target.value)}
    //     error={nicknameError}>
    //   </Form.Field>
    //   <Form.Field>
    //     <Checkbox label='I agree to the Terms and Conditions'/>
    //   </Form.Field>
    //   <Button type='submit' color="green">Sign Up</Button>
    // </Form>
  )
}

export default SignUp;
