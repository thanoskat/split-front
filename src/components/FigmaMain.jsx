import { TabSwitcher, TabExpenses, TabMembers, TabSettleUp, UserBar, SelectBox, GroupSelector } from '.'
import { useState, useEffect, useRef } from 'react'
import { BrowserRouter, Switch, Route } from 'react-router-dom'
import IonIcon from '@reacticons/ionicons';
import useAxios from '../utility/useAxios'
import store from '../redux/store'
import { useDispatch, useSelector } from 'react-redux'
import { setCurrentMenu, setGroupList, setSelectedGroup } from '../redux/mainSlice'

function FigmaMain() {

  const dispatch = useDispatch()
  console.log('FigmaMain render.')
  const api2 = useAxios()
  const displayedGroup = useSelector(state => state.mainReducer.selectedGroup) //need to render when selectedGroup is filled on getFirstGroup() from dispatch
  const [isLoading, setLoading] = useState(false)
  //const sessionData = store.getState().authReducer.sessionData

  const groupList = useRef()

  const abortControllerRef = useRef(new AbortController())

  const setOption = (id) => {
    console.log(id)
  }

  const groups = [
    {
      title: 'Aaaaaa',
      _id: 'A'
    },
    {
      title: 'Bbbbbb',
      _id: 'B'
    },
    {
      title: 'Cccccc',
      _id: 'C'
    },
    {
      title: 'Dddddd',
      _id: 'D'
    },
    {
      title: 'Eeeeeeee',
      _id: 'E'
    },
  ]

  const getFirstGroup = async () => {
    const response = await api2.get('/groups');
    console.log(response)
    // setDisplayedGroup(response.data[0])
    dispatch(setSelectedGroup(response.data[0]))
    // console.log(response.data[0])
  }

  const getGroups = async () => {
    try {
      setLoading(true)
      abortControllerRef.current.abort()
      abortControllerRef.current = new AbortController()
      const res = await api2.get('/groups/mygroups', { signal: abortControllerRef.current.signal });
      console.log(res.data)
      groupList.current = res.data
      dispatch(setGroupList(res.data))
      dispatch(setCurrentMenu('groupSelector'))
      setLoading(false)
      // setShowSelect(true)
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
        <IonIcon name='settings-sharp' className='group-options-icon pointer t2'/>
      </div>
      <div className='separator-1'/>
      <TabSwitcher/>
        <Switch>
          <Route path="/figmamain/expenses">
            <TabExpenses expenses={displayedGroup?.expenses}/>
          </Route>
          <Route path="/figmamain/members" component={TabMembers}/>
          <Route path="/figmamain/settleup" component={TabSettleUp}/>
        </Switch>
      {/* {showSelect &&
      <GroupSelector close={() => setShowSelect(false)}
      groupList={groupList.current}
      setDisplayedGroup={setDisplayedGroup}
      highlightedGroup={displayedGroup._id}/>
      } */}
    </div>
  );
}

export default FigmaMain;
