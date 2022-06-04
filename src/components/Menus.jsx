import { MenuExpenseOptions, Form, GroupSelector, MenuNew, GroupOptions, LabelEditor, AddExpense, RecordPayment } from '.'
import store from '../redux/store'
import { useDispatch, useSelector } from 'react-redux'
import { setCurrentMenu } from '../redux/mainSlice'
const Menus = () => {

  const dispatch = useDispatch()
  const menu = useSelector(state => state.mainReducer.currentMenu)
  const groupList = store.getState().mainReducer.groupList

  switch (menu) {
    case 'none':
      return null
    // break
    case 'groupSelector':
      return (
        <GroupSelector
          groupList = {groupList}
          close = {() => dispatch(setCurrentMenu('none'))}
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
    case 'recordPayment':
      return (
        <RecordPayment
          close={() => dispatch(setCurrentMenu('none'))}
          headline="Record payment"
        />
      )
    default:
      console.log('Invalid menu')
  }
}

export default Menus;
