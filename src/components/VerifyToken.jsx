import { useState, useEffect } from 'react'
import IonIcon from '@reacticons/ionicons'
import { useParams } from 'react-router-dom'
import { Header } from '.'
import axios from 'axios'

const VerifyToken = () => {

  const { token } = useParams()
  const [loading, setLoading] = useState(true)
  const [type, setType] = useState()
  const [errorMessage, setErrorMessage] = useState('')

  const verifyTokenParam = async () => {
    try {
      const res = await axios.post(`${process.env.REACT_APP_APIURL}/auth/verify-token`, { token: token })
      setType(res.data.type)
    }
    catch(error) {
      if(error.response) {
        setErrorMessage(error.response.data?.message)
      }
      else {
        setErrorMessage(error.message)
      }
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
    <div id='loginpage' className='flex column' style={{ color: 'var(--light-color)' }}>
      <Header />
      <div className='loginBox flex column alignitems-center' style={{ gap: '14px', backgroundColor: 'var(--layer-1-color)', borderColor: 'var(--layer-1-color)', borderStyle: 'solid' }}>
        {loading && <IonIcon name='sync' className='t1 spin' />}
        {!loading && !errorMessage && type === 'sign-in' &&
        <div className='flex column alignitems-center t4'>
          <IonIcon name='checkmark-sharp' className='t1' style={{ color: 'var(--green)' }} />
          <div>You have successfully signed in.</div>
          <div>You can close this page</div>
        </div>}
        {!loading && !errorMessage && type === 'sign-up' &&
        <div className='flex column alignitems-center t4'>
          <IonIcon name='checkmark-sharp' className='t1' style={{ color: 'var(--green)' }} />
          <div>Your account has been created!</div>
          <div>You can close this tab.</div>
        </div>}
        {!loading && errorMessage &&
        <div className='flex column alignitems-center t4' style={{ width: '100%', overflow: 'hidden' }}>
          <IonIcon name='close' className='t1' style={{ color: 'var(--pink)' }} />
          <div style={{ whiteSpace: 'pre-wrap', textAlign: 'center' }}>{errorMessage}</div>
        </div>}
    </div>
    </div>
  )
}

export default VerifyToken
