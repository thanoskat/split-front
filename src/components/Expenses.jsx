import { useState } from 'react'
import { useSelector } from 'react-redux'
import { useSearchParams, Link } from 'react-router-dom'
import IonIcon from '@reacticons/ionicons'
import dayjs from 'dayjs'

const Expenses = () => {

  const [searchParams, setSearchParams] = useSearchParams()
  const selectedGroup = useSelector(state => state.mainReducer.selectedGroup)

  const [filters, setFilters] = useState([])

  console.log(selectedGroup)

  const calendarConfig = {
    sameDay: '[Today]',
    nextDay: '[Tomorrow]',
    nextWeek: 'dddd',
    lastDay: '[Yesterday]',
    lastWeek: 'MMM DD',
    sameElse: 'MMM DD'
  }

  const filteredExpenses = selectedGroup.expenses.filter(expense => {
    if(filters.length === 0) return true
    if(filters.length === 1) {
      if(filters.includes(expense.sender._id) || filters.includes(expense.expenseTags[0]?._id)) return true
    }
    if(filters.includes(expense.sender._id) && filters.includes(expense.expenseTags[0]?._id)) return true
    return false
  })

  const addFilter = (id) => {
    if(!filters.includes(id)) {
      setFilters([...filters, id])
    }
  }

  const removeFilter = (id) => {
    setFilters(filters.filter(filter => (filter !== id)))
  }

  return(
    <div className='flex flex-1 column overflow-hidden' style={{padding: '14px', gap: '14px'}}>
    {filters.length > 0 &&
    <div className='flex row justcont-spacebetween alignitems-center'>
      <div id='expense-filters' className='flex row alignitems-center'>
        {filters.map(filter => (
          <div
            key={filter}
            id='expense-pill'
            className='pointer'
            onClick={() => removeFilter(filter)}
            style={{ color: `var(--${selectedGroup.groupTags.find(label => label._id === filter)?.color})`}}
          >
            {selectedGroup.members.find(member => member._id === filter)?.nickname}
            {selectedGroup.groupTags.find(label => label._id === filter)?.name}
            <IonIcon name='close' />
          </div>
        ))}
        </div>
        <div style={{ fontSize: '14px', fontWeight: '700'}}>TOTAL: $15</div>
      </div>}
      <div id='expenses' className='flex flex-1 column overflow-auto'>
        {filteredExpenses.map(expense => (
          <div key={expense._id} id='expense' className='flex column'>
            <div className='flex row justcont-spacebetween alignitems-center'>
              <div className='flex row'>
                <div id='expense-date'>{dayjs(expense.createdAt).calendar(null, calendarConfig).toUpperCase()}&nbsp;</div>
                <div id='expense-time'>{dayjs(expense.createdAt).format('HH:mm')}</div>
              </div>
              <IonIcon
                name='ellipsis-vertical'
                className='larger-click-area pointer' style={{ fontSize: '14px' }}
                onClick={() => setSearchParams({menu: 'deleteexpense', id: expense._id})}
              />
            </div>
            <div className='flex row justcont-spacebetween'>
              <div id='expense-description'>{expense.description}</div>
              <div id='expense-amount'>${expense.amount}</div>
            </div>
            <div className='flex row justcont-spacebetween alignitems-center'>
              <div className='flex row alignitems-center' style={{ gap: '8px' }}>
                {expense.expenseTags?.map(label => (
                  <div key={label._id}
                    // onClick={() => setFilter({...filter, label: label._id})}
                    onClick={() => addFilter(label._id)}
                    id='expense-pill' className='pointer shadow'
                    style={{ color: `var(--${label.color})` }}
                  >
                    {label.name}
                  </div>
                ))}
                <div style={{ fontSize: '12px', fontWeight: '700'}}>PAID BY</div>
                <div
                  id='expense-pill' className='shadow pointer'
                  // onClick={() => setFilter({...filter, spender: expense.sender._id})}
                  onClick={() => addFilter(expense.sender._id)}
                >
                  {expense.sender.nickname}
                </div>
              </div>
              <IonIcon
                name='caret-down' className='larger-click-area pointer'
                style={{ fontSize: '14px' }}
              />
            </div>
          </div>
        )).reverse()}
      </div>
    </div>
  )
}

export default Expenses