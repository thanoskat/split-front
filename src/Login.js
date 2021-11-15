import './App.css';
import { useState } from 'react'
import axios from 'axios'

const Login = () => {

  const [email, setEmail] = useState('')
  const [message, setMessage] = useState('')

  const updateEmail = (e) => {
    setEmail(e.target.value)
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    try{
      console.log(email)
      const res = await axios.post('http://localhost:4000/auth/sendlink', { email: email })
      setMessage(res.data)
    }
    catch(error){
      setMessage(error.message)
    }
  }

  return (
    <form>
      <input type="text" name="email" value={email} onChange={updateEmail}/>
      <button onClick={handleSubmit}>Submit</button>
      <div>
        {message}
      </div>
    </form>
  );
}

export default Login;
