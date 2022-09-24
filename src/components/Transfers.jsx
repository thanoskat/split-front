import { DeleteTransfer } from './'
import { useState, useRef, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useSearchParams } from 'react-router-dom'
import { CSSTransition } from 'react-transition-group'
import IonIcon from '@reacticons/ionicons'
import dayjs from 'dayjs'
import calendar from 'dayjs/plugin/calendar'
import currency from 'currency.js'
import store from '../redux/store'
import { setTrackID } from '../redux/mainSlice'
dayjs.extend(calendar)

const Transfers = () => {

  // const navigate = useNavigate()
  // const location = useLocation()
  const [, setSearchParams] = useSearchParams()
  const selectedGroup = useSelector(state => state.mainReducer.selectedGroup)
  const [filters, setFilters] = useState([])
  //const [expandExpense, setExpandExpense] = useState([])
  const trackedExpenseID = store.getState().mainReducer.trackExpenseIDfromBreakdown
  const dispatch = useDispatch()
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

  // const deleteFunction = (e, expenseId) => {
  //   e.stopPropagation()
  //   setSearchParams({ menu: 'deleteexpense', id: expenseId })
  // }

  // const addFilter = (e, id) => {
  //   e.stopPropagation()
  //   if (!filters.includes(id)) {
  //     setFilters([...filters, id])
  //   }
  // }

  // const removeFilter = (id) => {
  //   setFilters(filters.filter(filter => (filter !== id)))
  // }

  var filterSum = currency(0)
  if (filters.length > 0) {
    filteredExpenses.forEach(expense => {
      filterSum = filterSum.add(expense.amount)
    })
  }

  const scrollToElement = () => {
    if (trackedExpenseID === "") return
    console.log(ref.current)
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

  const Transfer = ({ transfer, innerRef }) => {
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
           id='expense' ref={innerRef} className={`flex column ${innerRef === null ? "" : "colorFade"}`}>
          {/* id='expense' ref={innerRef} className={`flex column guestShadow marginLeft4px marginRight4px`}
          > */}
          
          <div
            className='flex row justcont-spacebetween alignitems-center'>
            <div className='flex row'>
              <div id='expense-date'>{dayjs(transfer.createdAt).calendar(null, calendarConfig).toUpperCase()}&nbsp;</div>
              <div id='expense-time'>{dayjs(transfer.createdAt).format('HH:mm')}</div>
            </div>
            <IonIcon
              name='trash-outline'
              className='larger-click-area pointer' style={{ fontSize: '14px' }}
              onClick={(e) => openMenu(e, 'deleteTransfer')}
            // onClick={() => openMenu('expenseOptions')}
            // onClick={(e) => deleteFunction(e, expense._id)}
            />
          </div>
          <div className='flex row justcont-spacebetween gap10 alignitems-center' style={{ fontSize: '18px' }}>
            <div style={{ color: 'white' }}>{transfer.sender.nickname}&nbsp;to&nbsp;{transfer.receiver?.nickname}</div>
            <div style={{ color: 'white' }}>{currency(transfer.amount, { symbol: '€', decimal: ',', separator: '.' }).format()}</div>
          </div>
          {transfer.description !== '' &&
            <div className='flex row justcont-spacebetween gap10 alignitems-end' style={{ alignItems: 'flex-end', fontSize: '14px' }}>
              <div style={{ color: 'gray' }}>{transfer.description}</div>
              {/* <div id='expense-amount'>{currency(expense.amount, { symbol: '€', decimal: ',', separator: '.' }).format()}</div> */}
            </div>}
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
          in={menu === 'deleteTransfer'}
          timeout={100}
          classNames='bottomslide'
          unmountOnExit
        >
          <DeleteTransfer transfer={transfer} openMenu={openMenu} />
        </CSSTransition>
      </div>
    )
  }

  return (
    <div id='expenses-tab' className='flex column'>
      {selectedGroup.transfers.length === 0 ?
        <div id='expense' className='flex justcont-center'>
          <div className='flex whiteSpace-initial' style={{ color: 'white' }}>
            There are currently no recorded money transfers
          </div>
        </div> : ''}
      <div id='expenses'>
        {selectedGroup.transfers.map(transfer => (
          <Transfer innerRef={transfer._id === trackedExpenseID ? ref : null} transfer={transfer} key={transfer._id} />
        )).reverse()}
      </div>
    </div>
  )
}

export default Transfers
