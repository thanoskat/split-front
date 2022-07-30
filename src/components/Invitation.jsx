import { useState, useEffect, useRef } from 'react'
import useAxios from '../utility/useAxios'
import store from '../redux/store'
import IonIcon from '@reacticons/ionicons'
import { QRCodeSVG } from 'qrcode.react'

function Invitation({ setSearchParams }) {

  const api = useAxios()
  const userId = store.getState().authReducer.sessionData.userId
  const selectedGroup = store.getState().mainReducer.selectedGroup
  const abortControllerRef = useRef(new AbortController())
  const [isLoading, setLoading] = useState(false)
  const [invitationLink, setInvitationLink] = useState('')

  const ref=useRef(null)

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
    // eslint-disable-next-line
  }, [])

  // const closeWindow = () => {
  //   window.history.go(-1)
  // }
  const copyToClipBoard = async (copyMe) => {
    try {
      await navigator.clipboard.writeText(copyMe);
      
    } catch (err) {
      console.log(err)
    }
  };

  
  return (
    <div className='flex column fixed' style={{ bottom: '0px', width: '100%', height: '100%', backgroundColor: 'var(--layer-0-color)' }}>
      {isLoading && <div className='invitationLoading flex alignself-center'>
        <IonIcon name='sync' className='spin' size={50} />
      </div>}
      {!isLoading &&
        <div className='flex column padding1010 gap10' style={{ height: '100%' }}>
          <div className='flex row t1 gap10'>
            <div className='pointer' onClick={() => setSearchParams({})}>
              <i className='arrow left icon' />
            </div>
            <div>Invitation</div>
          </div>
          <div className='flex column alignitems-center t3 gap10' style={{ justifyContent: 'center', height: '100%' }}>
            <div>Scan QR</div>
            <QRCodeSVG
              value={invitationLink}
              size={window.innerWidth / 1.5}
              level='L'
              bgColor='var(--light-color)'
              fgColor='var(--layer-0-color)'
              includeMargin={true}
            />
            <div className='t1'>OR</div>
            <div>Share the invitation link</div>
            <div className='flex row selectable gap10'>
              <div className='alignself-center'>
                {invitationLink}
              </div>
              <div style={{fontSize:"30px"}} className="pointer alignself-center" onClick={()=>copyToClipBoard(invitationLink)}>
              <svg xmlns="http://www.w3.org/2000/svg" aria-hidden="true" role="img" width="1em" height="1em" preserveAspectRatio="xMidYMid meet" viewBox="0 0 24 24"><path fill="currentColor" d="M14 8H4c-1.103 0-2 .897-2 2v10c0 1.103.897 2 2 2h10c1.103 0 2-.897 2-2V10c0-1.103-.897-2-2-2z"/><path fill="currentColor" d="M20 2H10a2 2 0 0 0-2 2v2h8a2 2 0 0 1 2 2v8h2a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2z"/></svg>
              </div>
            </div>
            <div className='pointer pill' onClick={regenInvitation}>Regen</div>
          </div>
        </div>}
    </div>
  )
}

export default Invitation
