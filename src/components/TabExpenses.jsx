import { useState } from 'react'
import 'font-awesome/css/font-awesome.min.css'
import IonIcon from '@reacticons/ionicons'
import { useDispatch } from 'react-redux'
import { setCurrentMenu, setSelectedExpense } from '../redux/mainSlice'
import currency from 'currency.js'

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
  const [filterTags, setFilterTags] = useState([])
  const [filterSender, setFilterSender] = useState([])

  //console.log(filterTags, filterSender)

  const Expense = ({ expense }) => {
    const [showTags, setShowTags] = useState(true)

    const openExpenseOptions = (expense) => {
      dispatch(setSelectedExpense(expense))
      dispatch(setCurrentMenu('expenseOptions'))
    }

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
        <div className='flex row justcont-center semibold t6' style={{ alignItems: 'flex-end' }}>
          <div className='bold' style={{ color: `var(--weekday-${dayjs(expense.createdAt).day()})` }}>{dayjs(expense.createdAt).calendar(null, calendarConfig).toUpperCase()}</div>
          &nbsp;
          <div className='bold'>{dayjs(expense.createdAt).format('HH:mm')}</div>
        </div>
        <div className='flex row justcont-spacebetween alignitems-center'>
          <div className='flex row gap8 alignitems-center'>
            {expense.expenseTags?.map(label => (
              <div key={label._id} className='pill pointer filled'
                style={{ '--pill-color': `var(--${label.color})` }}
                onClick={() => addFilterTag(label)}>
                {label.name}
              </div>
            ))}
            <div className='t3 white'>{expense.description}</div>
          </div>
          <div className='medium t25 white'>{`${currency(expense.amount, { symbol: '€', decimal: ',', separator: '.' }).format()}`}</div>
        </div>
        <div className='flex row justcont-spacebetween alignitems-center'>
          <div className='flex row gap6'>
            <div className='pill empty pointer'
              style={{ '--pill-color': 'var(--layer-6-color)' }}
              onClick={() => addFilterSender(expense.sender)}
            >
              {expense.sender.nickname}
            </div>
            {!showTags && expense.tobeSharedWith?.map(participant => (
              <div key={participant} className='pill empty'
                style={{ '--pill-color': 'var(--layer-6-color)' }}>
                {participant.slice(18)}
              </div>
            ))}
            {showTags && expense.tobeSharedWith.length < members.length &&
              <div className='pill empty pointer' onClick={() => setShowTags(false)}
                style={{ '--pill-color': 'var(--layer-6-color)' }}>
                <IonIcon name='people-sharp' />
                {expense.tobeSharedWith.length}
              </div>}
            {!showTags &&
              <div className='pill empty pointer' onClick={() => setShowTags(true)}
                style={{ '--pill-color': 'var(--layer-6-color)' }}>
                <IonIcon name='pricetags' />
                {expense.expenseTags.length}
              </div>}
          </div>
          <div className='flex row pointer' onClick={() => openExpenseOptions(expense)}>
            <IonIcon name='ellipsis-vertical' className='t3 expense-options-icon' />
          </div>
        </div>
      </div>
    )
  }

  function getSimilar(array1, array2) {
    return array1?.filter(object1 => { //(filter keeps whatever the function inside it tell it to keep)
      return array2?.some(object2 => {
        return object1._id === object2._id;
      });
    });
  }

  const removeFilterTag = (tag) => {
    setFilterTags(filterTags.filter(item => item._id !== tag._id))
  }

  const removeFilterSender = (sender) => {
    setFilterSender(filterSender.filter(item => item._id !== sender._id))
  }

  //need all objects in the filterTags to be in the expenseTags
  const filterExpenses = (expenses, filterTags, filterSender) => {

    const filteredSenders = expenses?.filter(expense => (
      filterSender.some(sender => (
        sender._id === expense.sender._id
      ))
    ))
    const filteredTags = expenses?.filter(exp => getSimilar(exp.expenseTags, filterTags).length === filterTags.length)
    // console.log(filteredSenders, filteredTags)
    // console.log("final", getSimilar(filteredSenders, filteredTags))
    //console.log("filtered Tags",expenses?.map(exp=>getSimilar(exp.expenseTags,filterTags)))
    //participantArray.reduce((prevValue, currValue) => prevValue + currValue
    //console.log("final", filteredTags)
    //console.log(filteredTags?.map(tag=>tag.amount).reduce((prevValue, currValue) => prevValue + currValue))
    //console.log("final",getSimilar(filteredSenders, filteredTags))
    //console.log(getSimilar(filteredSenders, filteredTags)?.map(tag=>tag.amount).reduce((prevValue, currValue) => prevValue + currValue))

    if (filteredSenders?.length === 0) { //no need to add user in filter
      let sum = currency(0);
      //console.log("filtered tags",filteredTags)

      filteredTags?.forEach(tag => {
        sum = sum.add(tag.amount)
        //console.log(sum)
      })
      return { filteredExpenses: filteredTags, sum: sum.value } //TODO potential issue -need to check flipping
    } else {
      let sum = currency(0);
      getSimilar(filteredSenders, filteredTags)?.forEach(tag => {
        sum = sum.add(tag.amount)
        //console.log(sum)
      })
      return { filteredExpenses: getSimilar(filteredSenders, filteredTags), sum: sum.value } //only keep user with available tags
    }
  }

  const filteredExpenses = filterExpenses(expenses, filterTags, filterSender)
  //console.log("filtered expenses", filteredExpenses)
  //console.log("expenses", expenses)
  //console.log(filteredExpenses.filteredExpenses?.length!==expenses?.length)

  return (
    <div className='flex flex-1 column overflow-hidden '>

      <div className='t4 flex row justcont-spacebetween'>
        <div className='top-labels flex row gap6 overflow-auto'>
          <div className='flex gap6'>
            {filterTags.map(label => (
              <div className='pill' key={label._id}
                style={{ backgroundColor: `var(--${label.color})`, borderColor: `var(--${label.color})`, color: 'var(--layer-1-color)' }}
                onClick={() => removeFilterTag(label)}
              >
                {label.name}
              </div>
            ))}
            {filterSender.map(sender => (
              <div className='pill' key={sender._id}
                style={{ color: 'var(--light-color)', borderColor: '#898A8C' }}
                onClick={() => removeFilterSender(sender)}
              >
                {sender.nickname}
              </div>
            ))}
          </div>
        </div>

        {filterTags.length !== 0 || filterSender.length !== 0 ?  
        <div className='filteredSum t25 white'>
            {currency(filteredExpenses.sum, { symbol: '€', decimal: ',', separator: '.' }).format()}
          </div> :""
         }

      </div>

      <div className='expenses-tab t5  top-radius flex flex-1 column overflow-hidden'>
        <div className='overflow-auto'>
          {
            filteredExpenses.filteredExpenses?.map(expense => (
              <div key={expense._id}>
                <Expense expense={expense} />
                <div className='separator-2 padding0014' />
              </div>
            )).reverse()
          }
          <div style={{ height: '120px' }} />
        </div>
      </div>
    </div>
  )

}

export default TabExpenses
