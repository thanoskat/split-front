import { TabSwitcher, UserBar, GroupSelector2, AddExpense2, DeleteExpense, Invitation } from '.'
import { useState, useEffect, useRef } from 'react'
import { useLocation, Link, Outlet, useSearchParams, useParams } from 'react-router-dom'
import IonIcon from '@reacticons/ionicons'
import useAxios from '../utility/useAxios'
import populateLabels from '../utility/populateLabels'
import { useDispatch, useSelector } from 'react-redux'
import { setCurrentMenu, setGroupList, setSelectedGroup } from '../redux/mainSlice'
import { TransitionGroup, CSSTransition } from 'react-transition-group'

const Main = () => {

  const currentPath = `${useLocation().pathname}`
  const dispatch = useDispatch()
  const api = useAxios()
  const displayedGroup = useSelector(state => state.mainReducer.selectedGroup)
  const params = useParams()
  const [isLoading, setLoading] = useState(false)
  const [mainIsLoading, setMainIsLoading] = useState(false)
  const [searchParams, setSearchParams] = useSearchParams()
  const abortControllerRef = useRef(new AbortController())

  useEffect(() => {
    abortControllerRef.current = new AbortController()
    console.log('figma useeffect', params.groupid)
    getGroup(params.groupid)
    return() => {
      abortControllerRef.current.abort()
    }
  // eslint-disable-next-line
  }, [params.groupid])

  const getGroup = async (id) => {
    try {
      const res = await api.post('/groups/getgroup', { groupid: id }, { signal: abortControllerRef.current.signal })
      console.log(res.data)
      const group = populateLabels(window.structuredClone(res.data))
      dispatch(setSelectedGroup(group))
    }
    catch(error) {
      console.log('/groups/getgroup', error)
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
            <div className='flex row alignitems-center gap8 pointer' onClick={() => setSearchParams({menu: 'groups'})}>
              <span>{displayedGroup?.title}</span>
              <IonIcon name='caret-down' className='t2' />
            </div>
            <div className='flex row gap10 alignitems-center'>
              <div onClick={() => setSearchParams({menu: 'invitation'})}>
                <IonIcon name='person-add-sharp' className='group-options-icon pointer t2'/>
              </div>
              <IonIcon name='settings-sharp' className='group-options-icon pointer t2' onClick={() => dispatch(setCurrentMenu('groupOptions'))} />
            </div>
          </div>
          <div className='separator-1' />
          <TabSwitcher />

          {(displayedGroup !== null) && <Outlet />}

          <div onClick={() => setSearchParams({menu: 'newexpense'})}>
            <div className='floating-button pointer flex row shadow justcont-center alignitems-center'>
              <IonIcon name='add' className='floating-button-icon' />
              <div className='floating-button-text'>New</div>
            </div>
          </div>
        </div>
      }
      <CSSTransition
        onClick={() => setSearchParams({})} //this simply adds dark background
        in={(searchParams.get('menu'))} 
        timeout={0}
        unmountOnExit>
        <div style={{position: 'fixed', height: '100vh', width: '100%', backgroundColor: 'black', opacity: '0.7'}} />
      </CSSTransition>

      <CSSTransition
        in={(searchParams.get('menu') === 'groups')}
        timeout={300}
        classNames='bottomslide'
        unmountOnExit
      >
        <GroupSelector2 />
      </CSSTransition>
      <CSSTransition
        in={(searchParams.get('menu') === 'newexpense')}
        timeout={300}
        classNames='leftslide'
        unmountOnExit
      >
        <AddExpense2 />
      </CSSTransition>
      <CSSTransition
        in={(searchParams.get('menu') === 'invitation')}
        timeout={300}
        classNames='leftslide'
        unmountOnExit
      >
        <Invitation />
      </CSSTransition>
      <CSSTransition
        in={(searchParams.get('menu') === 'deleteexpense')}
        timeout={300}
        classNames='bottomslide'
        unmountOnExit
      >
        <DeleteExpense />
      </CSSTransition>
    </div>
  )
}

export default Main;
