import { ExpenseOptions, DeleteExpense, EditExpense } from './'
import { useState, useRef, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useSearchParams, useNavigate, useLocation } from 'react-router-dom'
import { CSSTransition } from 'react-transition-group'
import IonIcon from '@reacticons/ionicons'
import dayjs from 'dayjs'
import calendar from 'dayjs/plugin/calendar'
import currency from 'currency.js'
import store from '../redux/store'
import { setTrackID } from '../redux/mainSlice'

dayjs.extend(calendar)

const Expenses = () => {

  // const navigate = useNavigate()
  // const location = useLocation()
  const [, setSearchParams] = useSearchParams()
  const selectedGroup = useSelector(state => state.mainReducer.selectedGroup)
  const [filters, setFilters] = useState([])
  const [expandExpense, setExpandExpense] = useState([])
  const dispatch = useDispatch()
  const trackedExpenseID = store.getState().mainReducer.trackExpenseIDfromBreakdown
  const calendarConfig = {
    sameDay: '[Today]',
    nextDay: '[Tomorrow]',
    nextWeek: 'dddd',
    lastDay: '[Yesterday]',
    lastWeek: 'MMM DD',
    sameElse: 'MMM DD'
  }
  const ref = useRef(null);

  const filteredExpenses = selectedGroup?.expenses?.filter(expense => {
    if (filters.length === 0) return true
    if (filters.length === 1) {
      if (filters.includes(expense.spender._id) || filters.includes(expense.label)) return true
    }
    if (filters.includes(expense.spender._id) && filters.includes((expense.label))) return true
    return false
  })

  const deleteFunction = (e, expenseId) => {
    e.stopPropagation()
    setSearchParams({ menu: 'deleteexpense', id: expenseId })
  }

  const addFilter = (e, id) => {
    e.stopPropagation()
    if (!filters.includes(id)) {
      setFilters([...filters, id])
    }
  }

  const removeFilter = (id) => {
    setFilters(filters.filter(filter => (filter !== id)))
  }

  var filterSum = currency(0)
  if (filters.length > 0) {
    filteredExpenses.forEach(expense => {
      filterSum = filterSum.add(expense.amount)
    })
  }

  const scrollToElement = () => {
    if (trackedExpenseID === "") return
    ref.current.scrollIntoView({
      behavior: "smooth",
      block: "start",
      inline: "nearest"
    });
    dispatch(setTrackID(""))
  }

  useEffect(() => {
    scrollToElement()
  }, [])

  //https://bobbyhadz.com/blog/react-onclick-only-parent
  const expenseClicked = (expenseClickedId) => {

    if (expandExpense.includes(expenseClickedId)) {
      setExpandExpense(expandExpense.filter(expenseId => expenseId !== expenseClickedId))
    }
    else {
      setExpandExpense([...expandExpense, expenseClickedId])
    }
  }

  const Expense = ({ expense, innerRef }) => {
    const [menu, setMenu] = useState(null)
    //const [loading, setLoading] = useState(false)

    const openMenu = (e, menuName) => {
      e.stopPropagation()
      try {
        setMenu(menuName)
        // navigate(location.pathname)
      }
      catch (error) {
        console.log(error.message)
      }
    }

    return (
      <div>
        <div
          id='expense' ref={innerRef} className={`flex column ${innerRef === null ? "pointer" : "colorFade pointer "}`}
          onClick={() => expenseClicked(expense._id)}
        >
          <div
            className='flex row justcont-spacebetween alignitems-center'
          >
            <div className='flex row'>
              <div id='expense-date'>{dayjs(expense.createdAt).calendar(null, calendarConfig).toUpperCase()}&nbsp;</div>
              <div id='expense-time'>{dayjs(expense.createdAt).format('HH:mm')}</div>
            </div>
            <IonIcon
              name='ellipsis-vertical'
              className='larger-click-area pointer' style={{ fontSize: '14px' }}
              onClick={(e) => openMenu(e, 'expenseOptions')}
            // onClick={() => openMenu('expenseOptions')}
            // onClick={(e) => deleteFunction(e, expense._id)}
            />
          </div>
          <div className='flex row justcont-spacebetween gap10 alignitems-center'>
            <div id='expense-description'>{expense.description}</div>
            <div id='expense-amount'>{currency(expense.amount, { symbol: '€', decimal: ',', separator: '.' }).format()}</div>
          </div>
          <div className='flex row justcont-spacebetween alignitems-center'>
            <div className='flex row alignitems-center' style={{ gap: '8px' }}>
              {expense.label &&
                <div
                  onClick={(e) => addFilter(e, expense.label)}
                  id='expense-pill' className='pointer shadow'
                  style={{ color: `var(--${selectedGroup.groupLabels.find(label => label._id === expense.label).color})` }}
                >
                  {selectedGroup.groupLabels.find(label => label._id === expense.label).name}
                </div>}
              <div style={{ fontSize: '12px', fontWeight: '700' }}>PAID BY</div>
              <div
                id='expense-pill' className='shadow pointer'
                onClick={(e) => addFilter(e, expense.spender._id)}
              >
                {expense.spender?.nickname}
              </div>
            </div>
            <div className='flex gap10 alignitems-center'>
              {expense.splitEqually === false ?
                <svg style={{ fontSize: '18px' }} xmlns='http://www.w3.org/2000/svg' aria-hidden='true' role='img' width='1.25em' height='1em' preserveAspectRatio='xMidYMid meet' viewBox='0 0 640 512'><path fill='currentColor' d='M528 448H352V153.25c20.42-8.94 36.1-26.22 43.38-47.47l132-44.26c8.38-2.81 12.89-11.88 10.08-20.26l-10.17-30.34C524.48 2.54 515.41-1.97 507.03.84L389.11 40.37C375.3 16.36 349.69 0 320 0c-44.18 0-80 35.82-80 80c0 3.43.59 6.71 1.01 10.03l-128.39 43.05c-8.38 2.81-12.89 11.88-10.08 20.26l10.17 30.34c2.81 8.38 11.88 12.89 20.26 10.08l142.05-47.63c4.07 2.77 8.43 5.12 12.99 7.12V496c0 8.84 7.16 16 16 16h224c8.84 0 16-7.16 16-16v-32c-.01-8.84-7.17-16-16.01-16zm111.98-144c0-16.18 1.34-8.73-85.05-181.51c-17.65-35.29-68.19-35.36-85.87 0c-87.12 174.26-85.04 165.84-85.04 181.51H384c0 44.18 57.31 80 128 80s128-35.82 128-80h-.02zM440 288l72-144l72 144H440zm-269.07-37.51c-17.65-35.29-68.19-35.36-85.87 0C-2.06 424.75.02 416.33.02 432H0c0 44.18 57.31 80 128 80s128-35.82 128-80h-.02c0-16.18 1.34-8.73-85.05-181.51zM56 416l72-144l72 144H56z' /></svg> : ''}
              <div>
                <div className='backIcon'>
                  <IonIcon
                    name='people' className='larger-click-area'
                    style={{ fontSize: '22px' }}
                  />
                  <div className='frontIcon' style={{ color: 'white' }}>
                    {expense.participants.length}
                  </div>
                </div>
              </div>
            </div>
          </div>
          {expandExpense.includes(expense._id) ?
            <div className='tree' style={{ bottom: '10px', margin: '0 0 -15px 0' }}>
              <ul>
                {expense.participants.map((participant, index) => (
                  <li key={participant._id}>
                    {
                      expense.splitEqually === false ?
                        <div className='flex row'><div style={{ color: 'white' }}>{` ${currency(participant.contributionAmount, { symbol: '€', decimal: ',', separator: '.' }).format()}`}&nbsp;</div> &nbsp;<strong>{selectedGroup.members.find(member => member._id === participant.memberId).nickname}</strong></div>
                        :
                        <div className='flex row'><div style={{ color: 'white' }}>{` ${currency(currency(expense.amount).distribute(expense.participants.length)[index], { symbol: '€', decimal: ',', separator: '.' }).format()}`}&nbsp;</div> &nbsp;<strong>{selectedGroup.members.find(member => member._id === participant.memberId).nickname}</strong></div>
                    }
                  </li>))}
              </ul>
            </div>
            : ''}
        </div>
        <CSSTransition
          onClick={() => setMenu(null)}
          in={Boolean(menu)}
          timeout={0}
          unmountOnExit
        >
          <div style={{
            left: '0px',
            top: '0px',
            position: 'fixed',
            height: '100%',
            width: '100%',
            backgroundColor:
              'black',
            opacity: '0.7'
          }}
          />
        </CSSTransition>
        <CSSTransition
          in={menu === 'editExpense'}
          timeout={100}
          classNames='bottomslide'
          unmountOnExit
        >
          <EditExpense expense={{ ...expense, amount: expense.amount.toString(), spender: expense.spender._id, participants: expense.participants.map(participant => ({ ...participant, contributionAmount: participant.contributionAmount?.toString() })) }} close={() => setMenu(null)} />
        </CSSTransition>
        <CSSTransition
          in={menu === 'deleteExpense'}
          timeout={100}
          classNames='bottomslide'
          unmountOnExit
        >
          <DeleteExpense expense={expense} openMenu={openMenu} />
        </CSSTransition>
        <CSSTransition
          in={menu === 'expenseOptions'}
          timeout={100}
          classNames='bottomslide'
          unmountOnExit
        >
          <ExpenseOptions openMenu={openMenu} expense={expense} />
        </CSSTransition>
      </div>
    )
  }

  return (
    <div id='expenses-tab' className='flex column'>
      {selectedGroup.expenses.length === 0 ?
        <div id='expense' className='flex justcont-center'>
          <div className='flex whiteSpace-initial' style={{ color: 'white' }}>
            There are currently no expenses
          </div>
        </div> : ''}
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
          <div style={{ fontSize: '14px', fontWeight: '700' }}>{currency(filterSum, { symbol: '€', decimal: ',', separator: '.' }).format()}</div>
        </div>}
      <div id='expenses'>
        {filteredExpenses.map(expense => (
          <Expense innerRef={expense._id === trackedExpenseID ? ref : null} expense={expense} key={expense._id} />
        )).reverse()}
      </div>
    </div>
  )
}

export default Expenses
