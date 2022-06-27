import { useState, useEffect, useRef } from 'react'
import { Link, useParams,  useNavigate } from 'react-router-dom'
import useAxios from '../utility/useAxios'


const VerifyInvitation = () => {

  const params = useParams()
  const api = useAxios()
  const abortControllerRef = useRef(new AbortController())
  const [invitationAccepted, setInvitationAccepted] = useState(false)
  const [askforReview, setAskforReview] = useState(false)
  const [data, setData] = useState()

  const navigate = useNavigate()

  // console.log(data)
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
      const members = res.data.members
      const expenses = res.data.expenses

      for (let i = 0; i < expenses.length; i++) {
        if (expenses[i].splitEqually === true && expenses[i].participants.length === members.length) {
          setAskforReview(true)
          break;
        }
      }
    }
    catch (error) {
      console.log('/invitation/verify', error.response?.status, error.response?.data)
      //setData(error.response?.data)
      //console.log('/invitation/verify', error.response?.status, error.response?.data)
    }


  }

  const acceptInvitation = async () => {

    try {
      abortControllerRef.current.abort()
      abortControllerRef.current = new AbortController()
      // const res = await api.post('/invitation/accept', {
      //   code: `${params.invitationCode}`
      // },
      //   { signal: abortControllerRef.current.signal })
      //setData(`You joined ${res.data.groupTitle}`)
      //console.log('/invitation/accept', res.status, res.data.message)
      //setInvitationAccepted(true)
      if (askforReview) {
        navigate('review', { replace: true })
      }else return
    }
    catch (error) {
      // setData(error.response.data)
      console.log('/invitation/accept', error.response.status, error.response.data)
    }
  }

  useEffect(() => {
    verifyInvitation()
    // eslint-disable-next-line
  }, [])

  return (
    <div id="homepage" className=' flex column ' style={{ color: "var(--light-color)" }}>
      <div className='logo t66 flex alignitems-center justcont-spacebetween '>
        <div  >
          α
        </div>
      </div>
      <div className='padding3rem3rem'></div>
      <div className='loginBox flex column ' style={{ backgroundColor: "var(--layer-1-color)", borderColor: "var(--layer-1-color)", borderStyle: "solid" }}>
        <div className='whiteSpace-initial'>
          <div className='flex column gap4 padding4'>
            <div>Kristi has invited you to join <strong>{data?.groupTitle}</strong></div>
            <div className='flex column gap4 padding1812'>
              <div onClick={acceptInvitation} style={{ backgroundColor: "var(--label-color-6)" }} className="accept-reject medium flex row overflow-hidden alignitems-center t3 padding1812 pointer shadow justcont-center">
                Accept
              </div>
              <Link
                style={{ backgroundColor: "var(--lightpink)" }}
                className="accept-reject medium flex row overflow-hidden alignitems-center t3 padding1812 pointer shadow justcont-center"
                to={"/"}>
                Reject
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default VerifyInvitation;

{/* {invitationAccepted &&
        <Link to={`/${data.groupId}/expenses`}>
          Go to main page
        </Link>}
    </div> */}