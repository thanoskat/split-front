import { useState, useEffect, useRef } from 'react'
import { Link, useParams, useNavigate } from 'react-router-dom'
import useAxios from '../utility/useAxios'
import store from '../redux/store'
import IonIcon from '@reacticons/ionicons'

const VerifyInvitation = ({ setInitialPath }) => {

  const params = useParams()
  const api = useAxios()
  const abortControllerRef = useRef(new AbortController())
  const [askforReview, setAskforReview] = useState(false)
  const [data, setData] = useState()
  const sessionData = store.getState().authReducer.sessionData
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  //console.log(data)
  const verifyInvitation = async () => {
    setLoading(true)
    try {
      abortControllerRef.current.abort()
      abortControllerRef.current = new AbortController()
      const res = await api.post('/invitation/verify', {
        code: `${params.invitationCode}`
      },
        { signal: abortControllerRef.current.signal })

      setData(res.data)
      const expenses = res.data.group.expenses

      for (let i = 0; i < expenses.length; i++) {
        if (expenses[i].splitEqually === true && !expenses[i].participants.includes(sessionData.id)) {
          setAskforReview(false)
          break;
        }
      }
    }
    catch (error) {
      console.log('/invitation/verify', error.response?.status, error.response?.data)
    }
    setLoading(false)
  }

  const acceptInvitation = async () => {
    try {
      abortControllerRef.current.abort()
      abortControllerRef.current = new AbortController()
      await api.post('/invitation/accept', {
        code: `${params.invitationCode}`
      },
        { signal: abortControllerRef.current.signal })
        setInitialPath("")
        localStorage.removeItem("initialPath")
    }
    catch (error) {
      // setData(error.response.data)
      console.log('/invitation/accept', error.response.status, error.response.data)
    }
    if (askforReview) {
      navigate('review', { replace: true })
    } else navigate(`/${data.group._id}/expenses`)
  }



  useEffect(() => {
    verifyInvitation()
    // eslint-disable-next-line
  }, [])

  const emptyPaths = ()=>{
    setInitialPath("")
    localStorage.removeItem("initialPath")
  }
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
          {loading ?
            <div className='flex justcont-center' style={{ fontSize: "20px" }}>
              <IonIcon name='sync' className='spin' />
            </div> :
            <div className='flex column gap4 padding4'>
              <div>{data?.inviterNickname} has invited you to join <strong>{data?.group.title}</strong></div>

              <div className='flex column gap4 padding1812'>
                <div onClick={acceptInvitation} style={{ backgroundColor: "var(--label-color-6)" }} className="accept-reject medium flex row overflow-hidden alignitems-center t3 padding1812 pointer shadow justcont-center">
                  Accept
                </div>
                <Link
                  onClick={emptyPaths}
                  style={{ backgroundColor: "var(--lightpink)" }}
                  className="accept-reject medium flex row overflow-hidden alignitems-center t3 padding1812 pointer shadow justcont-center"
                  to={"/"}>
                  Reject
                </Link>
              </div>
            </div>
          }
        </div>
      </div>
    </div>
  )
}

export default VerifyInvitation;
