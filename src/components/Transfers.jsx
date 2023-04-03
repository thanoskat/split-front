import { DeleteTransfer } from './'
import { useState, useRef, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { CSSTransition } from 'react-transition-group'
import IonIcon from '@reacticons/ionicons'
import dayjs from 'dayjs'
import calendar from 'dayjs/plugin/calendar'
import currency from 'currency.js'
import store from '../redux/store'
import { setSelectedGroup, setTrackID } from '../redux/mainSlice'
import useAxios from '../utility/useAxios'
dayjs.extend(calendar)

const Transfers = () => {

  const api = useAxios()
  const toggle = useSelector(state => state.mainReducer.toggle)
  const selectedGroup = useSelector(state => state.mainReducer.selectedGroup)
  const [transfers, setTransfers] = useState([])
  const abortControllerRef = useRef(null)
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

  const fetchTransfers = async () => {
    try {

      const transfersRes = await api.post('/transfer/getgrouptransfers', { groupId: selectedGroup.id, pageNumber: 1, pageSize: 20 }, { signal: abortControllerRef.current.signal });
      setTransfers(transfersRes.data)
     
    } catch (error) {
      console.log("fetchTransfers error", error)
    }
  }

  useEffect(() => {

    abortControllerRef.current = new AbortController()
    fetchTransfers()
    scrollToElement()

    return () => {

      abortControllerRef.current.abort()
    }
  }, [toggle])

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
            <div style={{ color: 'white' }}>{transfer.senderName}&nbsp;to&nbsp;{transfer.receiverName}</div>
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
    <div id='expenses-tab' className='flex column justcont-spacebetween'>
      {transfers.length === 0 ?
        <div id='expense' className='flex justcont-center'>
          <div className='flex whiteSpace-initial' style={{ color: 'white', textAlign: 'center', alignSelf: 'center', justifySelf: 'center' }}>
            There are currently no recorded money transfers
          </div>
        </div> : ''}
      <div id='expenses'>
        {transfers.map(transfer => (
          <Transfer innerRef={transfer.id === trackedExpenseID ? ref : null} transfer={transfer} key={transfer.id} />
        )).reverse()}
        {transfers.length === 0 ?
          //selectedGroup.expenses.length === 0 && selectedGroup.transfers.length === 0 ?
          <div class="movingarrows flex column alignself-end" >
            <span class="movingarrow one"></span>
            <span class="movingarrow two"></span>
            <span class="movingarrow three"></span>
          </div> : ""}
      </div>
    </div>
  )
}

export default Transfers
