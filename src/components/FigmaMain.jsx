import { TabSwitcher, TabExpenses, TabMembers, TabSettleUp, UserBar } from '.'
import { useState, useEffect, useRef } from 'react'
import { Switch, Route } from 'react-router-dom'
import IonIcon from '@reacticons/ionicons';
import useAxios from '../utility/useAxios'
import populateLabels from '../utility/populateLabels'
import { useDispatch, useSelector } from 'react-redux'
import { setCurrentMenu, setGroupList, setSelectedGroup } from '../redux/mainSlice'

const FigmaMain = () => {

  const dispatch = useDispatch()
  const api = useAxios()
  const displayedGroup = useSelector(state => state.mainReducer.selectedGroup)
  const [isLoading, setLoading] = useState(false)
  const abortControllerRef = useRef(new AbortController())

  const getFirstGroup = async () => {
    const response = await api.get('/groups');
    dispatch(setSelectedGroup(populateLabels(response.data[0])))
  }

  const getGroups = async () => {
    try {
      setLoading(true)
      abortControllerRef.current.abort()
      abortControllerRef.current = new AbortController()
      const res = await api.get('/groups/mygroups', { signal: abortControllerRef.current.signal });
      dispatch(setGroupList(res.data))
      dispatch(setCurrentMenu('groupSelector'))
      setLoading(false)
    }
    catch(error) {
      setLoading(false)
      console.log(error)
    }
  }

  useEffect(() => {
    getFirstGroup()
  }, [])

  const openGroupSelector = async () => {
    if(!isLoading) {
      await getGroups()
    }
  }

  return (
    <div className='flex column overflow-auto figma-main'>
      <UserBar/>
      <div className='separator-1'/>
      <div className='t1 group-info-frame medium flex row alignitems-center'>
        <div className='flex row alignitems-center gap8 pointer' onClick={openGroupSelector}>
          <span>{displayedGroup?.title}</span>
          {!isLoading && <IonIcon name='caret-down' className='t2'/>}
          {isLoading && <IonIcon name='sync' className='t2 spin'/>}
        </div>
        <IonIcon name='settings-sharp' className='group-options-icon pointer t2' onClick={() => dispatch(setCurrentMenu('groupOptions'))}/>
      </div>
      <div className='separator-1'/>
      <TabSwitcher/>
      <Switch>
        <Route path="/figmamain/expenses">
          <TabExpenses expenses={displayedGroup?.expenses} members={displayedGroup?.members}/>
        </Route>
        <Route path="/figmamain/members" component={TabMembers}/>
        <Route path="/figmamain/settleup" component={TabSettleUp}/>
      </Switch>
      <div
      className='floating-button pointer flex row shadow justcont-center alignitems-center'
      onClick={() => dispatch(setCurrentMenu('addExpense2'))}>
        <IonIcon name='add' className='floating-button-icon'/>
        <div className='floating-button-text'>New</div>
      </div>
    </div>
  );
}

export default FigmaMain;
