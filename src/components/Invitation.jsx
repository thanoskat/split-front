import { useState, useEffect, useRef } from 'react'
import useAxios from '../utility/useAxios'
import store from '../redux/store'
import IonIcon from '@reacticons/ionicons'
import { QRCodeSVG } from 'qrcode.react';

function Invitation() {

  const api = useAxios()
  const userId = store.getState().authReducer.sessionData.userId
  const selectedGroup = store.getState().mainReducer.selectedGroup
  const abortControllerRef = useRef(new AbortController())
  const [isLoading, setLoading] = useState(false)
  const [invitationLink, setInvitationLink] = useState('')

  const getInvitation = async () => {
    setLoading(true)
    try {
      abortControllerRef.current.abort()
      abortControllerRef.current = new AbortController()
      const res = await api.post('/invitation/create', {
        inviter: userId,
        group: selectedGroup._id
      },
      { signal: abortControllerRef.current.signal })
      const invitationCode = res.data.code
      console.log('/groups/createinvitation', invitationCode)
      setInvitationLink(`${process.env.REACT_APP_FRONTURL}/i/${invitationCode}`)
    }
    catch (error) {
      console.log('error::', error.message)
    }
    finally {
      setLoading(false)
    }
  }

  const regenInvitation = async () => {
    setLoading(true)
    try {
      abortControllerRef.current.abort()
      abortControllerRef.current = new AbortController()
      const res = await api.post('/invitation/regenerate', {
        inviter: userId,
        group: selectedGroup._id
      },
      { signal: abortControllerRef.current.signal })
      const invitationCode = res.data.code
      console.log('/groups/regenerate', invitationCode)
      setInvitationLink(`${process.env.REACT_APP_FRONTURL}/i/${invitationCode}`)
    }
    catch (error) {
      console.log('error::', error.message)
    }
    finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    getInvitation()
  }, [])

  const closeWindow = () => {
    window.history.go(-1)
  }

  return (
    <div className='flex column fixed' style={{bottom: '0px', width: '100%', height:'100vh', backgroundColor: 'var(--layer-0-color)'}}>
      {isLoading && <IonIcon name='sync' className='t1 spin'/>}
      {!isLoading &&
      <div className='flex column padding1010 gap10' style={{height: '100%'}}>
        <div className='flex row t1 gap10'>
          <div className='pointer' onClick={closeWindow}>
            <i className='arrow left icon' />
          </div>
          <div>Invitation</div>
        </div>
        <div className='flex column alignitems-center t3 gap10' style={{justifyContent: 'center', height: '100%'}}>
          <div>Scan QR</div>
          <QRCodeSVG
            value={invitationLink}
            size='256'
            level='Q'
            bgColor='var(--layer-0-color)'
            fgColor='var(--light-color)'
            includeMargin={false}
          />
          <div className='t1'>OR</div>
          <div>Share the invitation link</div>
          <div className='selectable'>{invitationLink}</div>
          <div className='pointer pill' onClick={regenInvitation}>Regen</div>
        </div>
      </div>}
    </div>
  )
}

export default Invitation
