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


const TabExpense = ({ expenses, members }) => {
  const dispatch = useDispatch()

  const Expense = ({ expense }) => {
    console.log(expense)
    const [showTime, setShowTime] = useState(false)
    const [showTags, setShowTags] = useState(true)

    const openExpenseOptions = (expense) => {
      dispatch(setSelectedExpense(expense))
      dispatch(setCurrentMenu('expenseOptions'))
    }

    return(
      <div className='expense flex column justcont-spacebetween'>
        <div className='flex row justcont-spacebetween'>
          <div className='t3 white'>{expense.description}</div>
          <div className='t3 white'>{`$ ${expense.amount}`}</div>
        </div>
        {showTags &&
        <div className='flex row justcont-flexstart gap8'>
          {expense.expenseTags?.map(tag => (
            <ExpenseTag key={tag._id} text={tag.name} color={tag.color}/>
          ))}
          {/* <ExpenseTag text='Bills' color='#6490E5'/> */}
          {/* <ExpenseTag text='Tickets' color='#86dda0'/> */}
          {/* <ExpenseTag text='Shopping' color='#F29A7E'/> */}
          {/* <ExpenseTag text='Food' color='#FFE897'/> */}
        </div>}
        {!showTags &&
        <div className='flex row justcont-flexstart gap8'>
          {expense.tobeSharedWith?.map(participant => (
            <ExpenseTag key={participant} text={participant.slice(18)} color='#86dda0'/>
          ))}
          {/* <ExpenseTag text='Bills' color='#6490E5'/> */}
          {/* <ExpenseTag text='Tickets' color='#86dda0'/> */}
          {/* <ExpenseTag text='Shopping' color='#F29A7E'/> */}
          {/* <ExpenseTag text='Food' color='#FFE897'/> */}
        </div>}
        <div className='flex row justcont-spacebetween'>
          <div className='flex row alignitems-center expense-stat'>
            <IonIcon name='person-sharp' className='t3 expense-stat-icon'/>
            <span className='t5 expense-stat-text'>{expense.sender.nickname}</span>
          </div>
          <div className='flex row alignitems-center expense-stat pointer' onClick={() => setShowTime(!showTime)}>
            <IonIcon name='time' className='t3 expense-stat-icon'/>
            {!showTime && <span className='t5 expense-stat-text'>{dayjs(expense.createdAt).fromNow()}</span>}
            {showTime && <span className='t5 expense-stat-text'>{dayjs(expense.createdAt).calendar(null, calendarConfig)}</span>}
          </div>
          {showTags && expense.tobeSharedWith.length < members.length &&
          <div className='flex row alignitems-center expense-stat pointer' onClick={() => setShowTags(!showTags)}>
            <IonIcon name='people-sharp' className='t3 expense-stat-icon'/>
            <span className='t5 expense-stat-text'>{expense.tobeSharedWith.length}</span>
          </div>}
          {!showTags &&
          <div className='flex row alignitems-center expense-stat pointer' onClick={() => setShowTags(!showTags)}>
            <IonIcon name='pricetags' className='t3 expense-stat-icon'/>
            <span className='t5 expense-stat-text'>{expense.expenseTags.length}</span>
          </div>}
          <div className='flex row alignitems-center pointer' onClick={() => openExpenseOptions(expense)}
          >
            <IonIcon name='ellipsis-vertical' className='t3 expense-options-icon'/>
          </div>
        </div>
      </div>
    )
  }

  const Pill = ({ icon, text, onClick, color, backgroundColor, borderColor }) => {
    return(
      // <div className='pill flex row shadow pointer t4 alignitems-center regular' style={{ color: color, borderColor: borderColor }} onClick={onClick}>
      //   {icon && <IonIcon name={icon}/>}
      //   {text}
      // </div>
      <div className='pill flex row shadow pointer t5 alignitems-center regular' style={{ color: color, backgroundColor: backgroundColor, borderColor: borderColor }} onClick={onClick}>
        {icon && <IonIcon name={icon}/>}
        {text}
      </div>
    )
  }

  const Expense2 = ({ expense }) => {

    const [showTags, setShowTags] = useState(true)

    const openExpenseOptions = (expense) => {
      dispatch(setSelectedExpense(expense))
      dispatch(setCurrentMenu('expenseOptions'))
    }

    return(
      <div className='expense flex column justcont-spacebetween gap8'>
        <div className='flex row justcont-spacebetween semibold t6' style={{alignItems: 'flex-end'}}>
          <div className='flex row'>
            <div className='bold' style={{color: `var(--weekday-${dayjs(expense.createdAt).day()})`}}>{dayjs(expense.createdAt).calendar(null, calendarConfig).toUpperCase()}</div>
            &nbsp;
            <div className='bold'>{dayjs(expense.createdAt).format('HH:mm')}</div>
          </div>
          <div className='flex row pointer' onClick={() => openExpenseOptions(expense)}>
            <IonIcon name='ellipsis-vertical' className='t4 expense-options-icon'/>
          </div>
        </div>
        <div className='flex row justcont-spacebetween alignitems-center t25 white' style={{padding: '0px 4px 0px 4px'}}>
          <div className=''>{expense.description}</div>
          <div className='medium'>{`$ ${expense.amount}`}</div>
        </div>
        <div className='flex row justcont-spacebetween alignitems-center'>
          <div className='flex row gap6'>
            <Pill icon='card' text={expense.sender.nickname} color='var(--light-color)' borderColor={'#898A8C'}/>
            {showTags && expense.expenseTags?.map(tag => (
              <Pill key={tag._id} text={tag.name} backgroundColor={tag.color} borderColor={tag.color} color={'var(--layer-1-color)'}/>
              // <Pill key={tag._id} text={tag.name} backgroundColor={'var(--layer-1-color)'} borderColor={tag.color} color={tag.color}/>
              // <Pill key={tag._id} text={tag.name} backgroundColor={'var(--layer-1-color)'} borderColor={'var(--light-color)'} color={tag.color}/>
            ))}
            {!showTags && expense.tobeSharedWith?.map(participant => (
              <Pill key={participant} text={participant.slice(18)} color={'var(--light-color)'} borderColor={'#898A8C'}/>
            ))}
          </div>
          {showTags && expense.tobeSharedWith.length < members.length &&
          <Pill icon='people-sharp' text={expense.tobeSharedWith.length} color='var(--light-color)' borderColor={'#898A8C'} onClick={() => setShowTags(false)}/>}
          {!showTags &&
          <Pill icon='pricetags' text={expense.expenseTags.length} color='var(--light-color)' borderColor={'#898A8C'} onClick={() => setShowTags(true)}/>}
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
    <div className='expenses-tab t5 flex flex-1 column overflow-hidden top-radius'>
      <div className='overflow-auto'>
        {expenses?.map(expense => (
          <div key={expense._id}>
            <Expense2 expense={expense}/>
            <div className='separator-2 padding0014'/>
          </div>
        )).reverse()}
      <div style={{height: '120px'}}/>
      </div>
    </div>
  )
}

export default TabExpense;
