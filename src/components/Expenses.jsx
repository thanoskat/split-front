import { useState,useRef } from 'react'
import { useSelector } from 'react-redux'
import { useSearchParams } from 'react-router-dom'
import IonIcon from '@reacticons/ionicons'
import dayjs from 'dayjs'
import calendar from 'dayjs/plugin/calendar'
import currency from 'currency.js'
dayjs.extend(calendar)

const Expenses = () => {

  const [, setSearchParams] = useSearchParams()
  const selectedGroup = useSelector(state => state.mainReducer.selectedGroup)
  const [filters, setFilters] = useState([])
  const [expandExpense, setExpandExpense] = useState([])
  const calendarConfig = {
    sameDay: '[Today]',
    nextDay: '[Tomorrow]',
    nextWeek: 'dddd',
    lastDay: '[Yesterday]',
    lastWeek: 'MMM DD',
    sameElse: 'MMM DD'
  }

  const filteredExpenses = selectedGroup?.expenses?.filter(expense => {
    if (filters.length === 0) return true
    if (filters.length === 1) {
      if (filters.includes(expense.spender._id) || filters.includes(expense.label)) return true
    }
    if (filters.includes(expense.spender._id) && filters.includes((expense.label))) return true
    return false
  })

  const deleteFunction=(e, expenseId) => {
    e.stopPropagation()
    setSearchParams({ menu: 'deleteexpense', id: expenseId })
  }

  const addFilter = (e,id) => {
    e.stopPropagation()
    if (!filters.includes(id)) {
      setFilters([...filters, id])
    }
  }

  const removeFilter = (id) => {
    setFilters(filters.filter(filter => (filter !== id)))
  }

  var filterSum = currency(0)
  if(filters.length > 0) {
    filteredExpenses.forEach(expense => {
      filterSum = filterSum.add(expense.amount)
    })
  }

  //https://bobbyhadz.com/blog/react-onclick-only-parent
  const expenseClicked = (expenseClickedId) => {

    if (expandExpense.includes(expenseClickedId)) {
      setExpandExpense(expandExpense.filter(expenseId => expenseId !== expenseClickedId))
    }
    else {
      setExpandExpense([...expandExpense, expenseClickedId])
    }
  }

  return (
    <div id='expenses-tab' className='flex column'>
      {filters.length > 0 &&
      <div className='flex row justcont-spacebetween alignitems-center'>
        <div id='expense-filters' className='flex row alignitems-center'>
          {filters.map(filter => (
            <div
              key={filter}
              id='expense-pill'
              className='pointer'
              onClick={() => removeFilter(filter)}
              style={{ color: `var(--${selectedGroup.groupLabels.find(label => label._id === filter)?.color})` }}
            >
              {selectedGroup.members.find(member => member._id === filter)?.nickname}
              {selectedGroup.groupLabels.find(label => label._id === filter)?.name}
              <IonIcon name='close' />
            </div>
          ))}
        </div>
        <div style={{ fontSize: '14px', fontWeight: '700' }}>{filterSum.format()}</div>
      </div>}
      <div id='expenses'>
        {filteredExpenses.map(expense => (
          <div key={expense._id} id='expense' className='flex column' onClick={() => expenseClicked(expense._id)}>
            <div className='flex row justcont-spacebetween alignitems-center'>
              <div className='flex row'>
                <div id='expense-date'>{dayjs(expense.createdAt).calendar(null, calendarConfig).toUpperCase()}&nbsp;</div>
                <div id='expense-time'>{dayjs(expense.createdAt).format('HH:mm')}</div>
              </div>
              <IonIcon
                name='ellipsis-vertical'
                className='larger-click-area pointer' style={{ fontSize: '14px' }}
                onClick={(e) => deleteFunction(e,expense._id)}
              />
            </div>
            <div className='flex row justcont-spacebetween gap10 alignitems-center'>
              <div id='expense-description'>{expense.description}</div>
              <div id='expense-amount'>${expense.amount}</div>
            </div>
            <div className='flex row justcont-spacebetween alignitems-center'>
              <div className='flex row alignitems-center' style={{ gap: '8px' }}>
                {expense.label &&
                  <div
                    onClick={(e) => addFilter(e,expense.label)}
                    id='expense-pill' className='pointer shadow'
                    style={{ color: `var(--${selectedGroup.groupLabels.find(label => label._id === expense.label).color})` }}
                  >
                    {selectedGroup.groupLabels.find(label => label._id === expense.label).name}
                  </div>}
                <div style={{ fontSize: '12px', fontWeight: '700' }}>PAID BY</div>
                <div
                  id='expense-pill' className='shadow pointer'
                  onClick={(e) => addFilter(e,expense.spender._id)}
                >
                  {expense.spender.nickname}
                </div>
              </div>
              <div className='flex gap10'>
                {selectedGroup.members.length === expense.participants.length ? "" :
                  <div>
                    <div className='backIcon'>
                      <IonIcon
                        name='people' className='larger-click-area pointer'
                        style={{ fontSize: '22px' }}
                      />
                      <div className='frontIcon'>
                        {expense.participants.length}
                      </div>
                    </div>
                  </div>
                }
                {expense.splitEqually === false ?
                  <IonIcon
                    name='logo-react' className='larger-click-area pointer'
                    style={{ fontSize: '22px' }}
                  /> : ""}
              </div>
            </div>
            {expandExpense.includes(expense._id) ?
              <div className='tree' style={{ bottom: "10px", margin: "0 0 -15px 0" }}>
                <ul>
                  {expense.participants.map((participant, index) => (
                    <li key={participant._id}>
                      {
                        expense.splitEqually === false ?
                          <div className='flex row'><div style={{ color: "white" }}>{` ${currency(participant.contributionAmount, { symbol: '€', decimal: ',', separator: '.' }).format()}`}&nbsp;</div> &nbsp;<strong>{selectedGroup.members.find(member=>member._id===participant.memberId).nickname }</strong></div>
                          :
                          <div className='flex row'><div style={{ color: "white" }}>{` ${currency(currency(expense.amount).distribute(expense.participants.length)[index], { symbol: '€', decimal: ',', separator: '.' }).format()}`}&nbsp;</div> &nbsp;<strong>{selectedGroup.members.find(member=>member._id===participant.memberId).nickname}</strong></div>
                      }
                    </li>))}
                </ul>
              </div>
              : ""}
          </div>
        )).reverse()}
        {/* <div style={{ marginBottom: "80px" }}>
        </div> */}
      </div>
    </div>
  )
}

export default Expenses
