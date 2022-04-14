import { useState } from 'react'
import 'font-awesome/css/font-awesome.min.css'
import IonIcon from '@reacticons/ionicons'
import { useDispatch, useSelector } from 'react-redux'
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
  const [filterTags, setFilterTags] = useState([])
  const [filterSender, setFilterSender] = useState([])

  const Pill = ({ icon, text, onClick, color, backgroundColor, borderColor }) => {
    return (
      // <div className='pill flex row shadow pointer t4 alignitems-center regular' style={{ color: color, borderColor: borderColor }} onClick={onClick}>
      //   {icon && <IonIcon name={icon}/>}
      //   {text}
      // </div>
      <div className='pill flex row shadow pointer t5 alignitems-center regular' style={{ color: color, backgroundColor: backgroundColor, borderColor: borderColor }} onClick={onClick}>
        {icon && <IonIcon name={icon} />}
        {text}
      </div>
    )
  }

  const Expense = ({ expense }) => {

    const [showTags, setShowTags] = useState(true)

    const openExpenseOptions = (expense) => {
      dispatch(setSelectedExpense(expense))
      dispatch(setCurrentMenu('expenseOptions'))
    }

    //console.log(expense.sender, expense.expenseTags)
    //console.log(expense)
    const addFilterTag = (tag) => {
      if (filterTags.some(filteredtag => filteredtag._id === tag._id)) return // don't feed tag that is already in
      setFilterTags(prev => [...prev, tag])
    }
    const addFilterSender = (sender) => {
      if (filterSender.some(filtersender => filtersender._id === sender._id)) return
      setFilterSender(prev => [...prev, sender])
    }

    return (
      <div className='expense flex column justcont-spacebetween gap8'>
        <div className='flex row justcont-spacebetween semibold t6' style={{ alignItems: 'flex-end' }}>
          <div className='flex row'>
            <div className='bold' style={{ color: `var(--weekday-${dayjs(expense.createdAt).day()})` }}>{dayjs(expense.createdAt).calendar(null, calendarConfig).toUpperCase()}</div>
            &nbsp;
            <div className='bold'>{dayjs(expense.createdAt).format('HH:mm')}</div>
          </div>
          <div className='flex row pointer' onClick={() => openExpenseOptions(expense)}>
            <IonIcon name='ellipsis-vertical' className='t4 expense-options-icon' />
          </div>
        </div>
        <div className='flex row justcont-spacebetween alignitems-center t25 white' style={{ padding: '0px 4px 0px 4px' }}>
          <div className=''>{expense.description}</div>
          <div className='medium'>{`$ ${expense.amount}`}</div>
        </div>
        <div className='flex row justcont-spacebetween alignitems-center'>
          <div className='flex row gap6'>
            <Pill text={expense.sender.nickname} color='var(--light-color)' borderColor={'#898A8C'} onClick={() => addFilterSender(expense.sender)} />
            {showTags && expense.expenseTags?.map(tag => (
              <Pill key={tag._id} text={tag.name} backgroundColor={tag.color} borderColor={tag.color} color={'var(--layer-1-color)'} onClick={() => addFilterTag(tag)} />
              // <Pill key={tag._id} text={tag.name} backgroundColor={'var(--layer-1-color)'} borderColor={tag.color} color={tag.color}/>
              // <Pill key={tag._id} text={tag.name} backgroundColor={'var(--layer-1-color)'} borderColor={'var(--light-color)'} color={tag.color}/>
            ))}
            {!showTags && expense.tobeSharedWith?.map(participant => (
              <Pill key={participant} text={participant.slice(18)} color={'var(--light-color)'} borderColor={'#898A8C'} />
            ))}
          </div>
          {showTags && expense.tobeSharedWith.length < members.length &&
            <Pill icon='people-sharp' text={expense.tobeSharedWith.length} color='var(--light-color)' borderColor={'#898A8C'} onClick={() => setShowTags(false)} />}
          {!showTags &&
            <Pill icon='pricetags' text={expense.expenseTags.length} color='var(--light-color)' borderColor={'#898A8C'} onClick={() => setShowTags(true)} />}
        </div>
      </div>
    )
  }

  // const ExpenseTag = ({ text, color }) => {
  //   return (
  //     <div className='t5 expense-tag flex row shadow pointer' style={{ backgroundColor: `${color}` }}>
  //       {text}
  //     </div>
  //   )
  // }

  function getSimilar(array1, array2) {
    return array1?.filter(object1 => { //(filter keeps whatever the function inside it tell it to keep)
      return array2?.some(object2 => {
        return object1._id === object2._id;
      });
    });
  }

  //console.log("similar",getSimilar(expenses?.[7].expenseTags,filterTags))
  //console.log("expenses",expenses?.map(exp=>exp.expenseTags))
  //console.log("expenses",expenses)

  const removeFilterTag = (tag) => {
    setFilterTags(filterTags.filter(item => item._id !== tag._id))
  }

  const removeFilterSender = (sender) => {
    setFilterSender(filterSender.filter(item => item._id !== sender._id))
  }

  //need all objects in the filterTags to be in the expenseTags
  const filterExpenses = (expenses, filterTags,filterSender) => {

    const filteredSenders = expenses?.filter(expense => (
      filterSender.some(sender => (
        sender._id === expense.sender._id
      ))
    ))
   const filteredTags= expenses?.filter(exp => getSimilar(exp.expenseTags, filterTags).length === filterTags.length)
    
  //console.log(filteredSenders, filteredTags)
  //console.log("final",getSimilar(filteredSenders, filteredTags))
  //console.log("filtered Tags",expenses?.map(exp=>getSimilar(exp.expenseTags,filterTags)))
  //console.log(expenses?.filter(exp => getSimilar(exp.expenseTags, filterTags).length === filterTags.length))
      
  //return expenses?.filter(exp => getSimilar(exp.expenseTags, filterTags).length === filterTags.length) //potential issue -need to check flipping
  return getSimilar(filteredSenders, filteredTags)
  }


  return (
    <div className='flex flex-1 column overflow-hidden'>

      <div className='top-labels flex row-reverse gap6'>
        {filterTags.map(tag => (
          <Pill key={tag._id} text={tag.name} backgroundColor={tag.color} borderColor={tag.color} color={'var(--layer-1-color)'} onClick={() => removeFilterTag(tag)} />
        ))}
        {filterSender.map(sender => (
          <Pill key={sender._id} text={sender.nickname} color='var(--light-color)' borderColor={'#898A8C'} onClick={() => removeFilterSender(sender)} />
        ))}
      </div>

      <div className='expenses-tab t5  top-radius flex flex-1 column overflow-hidden'>
        <div className='overflow-auto'>
          {filterExpenses(expenses, filterTags,filterSender) == 0 ? expenses.map(expense => (
            <div key={expense._id}>
              <Expense expense={expense} />
              <div className='separator-2 padding0014' />
            </div>
          )).reverse() :
            filterExpenses(expenses, filterTags,filterSender)?.map(expense => (
              <div key={expense._id}>
                <Expense expense={expense} />
                <div className='separator-2 padding0014' />
              </div>
            )).reverse()}
          <div style={{ height: '120px' }} />
        </div>
      </div>
    </div>
  )
}

export default TabExpense;
