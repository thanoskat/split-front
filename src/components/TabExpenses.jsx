import { useState } from 'react'
import 'font-awesome/css/font-awesome.min.css'
import IonIcon from '@reacticons/ionicons'
import { useDispatch } from 'react-redux'
import { setCurrentMenu, setSelectedExpense } from '../redux/mainSlice'
var dayjs = require('dayjs')
var relativeTime = require('dayjs/plugin/relativeTime')
var calendar = require('dayjs/plugin/calendar')
dayjs.extend(relativeTime)
dayjs.extend(calendar)

const calendarConfig = {
  sameDay: '[Today]',
  nextDay: '[Tomorrow]',
  nextWeek: 'dddd',
  lastDay: '[Yesterday]',
  lastWeek: 'MMM DD',
  sameElse: 'MMM DD'
}

const TabExpenses = ({ expenses, members }) => {
  const dispatch = useDispatch()

  const Expense = ({ expense }) => {
    const [showTags, setShowTags] = useState(true)
    const openExpenseOptions = (expense) => {
      dispatch(setSelectedExpense(expense))
      dispatch(setCurrentMenu('expenseOptions'))
    }

    return(
      <div className='expense flex column justcont-spacebetween gap8'>
        <div className='flex row justcont-center semibold t6' style={{alignItems: 'flex-end'}}>
          <div className='bold' style={{color: `var(--weekday-${dayjs(expense.createdAt).day()})`}}>{dayjs(expense.createdAt).calendar(null, calendarConfig).toUpperCase()}</div>
          &nbsp;
          <div className='bold'>{dayjs(expense.createdAt).format('HH:mm')}</div>
        </div>
        <div className='flex row justcont-spacebetween alignitems-center'>
        <div className='flex row gap8 alignitems-center'>
          {expense.expenseTags?.map(tag => (
            <div key={tag._id} className='pill pointer'
            style={{ backgroundColor: tag.color, borderColor: tag.color, color: 'var(--layer-1-color)' }}>
              {tag.name}
            </div>
          ))}
          <div className='t3 white'>{expense.description}</div>
        </div>
        <div className='medium t25 white'>{`$ ${expense.amount}`}</div>
        </div>
        <div className='flex row justcont-spacebetween alignitems-center'>
          <div className='flex row gap6'>
            <div className='pill empty pointer' style={{ color:'var(--light-color)', borderColor:'var(--layer-5-color)'}}>
              {expense.sender.nickname}
            </div>
            {/* {showTags && expense.expenseTags?.map(tag => (
              <div key={tag._id} className='pill pointer'
              style={{ backgroundColor: tag.color, borderColor: tag.color, color: 'var(--layer-1-color)' }}>
                {tag.name}
              </div>
            ))} */}
            {!showTags && expense.tobeSharedWith?.map(participant => (
              <div key={participant} className='pill empty'
              style={{ color: 'var(--light-color)', borderColor: 'var(--layer-5-color)' }}>
                {participant.slice(18)}
              </div>
            ))}
            {showTags && expense.tobeSharedWith.length < members.length &&
            <div className='pill empty pointer' onClick={() => setShowTags(false)}
            style={{ color: 'var(--light-color)', borderColor: '#898A8C' }}>
              <IonIcon name='people-sharp'/>
              {expense.tobeSharedWith.length}
            </div>}
            {!showTags &&
            <div className='pill empty pointer' onClick={() => setShowTags(true)}
            style={{ color: 'var(--light-color)', borderColor: '#898A8C' }}>
              <IonIcon name='pricetags'/>
              {expense.expenseTags.length}
            </div>}
          </div>
          <div className='flex row pointer' onClick={() => openExpenseOptions(expense)}>
            <IonIcon name='ellipsis-vertical' className='t3 expense-options-icon'/>
          </div>
        </div>
      </div>
    )
  }

  const ExpenseTag = ({ text, color }) => {
    return(
      <div className='t5 expense-tag flex row shadow pointer' style={{ backgroundColor: `${color}` }}>
        {text}
      </div>
    )
  }

  return (
    <div className='expenses-tab flex flex-1 column overflow-hidden top-radius'>
      <div className='overflow-auto'>
        {expenses?.map(expense => (
          <div key={expense._id}>
            <Expense key={expense._id} expense={expense}/>
            <div className='separator-2 padding0014'/>
          </div>
        )).reverse()}
      <div style={{height: '120px'}}/>
      </div>
    </div>
  )
}

// TabExpenses.Pill = Pill
export default TabExpenses
