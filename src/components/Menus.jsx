import axios from 'axios'
import { MenuExpenseOptions, Form, GroupSelector, MenuNew, RecordPayment } from '.'
import { useState, useEffect } from 'react'
import store from '../redux/store'
import { useDispatch, useSelector } from 'react-redux'
import { setCurrentMenu } from '../redux/mainSlice'

const Menus = () => {

  const dispatch = useDispatch()
  const menu = useSelector(state => state.mainReducer.currentMenu)
  const groupList = store.getState().mainReducer.groupList
  const selectedGroup = store.getState().mainReducer.selectedGroup

  // useEffect(() => {
  // }, [])

  switch (menu) {
    case 'none':
      return null
    // break
    case 'groupSelector':
      return (
        <GroupSelector
          groupList={groupList}
          highlightedGroup={selectedGroup}
          close={() => dispatch(setCurrentMenu('none'))}
        />
      )
    case 'new':
      return (
        <MenuNew
          close={() => dispatch(setCurrentMenu('none'))}
        />
      )
    case 'expenseOptions':
      return (
        <MenuExpenseOptions
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
        />
      )
    case 'recordPayment':
      return (
        <RecordPayment
          close={() => dispatch(setCurrentMenu('none'))}
          headline="Record payment"
        />
      )
  }
}

export default Menus;
