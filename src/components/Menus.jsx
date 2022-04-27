import axios from 'axios'
import { MenuExpenseOptions, Form, GroupSelector, MenuNew, GroupOptions, LabelEditor, AddExpense } from '.'
import { useState, useEffect } from 'react'
import store from '../redux/store'
import { useDispatch, useSelector } from 'react-redux'
import { setCurrentMenu } from '../redux/mainSlice'

const Menus = () => {

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
      return(
        <GroupSelector
          groupList = {groupList}
          close = {() => dispatch(setCurrentMenu('none'))}
        />
      )
    case 'new':
      return(
        <MenuNew
          close = {() => dispatch(setCurrentMenu('none'))}
        />
      )
    case 'expenseOptions':
      return(
        <MenuExpenseOptions
          close = {() => dispatch(setCurrentMenu('none'))}
        />
      )
    case 'addExpense':
      return (
        <Form
          close={() => dispatch(setCurrentMenu('none'))}
          headline="Add expense"
        />
      )
    case 'addExpense2':
      return (
        <AddExpense
          close={() => dispatch(setCurrentMenu('none'))}
        />
      )
    case 'groupOptions':
      return (
        <GroupOptions
          close={() => dispatch(setCurrentMenu('none'))}
          headline="Group options"
        />
      )
    case 'editTags':
      return (
        <LabelEditor
          close={() => dispatch(setCurrentMenu('none'))}
          headline="Group tags"
        />
      )
  }
}

export default Menus;
