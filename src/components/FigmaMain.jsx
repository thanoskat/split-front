import { TabSwitcher, TabExpenses, TabMembers, TabSettleUp, UserBar } from '.'
import { useState, useEffect } from 'react'
import { BrowserRouter, Switch, Route } from 'react-router-dom'
import useAxios from '../utility/useAxios'


function FigmaMain() {

  const api = useAxios()
  const [displayedGroup, setDisplayedGroup] = useState()

  const getFirstGroup = async () => {
    const response = await api.get('/groups');
    setDisplayedGroup(response.data[0])
    console.log(response.data[0])
  }

  useEffect(() => {
    getFirstGroup()
  }, [])

  const changeDisplayedGroup = () => {

  }

  return (
    <div className='flex column overflow-auto figma-main'>
      <UserBar />
      <div className='separator-1'/>
      <div className='t1 group-info-frame flex row alignitems-center'>
        <div className='flex row alignitems-center' onClick={() => changeDisplayedGroup}>
          <span className='group-info-title'>{displayedGroup?.title}</span>
          <i className='icon angle down'/>
        </div>
        <i className='t2 icon ellipsis vertical'/>
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
    </div>
  );
}

export default FigmaMain;
