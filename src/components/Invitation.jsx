import { useState, useEffect, useRef } from 'react'
import useAxios from '../utility/useAxios'
import store from '../redux/store'
import IonIcon from '@reacticons/ionicons'
import { QRCodeSVG } from 'qrcode.react'

function Invitation({ openMenu }) {

  const api = useAxios()
  const userId = store.getState().authReducer.sessionData.userId
  const selectedGroup = store.getState().mainReducer.selectedGroup
  const abortControllerRef = useRef(new AbortController())
  const [isLoading, setLoading] = useState(false)
  const [invitationLink, setInvitationLink] = useState('')
  const [copyButtonText, setCopyButtonText] = useState('Copy')

  const copyToClipboard = (content) => {
    try {
      const el = document.createElement('textarea')
      el.value = content
      document.body.appendChild(el)
      el.select()
      document.execCommand('copy')
      document.body.removeChild(el)
      setCopyButtonText('Copied!')
    }
    catch(error) {
      setCopyButtonText('Error while copying!')
    }
    finally {
      setTimeout(() => {
        setCopyButtonText('Copy')
      }, 2000);
    }
  }

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
      console.log('getInvitation', error.message)
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
      console.log('regenInvitation', error.message)
    }
    finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    getInvitation()
  // eslint-disable-next-line
  }, [])

  return (
    <div className='flex column fixed' style={{ bottom: '0px', width: '100%', height:'100%', backgroundColor: '#17181d' }}>
      {isLoading && <div className='invitationLoading flex alignself-center'>
        <IonIcon name='sync' className='spin' size={50} />
      </div>}
      {!isLoading &&
      <div className='flex column padding1010 gap10' style={{ height: '100%' }}>
        <div className='flex row t1 gap10'>
          <div className='pointer' onClick={() => openMenu(null)}>
            <i className='arrow left icon' />
          </div>
          <div>Invitation</div>
        </div>
        <div className='flex column alignitems-center t3 gap10' style={{ justifyContent: 'center', height: '100%' }}>
          <div>Scan QR</div>
          <QRCodeSVG
            value={invitationLink}
            size={window.innerWidth/1.5}
            level='L'
            bgColor='var(--light-color)'
            fgColor='var(--layer-0-color)'
            includeMargin={true}
          />
          <div className='t1'>OR</div>
          <div>Share the invitation link:</div>
          <div className='flex row alignitems-center' style={{ padding: '14px 0px' }}>
            <div className='selectable' style={{ color: 'white' }}>{invitationLink}</div>
          </div>
          <div className='flex row' style={{ gap: '14px' }}>
            <div className='pointer pill' onClick={regenInvitation}>
              <svg xmlns="http://www.w3.org/2000/svg" aria-hidden="true" role="img" width="1em" height="1em" preserveAspectRatio="xMidYMid meet" viewBox="0 0 24 24"><g fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"><path d="M22 12c0 6-4.39 10-9.806 10C7.792 22 4.24 19.665 3 16m-1-4C2 6 6.39 2 11.806 2C16.209 2 19.76 4.335 21 8"/><path d="m7 17l-4-1l-1 4M17 7l4 1l1-4"/></g></svg>
              <div>Regen</div>
            </div>
            <div
              className='pointer pill' onClick={() => copyToClipboard(invitationLink)}
            >
              <svg xmlns="http://www.w3.org/2000/svg" aria-hidden="true" role="img" width="1em" height="1em" preserveAspectRatio="xMidYMid meet" viewBox="0 0 24 24"><g fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"><path d="M8 4v12a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V7.242a2 2 0 0 0-.602-1.43L16.083 2.57A2 2 0 0 0 14.685 2H10a2 2 0 0 0-2 2Z"/><path d="M16 18v2a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V9a2 2 0 0 1 2-2h2"/></g></svg>
              {copyButtonText}
            </div>
          </div>
        </div>
      </div>}
    </div>
  )
}

export default Invitation
