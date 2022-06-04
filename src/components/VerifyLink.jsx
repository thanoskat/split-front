import { useState, useEffect } from 'react'
import { Navigate, useParams } from 'react-router-dom';
import axios from 'axios'

import { useDispatch } from 'react-redux'
import { signIn } from '../redux/authSlice'

const VerifyLink = () => {

  const dispatch = useDispatch()
  const { token } = useParams()
  const [data, setData] = useState('')

  const verifyLinkToken = async () => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_APIURL}/auth/v/${token}`, { withCredentials: true })
      dispatch(signIn({accessToken: response.data.accessToken, sessionData: response.data.sessionData}))
      setData('Redirecting !!')
      setData(<Navigate to='/' />)
    }
    catch(error) {
      console.dir(error)
      setData(error.message)
    }
  }

  useEffect(() => {
    verifyLinkToken()
    // eslint-disable-next-line
  },[])

  return (
    <div>
    {data}
    </div>
  );
}

export default VerifyLink;
