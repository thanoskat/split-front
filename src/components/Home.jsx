import React from 'react'
import { useState, useEffect, useRef } from 'react'
import useAxios from '../utility/useAxios'
import { Link } from 'react-router-dom'
import IonIcon from '@reacticons/ionicons'
import store from '../redux/store'
import { useNavigate, useLocation } from 'react-router-dom'
import { CreateNewGroup, QRScanner, UserOptions } from '.'
import { CSSTransition } from 'react-transition-group'
import { useDispatch } from 'react-redux'
import { signOut } from '../redux/authSlice'

export default function Home() {

  const api = useAxios()
  const navigate = useNavigate()
  const location = useLocation()
  const abortControllerRef = useRef(null)
  const [groupList, setGroupList] = useState()
  const [isLoading, setIsloading] = useState(false)
  const sessionData = store.getState().authReducer.sessionData
  // const [searchParams, setSearchParams] = useSearchParams()
  const [menu, setMenu] = useState(null)
  const dispatch = useDispatch()

  const getGroups = async () => {
    setIsloading(true)
    try {
      const response = await api.get('/groups/mygroups', { signal: abortControllerRef.current.signal });
      setGroupList(response.data)
      setIsloading(false)
    }
    catch (error) {
      setIsloading(false)
    }
  }

  useEffect(() => {
    window.addEventListener('popstate', () => {
      setMenu(null)
    })
    abortControllerRef.current = new AbortController()
    getGroups()
    return () => {
      window.removeEventListener('popstate', () => {
        setMenu(null)
      })
      abortControllerRef.current.abort()
    }
    // eslint-disable-next-line
  }, [])

  const logoutClick = async () => {
    console.log('onLogoutClick')
    try {
      await api.post('/auth/signout', { sessionID: sessionData.id }, { withCredentials: true })
    } catch (error) {
      console.dir(error)
    }
    dispatch(signOut())
    // signOut()
  }

  const openMenu = (menuName) => {
    navigate(location.pathname, { replace: false })
    setMenu(menuName)
  }

  return (
    <div className='flex column' style={{height:"100%"}}>
      <div id='homepage' className='flex column ' style={{ color: 'var(--light-color)' }}>
        <div className='flex column'>
          <div className='logo t05 flex alignitems-center justcont-spacebetween '>
            <div>
              αSplit
            </div>
            <div className='flex row alignitems-center' style={{ gap: '14px' }}>
              <svg
                className='pointer'
                style={{ fontSize: '32px' }}
                onClick={() => openMenu('qrScanner')}
                xmlns='http://www.w3.org/2000/svg' aria-hidden='true' role='img' width='1em' height='1em' preserveAspectRatio='xMidYMid meet' viewBox='0 0 24 24'
              ><path fill='currentColor' d='M8 21H4a1 1 0 0 1-1-1v-4a1 1 0 0 0-2 0v4a3 3 0 0 0 3 3h4a1 1 0 0 0 0-2Zm14-6a1 1 0 0 0-1 1v4a1 1 0 0 1-1 1h-4a1 1 0 0 0 0 2h4a3 3 0 0 0 3-3v-4a1 1 0 0 0-1-1ZM20 1h-4a1 1 0 0 0 0 2h4a1 1 0 0 1 1 1v4a1 1 0 0 0 2 0V4a3 3 0 0 0-3-3ZM2 9a1 1 0 0 0 1-1V4a1 1 0 0 1 1-1h4a1 1 0 0 0 0-2H4a3 3 0 0 0-3 3v4a1 1 0 0 0 1 1Zm8-4H6a1 1 0 0 0-1 1v4a1 1 0 0 0 1 1h4a1 1 0 0 0 1-1V6a1 1 0 0 0-1-1ZM9 9H7V7h2Zm5 2h4a1 1 0 0 0 1-1V6a1 1 0 0 0-1-1h-4a1 1 0 0 0-1 1v4a1 1 0 0 0 1 1Zm1-4h2v2h-2Zm-5 6H6a1 1 0 0 0-1 1v4a1 1 0 0 0 1 1h4a1 1 0 0 0 1-1v-4a1 1 0 0 0-1-1Zm-1 4H7v-2h2Zm5-1a1 1 0 0 0 1-1a1 1 0 0 0 0-2h-1a1 1 0 0 0-1 1v1a1 1 0 0 0 1 1Zm4-3a1 1 0 0 0-1 1v3a1 1 0 0 0 0 2h1a1 1 0 0 0 1-1v-4a1 1 0 0 0-1-1Zm-4 4a1 1 0 1 0 1 1a1 1 0 0 0-1-1Z' /></svg>
              <div className='shadow logout-button flex relative alignitems-center ' onClick={() => openMenu('userOptions')}>
                {sessionData.userNickname}
              </div>
            </div>
          </div>
          <div className='welcomemsg whiteSpace-initial'>
            Welcome {sessionData.userNickname}, what would you like to do?
          </div>
        </div>

        <div className='flex flex-1 column justcont-spacebetween' style={{ height:"0%" }}>
          <div className='flex  column overflow-auto' style={{ padding: "0 0.8rem 1rem 0.8rem", borderRadius: "10px", backgroundColor: 'var(--layer-1-color)', borderColor: 'var(--layer-1-color)', borderStyle: 'solid' }}>
            {groupList?.length === 0 ? <div className='flex' style={{ whiteSpace: 'initial', textAlign: 'center', alignSelf: 'center', justifySelf: 'center' }}>
              It looks like you are not a member of a group at the moment. Follow the invitation link other members might have sent you or scan their QR code in order to join a group
            </div> :
              <div className='sticky' style={{ top: "0px", padding: "1rem 1rem 1rem 0 ", backgroundColor: "#1f1f22" }}>
                Return to a group
              </div>}
            <div className='whiteSpace-initial '>
              <div className='flex  column gap4 padding4' >
                {isLoading && <IonIcon name='sync' className='t3 spin alignself-center' style={{ fontSize: '20px' }} />}
                {groupList?.map((group) => (
                  <Link
                    key={group._id}
                    to={`/${group._id}/expenses`}
                    className='group-selector-button medium flex row overflow-hidden alignitems-center t3 padding1812 pointer shadow justcont-center'>
                    {group.title}
                    <div className='regular flex row t3 gap6 alignitems-center'>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>



          {groupList?.length !== 0 && <div className='or flex justcont-center alignitems-center' style={{ color: 'var(--light-color)' }}>OR</div>}
          {groupList?.length === 0 && <div>&nbsp;</div>}

          <div style={{ padding: '0 0 2rem 0' }}>

            <div className='shadow createnewgroup-button flex justcont-center relative alignitems-center' onClick={() => openMenu('newGroup')}>Create new group</div>

          </div>
        </div>
        <CSSTransition
          onClick={() => setMenu(null)}
          in={Boolean(menu)}
          timeout={0}
          unmountOnExit
        >
          <div style={{
            position: 'fixed',
            left: '0px',
            top: '0px',
            height: '100%',
            width: '100%',
            backgroundColor:
              'black',
            opacity: '0.7'
          }}
          />
        </CSSTransition>

      </div>
      <CSSTransition
        in={menu === 'newGroup'}
        timeout={300}
        classNames='leftslide'
        unmountOnExit
      >
        <CreateNewGroup openMenu={openMenu} />
      </CSSTransition>

      <CSSTransition
        in={(menu === 'qrScanner')}
        timeout={100}
        classNames='bottomslide'
        unmountOnExit
      >
        <QRScanner />

      </CSSTransition>
      <CSSTransition
        in={menu === 'userOptions'}
        timeout={100}
        classNames='bottomslide'
        unmountOnExit
      >
        <UserOptions openMenu={openMenu} />
      </CSSTransition>
    </div>
  )
}
