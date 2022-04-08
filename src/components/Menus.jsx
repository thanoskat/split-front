import axios from 'axios'
import { GroupSelector, Form } from '.'
import { useState, useEffect } from 'react'
import store from '../redux/store'
import { useDispatch, useSelector } from 'react-redux'
import { setCurrentMenu } from '../redux/mainSlice'

function Menus() {

  const dispatch = useDispatch()
  const menu = useSelector(state => state.mainReducer.currentMenu)
  const groupList = store.getState().mainReducer.groupList
  const selectedGroup = store.getState().mainReducer.selectedGroup


  useEffect(() => {
  }, [])

  switch (menu) {
    case 'none':
      return null
      // break
    case 'groupSelector':
      return (
        <GroupSelector
          close={() => dispatch(setCurrentMenu('none'))}
          groupList={groupList}
          highlightedGroup={selectedGroup}
        />
      )
    case 'addExpense':
      return (
        <Form
          close={() => dispatch(setCurrentMenu('none'))}
          headline="Add expense"
          groupList={groupList}
          selectedGroup={selectedGroup}

        />
      )
  }
}

export default Menus;
