import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import axios from 'axios'

const VerifySignUpToken = () => {

  const { token } = useParams()
  const [loading, setLoading] = useState(true)
  const [linkIsValid, setLinkIsValid] = useState(false)

  const verifyTokenParam = async () => {
    try {
      await axios.post(`${process.env.REACT_APP_APIURL}/auth/verify-sign-up-token`, { token: token })
      setLinkIsValid(true)
    }
    catch(error) {
      console.log(error.message)
    }
    finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    verifyTokenParam()
    // eslint-disable-next-line
  },[])

  return (
    <div>
      {loading && <div>LOADING!</div>}
      {!loading &&
      <div>
        <div>Link is valid: {linkIsValid.toString()}</div>
      </div>
      }
    </div>
  )
}

export default VerifySignUpToken
