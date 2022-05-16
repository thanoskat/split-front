import { TabSwitcher, TabExpenses, TabMembers, TabSettleUp, UserBar } from '.'
import { useState, useEffect, useRef } from 'react'
import { Switch, Route, useHistory, useLocation, Link } from 'react-router-dom'
import IonIcon from '@reacticons/ionicons';
import useAxios from '../utility/useAxios'
import populateLabels from '../utility/populateLabels'
import { useDispatch, useSelector } from 'react-redux'
import { setCurrentMenu, setGroupList, setSelectedGroup } from '../redux/mainSlice'
import AddExpense2 from './AddExpense2';
import {
  TransitionGroup,
  CSSTransition
} from "react-transition-group";

const FigmaMain = () => {

  const dispatch = useDispatch()
  const api = useAxios()
  const displayedGroup = useSelector(state => state.mainReducer.selectedGroup)
  //console.log(displayedGroup)
  const [isLoading, setLoading] = useState(false)
  const [mainIsLoading, setMainIsLoading] = useState(false)
  const abortControllerRef = useRef(new AbortController())
  const history = useHistory()
  const location = useLocation()

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
      console.log(error)
    }
  }

  useEffect(() => {
    getFirstGroup()
  }, [])

  const openGroupSelector = async () => {
    if (!isLoading) {
      await getGroups()
    }
  }

  const newClickHandler = () => {

    dispatch(setCurrentMenu('addExpense2'))
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
            <IonIcon name='settings-sharp' className='group-options-icon pointer t2' onClick={() => dispatch(setCurrentMenu('groupOptions'))} />
          </div>
          <div className='separator-1' />
          <TabSwitcher />
          <Switch>
            <Route path="/expenses">
              <TabExpenses expenses={displayedGroup?.expenses} members={displayedGroup?.members} />
            </Route>
            <Route path="/members" component={TabMembers} />
            <Route exact path="/settleup" component={TabSettleUp} />
          </Switch>
  
          <Link to="/expenses/new">
            <div
              className='floating-button pointer flex row shadow justcont-center alignitems-center'
            >
              <IonIcon name='add' className='floating-button-icon' />
              <div className='floating-button-text'>New</div>
            </div>
          </Link>

          
            <TransitionGroup>
              <CSSTransition
                key={location.pathname}
                timeout={90}
                classNames="slider" >
                <Switch location={location}>
                  <Route path="/expenses/new">
                    <AddExpense2 />
                  </Route>
                </Switch>
              </CSSTransition>
            </TransitionGroup>
        </div>
      }
    </div>
  );
}

export default FigmaMain;
// New should be a link to whatever (like navlink)