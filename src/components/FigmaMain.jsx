import { TabSwitcher, TabExpenses, TabMembers, TabSettleUp } from '.'
import { useState, useEffect } from 'react'
import { BrowserRouter, Switch, Route } from 'react-router-dom'
import useAxios from '../utility/useAxios'


function FigmaMain() {

  const api = useAxios()
  const [displayedGroup, setDisplayedGroup] = useState()
  const getFirstGroup = async () => {
    const response = await api.get('/groups/groupsbycreator');
    setDisplayedGroup(response.data[0])
  }

  useEffect(() => {
    getFirstGroup()
  }, [])

  const changeDisplayedGroup = () => {

  }

  return (
    <div className='v-flex'>
      <div className='group-info-frame h-flex'>
        <div onClick={() => changeDisplayedGroup}>
          {displayedGroup?.title}
          <i className='icon angle down'/>
        </div>
        <div>
          <i className='icon ellipsis vertical'/>
        </div>
      </div>
      <TabSwitcher/>
        <Switch>
          <Route path="/figmamain/expenses" component={TabExpenses}/>
          <Route path="/figmamain/members" component={TabMembers}/>
          <Route path="/figmamain/settleup" component={TabSettleUp}/>
        </Switch>
    </div>
  );
}

export default FigmaMain;
