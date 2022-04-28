import { useState, useEffect } from 'react'
import axios from 'axios'
// import { AuthenticationContext } from '../contexts/AuthenticationContext'
import { useHistory } from "react-router-dom";

import { useDispatch } from 'react-redux'
import { signIn } from '../redux/authSlice'

const VerifyLink = ({ match }) => {

  const dispatch = useDispatch()

  const history = useHistory();
  // const { signIn } = useContext(AuthenticationContext);
  const [data, setData] = useState('')

  const verifyLinkToken = async () => {
    try {
      const response = await axios.get(`http://localhost:4000/auth/v/${match.params.token}`, { withCredentials: true })
      // signIn(response.data.accessToken, response.data.sessionData)
      dispatch(signIn({accessToken: response.data.accessToken, sessionData: response.data.sessionData}))
      setData('Redirecting !!')
      history.push('/expenses');
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
