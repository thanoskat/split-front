import { useState, useEffect, useContext } from 'react'
import axios from 'axios'
import { AuthenticationContext } from './AuthenticationContext'
import { useHistory } from "react-router-dom";

const VerifyLink = ({ match }) => {

  const history = useHistory();
  const { signIn } = useContext(AuthenticationContext);
  const [data, setData] = useState('')

  const verifyLinkToken = async () => {
    try{
      const response = await axios.get(`http://localhost:4000/auth/v/${match.params.token}`, { withCredentials: true })
      signIn(response.data.accessToken, response.data.sessionID)
      setData(response.data.accessToken)
      // history.push('/profile');
    }
    catch(error){
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
