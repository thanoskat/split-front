import { useState, useEffect, useContext } from 'react'
import axios from 'axios'
import { AuthenticationContext } from './AuthenticationContext'

const VerifyLink = ({ match }) => {

  const { signIn } = useContext(AuthenticationContext);
  const [data, setData] = useState('')

  useEffect(() => {
    verifyLinkToken()
  },[])

  const verifyLinkToken = async () => {
    try{
      const response = await axios.get(`http://localhost:4000/auth/v/${match.params.token}`, { withCredentials: true })
      signIn(response.data.accessToken, response.data.sessionID)
      setData(response.data.accessToken)
    }
    catch(error){
      setData(error.message)
    }
  }

  return (
    <div>
    {data}
    </div>
  );
}

export default VerifyLink;
