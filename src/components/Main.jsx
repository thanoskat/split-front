import { Transfers, DeleteGroup, GroupOptions, UserOptions, QRScanner, ExpenseOptions, TabSwitcher, UserBar, GroupSelector, AddExpense, NewExpense, DeleteExpense, Invitation, LabelEditor, NavBar, LogoBar,  New, RecordTransfer, NewGuest, NewMember } from '.'
import { useState, useEffect, useRef, useContext, useLayoutEffect } from 'react'
import { Outlet, useSearchParams, useParams, useNavigate, UNSAFE_NavigationContext, useLocation, useNavigationType } from 'react-router-dom'
import IonIcon from '@reacticons/ionicons'
import useAxios from '../utility/useAxios'
import { useDispatch, useSelector } from 'react-redux'
import { setSelectedGroup } from '../redux/mainSlice'
import { CSSTransition } from 'react-transition-group'

const Main = () => {
  const api = useAxios()
  const dispatch = useDispatch()
  const params = useParams()
  const abortControllerRef = useRef(new AbortController())
  const displayedGroup = useSelector(state => state.mainReducer.selectedGroup)
  const [mainIsLoading, setMainIsLoading] = useState(false)
  const [searchParams, setSearchParams] = useSearchParams()
  const navigate = useNavigate()
  const navigationType = useNavigationType()
  const location = useLocation()
  // const navigation = useContext(UNSAFE_NavigationContext).navigator
  const [menu, setMenu] = useState(null)

  console.log(menu)

  useEffect(() => {
    window.addEventListener('popstate', () => {
      setMenu(null)
    })
    abortControllerRef.current = new AbortController()
    getGroup(params.groupid)
    return () => {
      window.removeEventListener('popstate', () => {
        setMenu(null)
      })
      abortControllerRef.current.abort()
    }
    // eslint-disable-next-line
  }, [params.groupid])

  const getGroup = async (id) => {
    setMainIsLoading(true)
    try {
      const res = await api.post('/groups/getgroup', { groupid: id }, { signal: abortControllerRef.current.signal })
      dispatch(setSelectedGroup(res.data))
    }
    catch (error) {
      console.log('/groups/getgroup', error)
    }
    setMainIsLoading(false)
  }

  const openMenu = (menuName) => {
    navigate(location.pathname, { replace: false })
    setMenu(menuName)
  }

  return (
    <div style={{ height: '100%' }} className='flex column'>
      {mainIsLoading &&
      <div className='mainIsLoading flex alignself-center'>
        <IonIcon name='sync' className='spin' size={50} />
      </div>}
      {!mainIsLoading &&
        <div id='main'>
          <div id='main-menu' className='flex column'>
            {/* <UserBar /> */}
            <LogoBar openMenu={openMenu} />
            <div className='t1 medium flex row alignitems-center justcont-spacebetween'>
              <div className='flex row alignitems-center gap8 pointer overflow-hidden' onClick={() => openMenu('groupList')}>
                <span>{displayedGroup?.title}</span>
                {/* <IonIcon name='caret-down' className='t2' /> */}
              </div>
              <div className='flex row gap10 alignitems-center'>
                <div onClick={() => openMenu('newMember')}>
                  <IonIcon name='person-add-sharp' className='group-options-icon pointer t2' />
                </div>
                <IonIcon name='settings-sharp' className='group-options-icon pointer t2' onClick={() => openMenu('groupOptions')} />
                {/* <IonIcon name='scan' className='group-options-icon pointer t2' onClick={() => openMenu('qrScanner')} /> */}
              </div>
            </div>
            {/* <div onClick={() => setSearchParams({menu: 'newexpense'})}>
            <div className='floating-button pointer flex row shadow justcont-center alignitems-center'>
              <IonIcon name='add' className='floating-button-icon' />
              <div className='floating-button-text'>New</div>
            </div>
          </div> */}
          </div>
          {(displayedGroup !== null) && <Outlet />}
          <NavBar openMenu={openMenu} />
        </div>}

      <CSSTransition
        onClick={() => setMenu(null)}
        in={Boolean(menu)}
        timeout={0}
        unmountOnExit
      >
        <div style={{
          position: 'fixed',
          height: '100%',
          width: '100%',
          backgroundColor:
            'black',
          opacity: '0.7'
        }}
        />
      </CSSTransition>

      <CSSTransition
        in={(menu === 'groupList')}
        timeout={100}
        classNames='bottomslide'
        unmountOnExit
      >
        <GroupSelector />
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
        in={(searchParams.get('menu') === 'newexpense2')}
        timeout={100}
        classNames='leftslide'
        unmountOnExit
      >
        <AddExpense setSearchParams={setSearchParams} />
      </CSSTransition>

      <CSSTransition
        in={(menu === 'newTransfer')}
        timeout={100}
        classNames='leftslide'
        unmountOnExit
      >
        <RecordTransfer close={() => setMenu(null)} />
      </CSSTransition>

      <CSSTransition
        in={menu === 'newExpense'}
        timeout={100}
        classNames='leftslide'
        unmountOnExit
      >
        <NewExpense close={() => setMenu(null)}/>
      </CSSTransition>

      <CSSTransition
        in={menu === 'invitation'}
        timeout={100}
        classNames='leftslide'
        unmountOnExit
      >
        <Invitation openMenu={openMenu} />
      </CSSTransition>

      <CSSTransition
        in={menu === 'newGuest'}
        timeout={100}
        classNames='leftslide'
        unmountOnExit
      >
        <NewGuest openMenu={openMenu} />
      </CSSTransition>

      <CSSTransition
        in={menu === 'expenseOptions'}
        timeout={100}
        classNames='bottomslide'
        unmountOnExit
      >
        <ExpenseOptions openMenu={openMenu} />
      </CSSTransition>

      <CSSTransition
        in={menu === 'userOptions'}
        timeout={100}
        classNames='bottomslide'
        unmountOnExit
      >
        <UserOptions openMenu={openMenu} />
      </CSSTransition>

      <CSSTransition
        in={menu === 'deleteExpense'}
        timeout={100}
        classNames='bottomslide'
        unmountOnExit
      >
        <DeleteExpense />
      </CSSTransition>

      <CSSTransition
        in={menu === 'groupOptions'}
        timeout={100}
        classNames='bottomslide'
        unmountOnExit
      >
        <GroupOptions openMenu={openMenu}/>
      </CSSTransition>

      <CSSTransition
        in={menu === 'deleteGroup'}
        timeout={100}
        classNames='bottomslide'
        unmountOnExit
      >
        <DeleteGroup openMenu={openMenu}/>
      </CSSTransition>

      <CSSTransition
        in={menu === 'labelEditor'}
        timeout={100}
        classNames='bottomslide'
        unmountOnExit
      >
        <LabelEditor/>
      </CSSTransition>

      <CSSTransition
        in={menu === 'new'}
        timeout={100}
        classNames='bottomslide'
        unmountOnExit
      >
        <New openMenu={openMenu} />
      </CSSTransition>

      <CSSTransition
        in={menu === 'newMember'}
        timeout={100}
        classNames='bottomslide'
        unmountOnExit
      >
        <NewMember openMenu={openMenu} />
      </CSSTransition>
    </div>
  )
}

export default Main
