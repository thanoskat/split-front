import { TabSwitcher, UserBar, GroupSelector2, AddExpense2 } from '.'
import { useState, useEffect, useRef } from 'react'
import { useLocation, Link, Outlet, useSearchParams } from 'react-router-dom'
import IonIcon from '@reacticons/ionicons';
import useAxios from '../utility/useAxios'
import populateLabels from '../utility/populateLabels'
import { useDispatch, useSelector } from 'react-redux'
import { setCurrentMenu, setGroupList, setSelectedGroup } from '../redux/mainSlice'
import { TransitionGroup, CSSTransition } from 'react-transition-group'

const FigmaMain = () => {

  const currentPath = `${useLocation().pathname}`
  const dispatch = useDispatch()
  const api = useAxios()
  const displayedGroup = useSelector(state => state.mainReducer.selectedGroup)
  const [isLoading, setLoading] = useState(false)
  const [mainIsLoading, setMainIsLoading] = useState(false)
  const [searchParams, setSearchParams] = useSearchParams()
  const abortControllerRef = useRef(new AbortController())

  const getFirstGroup = async () => {
    try {
      setMainIsLoading(true)
      const response = await api.get('/groups/mygroups', { signal: abortControllerRef.current.signal });
      console.log("/groups", response.data)
      setMainIsLoading(false)
      dispatch(setSelectedGroup(populateLabels(response.data[0])))
    } catch (err) {
      setMainIsLoading(false)
    }
  }

  const getGroups = async () => {
    try {
      setLoading(true)
      abortControllerRef.current.abort()
      abortControllerRef.current = new AbortController()
      const res = await api.get('/groups/mygroups', { signal: abortControllerRef.current.signal });
      console.log("/groups/mygroups", res.data)
      dispatch(setGroupList(res.data))
      dispatch(setCurrentMenu('groupSelector'))
      setLoading(false)
    }
    catch (error) {
      setLoading(false)
      console.log(error.message)
    }
  }

  useEffect(() => {
    getFirstGroup()
  // eslint-disable-next-line
  }, [])

  const openGroupSelector = async () => {
    if (!isLoading) {
      await getGroups()
    }
  }

  return (
    <div className='flex column overflow-auto figma-main'>
      {mainIsLoading ?
        <div className='mainIsLoading flex alignself-center'>
          <IonIcon name='sync' className='spin' size={50} />
        </div>
        :
        <div className='flex column overflow-auto figma-main'>
          <UserBar />
          <div className='separator-1' />
          <div className='t1 group-info-frame medium flex row alignitems-center'>
            <div className='flex row alignitems-center gap8 pointer' onClick={openGroupSelector}>
              <span>{displayedGroup?.title}</span>
              {!isLoading && <IonIcon name='caret-down' className='t2' />}
              {isLoading && <IonIcon name='sync' className='t2 spin' />}
            </div>
            <div className='flex row gap10 alignitems-center'>
              <Link to={`${currentPath}/invitation`}>
                <IonIcon name='person-add-sharp' className='group-options-icon pointer t2'/>
              </Link>
              <IonIcon name='settings-sharp' className='group-options-icon pointer t2' onClick={() => setSearchParams({menu: 'groups'})} />
              <IonIcon name='settings-sharp' className='group-options-icon pointer t2' onClick={() => dispatch(setCurrentMenu('groupOptions'))} />
            </div>
          </div>
          <div className='separator-1' />
          <TabSwitcher />
          {/* <Routes>
            <Route path="/expenses" element={
              <TabExpenses expenses={displayedGroup?.expenses} members={displayedGroup?.members} />
            }>
            </Route>
            <Route path="/members" element={<TabMembers />} />
            <Route path="/settleup" element={<TabSettleUp />} />
          </Routes> */}
          <Outlet />

          <div onClick={() => setSearchParams({menu: 'newexpense'})}>
            <div className='floating-button pointer flex row shadow justcont-center alignitems-center'>
              <IonIcon name='add' className='floating-button-icon' />
              <div className='floating-button-text'>New</div>
            </div>
          </div>
        </div>
      }
      <CSSTransition
        onClick={() => setSearchParams({})}
        in={(searchParams.get('menu'))}
        timeout={0}
        unmountOnExit
      >
        <div style={{position: 'fixed', height: '100vh', width: '100%', backgroundColor: 'black', opacity: '0.7'}} />
      </CSSTransition>
      <CSSTransition
        in={(searchParams.get('menu') === 'groups')}
        timeout={300}
        classNames='slider'
        unmountOnExit
      >
        <GroupSelector2 />
      </CSSTransition>
      <CSSTransition
        in={(searchParams.get('menu') === 'newexpense')}
        timeout={300}
        classNames='slider'
        unmountOnExit
      >
        <AddExpense2 />
      </CSSTransition>
    </div>
  )
}

export default FigmaMain;
