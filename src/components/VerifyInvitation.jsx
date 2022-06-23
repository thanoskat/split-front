import { useState, useEffect, useRef } from 'react'
import { Link, useParams } from 'react-router-dom'
import useAxios from '../utility/useAxios'

const VerifyInvitation = () => {

  const params = useParams()
  const api = useAxios()
  const abortControllerRef = useRef(new AbortController())
  const [invitationAccepted, setInvitationAccepted] = useState(false)
  const [data, setData] = useState()

  const verifyInvitation = async () => {
    try {
      abortControllerRef.current.abort()
      abortControllerRef.current = new AbortController()
      const res = await api.post('/invitation/verify', {
        code: `${params.invitationCode}`
      },
      { signal: abortControllerRef.current.signal })

      setData(res.data)

      console.log('/invitation/verify', res.status, res.data.message)
      console.log(res.data)
    }
    catch (error) {
      setData(error.response.data)
      console.log('/invitation/verify', error.response.status, error.response.data)
    }

  }

  const acceptInvitation = async () => {
    try {
      abortControllerRef.current.abort()
      abortControllerRef.current = new AbortController()
      const res = await api.post('/invitation/accept', {
        code: `${params.invitationCode}`
      },
      { signal: abortControllerRef.current.signal })
      //setData(`You joined ${res.data.groupTitle}`)
      setInvitationAccepted(true)
      console.log('/invitation/accept', res.status, res.data.message)
    }
    catch (error) {
     // setData(error.response.data)
      console.log('/invitation/accept', error.response.status, error.response.data)
    }
  }

  useEffect(() => {
    verifyInvitation()
    // eslint-disable-next-line
  },[])

  return (
    <div className='flex column'>
    

      {!invitationAccepted &&
      <button onClick={acceptInvitation}>
        Accept
      </button>}

      {invitationAccepted &&
      <Link to={`/${data.groupId}/expenses`}>
          Go to main page
      </Link>}
    </div>
  )
}

export default VerifyInvitation;
