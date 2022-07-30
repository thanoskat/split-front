import { useState, useEffect, useRef } from 'react'
import useAxios from '../utility/useAxios'
import IonIcon from '@reacticons/ionicons'
import { useDispatch, useSelector } from 'react-redux'
import { setSelectedGroup } from '../redux/mainSlice'
import dayjs from 'dayjs'


function NewGuest({ openMenu }) {

  const selectedGroup = useSelector(state => state.mainReducer.selectedGroup)
  //console.log(selectedGroup)
  const [loading, setLoading] = useState(false)
  const [guestInfo, setGuestInfo] = useState({
    participateInAll: true,
    nickname: '',
    email: '',
    allExpenses: selectedGroup?.expenses.filter(expense => expense.splitEqually === true),
    filteredExpenses: []
  })

  console.log(guestInfo)
  const [submitErrorMessage, setSubmitErrorMessage] = useState('')
  const [signUpErrorMessages, setSignUpErrorMessages] = useState({})
  const api = useAxios()
  const abortControllerRef = useRef(new AbortController())
  const dispatch = useDispatch()

  useEffect(() => {
    setGuestInfo({ ...guestInfo, allExpenses: selectedGroup?.expenses.filter(expense => expense.splitEqually === true) })
  }, [selectedGroup])

  useEffect(() => {
    abortControllerRef.current = new AbortController()
    return () => {
      abortControllerRef.current.abort()
    }
    // eslint-disable-next-line
  }, [])

  const submitGuest = async () => {
    let toBeupdatedExpenses
    if (guestInfo.participateInAll) {
      toBeupdatedExpenses = guestInfo.allExpenses
    } else {
      toBeupdatedExpenses = guestInfo.filteredExpenses
    }
    //e.preventDefault()
    setSignUpErrorMessages({})
    setSubmitErrorMessage('')
    setLoading(true)
    try {
      const res = await api.post('/expense/addguest',
        {
          // email: guestInfo.email,
          nickname: guestInfo.nickname,
          guest: true,
          groupID: selectedGroup._id,
          toBeupdatedExpenses: toBeupdatedExpenses
        },
        { signal: abortControllerRef.current.signal }
      )
      console.log(res)
      setLoading(false)
      openMenu(null)
      dispatch(setSelectedGroup(res.data))
    }
    catch (error) {
      if (error.response) {
        console.log(error.response)
        if (Array.isArray(error.response.data)) {

          const tempErrorMessages = {}
          error.response.data.reverse().forEach(err => {
            if (err.field === 'nickname') tempErrorMessages.nickname = err.message
            if (err.field === 'email') { tempErrorMessages.email = err.message }
          })
          setSignUpErrorMessages(tempErrorMessages)
        }
        if (error.response.data.message) {
          setSubmitErrorMessage(error.response.data.message)
        }
      }
      else {
        if (error.message === 'Network Error') setSubmitErrorMessage('Unable to establish connection to server')
        else setSubmitErrorMessage(error.message)
      }
      setLoading(false)
    }

  }

  const changeNickname = (e) => {
    setSignUpErrorMessages({ ...signUpErrorMessages, nickname: null })
    setGuestInfo({ ...guestInfo, nickname: e.target.value })
    setSubmitErrorMessage('')
  }

  const changeEmail = (e) => {
    setSignUpErrorMessages({ ...signUpErrorMessages, email: null })
    setGuestInfo({ ...guestInfo, email: e.target.value })
    setSubmitErrorMessage('')
  }

  const handleClick = (clickedExpense) => {
    if (guestInfo.filteredExpenses?.map(expense => expense._id).includes(clickedExpense?._id)) {
      setGuestInfo({ ...guestInfo, filteredExpenses: guestInfo.filteredExpenses.filter(expense => expense._id !== clickedExpense._id) })
    } else {
      //setNewExpense({ ...newExpense, participants: [...newExpense.participants, { memberId: participantClickedId }] })
      setGuestInfo({ ...guestInfo, filteredExpenses: [...guestInfo.filteredExpenses, clickedExpense] })
    }
  }

  return (
    <div id='new-expense' className='flex column fixed'>
      <div id='menu-header' className='flex row'>
        <div className='cancelIcon alignself-center pointer' onClick={() => openMenu(null)}>
          <i className='arrow left icon'></i>
        </div>
        <div>
          Add Guest
        </div>
      </div>

      <div className='inputsAndOptions-container flex column gap10 padding1010'>
        <div className='flex relative column'>
          <input
            className={`styledInput ${signUpErrorMessages.nickname ? 'inputErr' : ''}`}
            placeholder='name'
            value={guestInfo.nickname}
            onChange={e => changeNickname(e)}
            spellCheck='false'
            autoFocus={true}
          />
          {!signUpErrorMessages.nickname && <div className='t6' style={{ color: '#b6bfec', marginTop: '2px', fontWeight: '800' }}>Guest's name</div>}
          {signUpErrorMessages.nickname && <div className='mailmsg t6'>{signUpErrorMessages.nickname}</div>}
        </div>
        {/* <div className='flex relative column'>
          <input
            className='styledInput t3'
            placeholder='guest@email.com'
            value={guestInfo.email}
            onChange={e => changeEmail(e)}
            spellCheck='false'
          />
          {!signUpErrorMessages.email && <div className='t6' style={{ color: '#b6bfec', marginTop: '2px', fontWeight: '800' }}>Guest's email</div>}
          {signUpErrorMessages.email && <div className='mailmsg t6'>{signUpErrorMessages.email}</div>}
        </div> */}
        <div className="relative padding1010" style={{ borderRadius: "4px", border: "none", backgroundColor: " rgb(21, 21, 23)", fontSize: "16px", fontWeight: "700" }}>
          <div className='shadow flex relative justcont-spacebetween' style={{ boxShadow: "none" }}>
            <div className='alignself-center' style={{ color: "#b6bfec" }}>Add guest in all shared expenses</div>
            <div className='tick-cube' onClick={() => setGuestInfo({ ...guestInfo, participateInAll: !guestInfo.participateInAll })}> {guestInfo.participateInAll ? <i style={{ cursor: "pointer", fontSize: "29px", bottom: "0px", color: "rgb(182, 191, 236)" }} className='check icon absolute'></i> : ""} </div>
          </div>
        </div>
        {!guestInfo.participateInAll ?
          <div className='overflow-auto'>
            <div className='loginBox flex column ' style={{ backgroundColor: 'rgb(21, 21, 23)', borderColor: 'rgb(21, 21, 23)', borderStyle: 'solid' }}>
              <div className='whiteSpace-initial'>
                <div className='flex column gap4 padding4 whiteSpace-initial'>
                  {guestInfo.allExpenses.length === 0 ?
                    <div style={{ color: "white" }}>There are currently no expenses </div> :
                    <div style={{ color: "white" }}>Review and choose expenses your guest should participate in</div>
                  }
                </div>
              </div>
            </div>

            <div id='expenses' className='flex flex-1 column overflow-auto' style={{ marginTop: '1rem', height: '500px' }}>
              {guestInfo?.allExpenses.map(expense => (
                <div key={expense._id} id='reviewedExpense' className={`flex column pointer ${guestInfo.filteredExpenses?.map(expense => expense._id).includes(expense._id) ? 'expenseFilled' : 'expenseEmptyforMenu'}`} onClick={() => handleClick(expense)}>
                  <div className='flex row justcont-spacebetween alignitems-center'>
                    <div className='flex row'>
                      {/* <div id='expense-date'>{dayjs(expense.createdAt).calendar(null, calendarConfig).toUpperCase()}&nbsp;</div> */}
                      <div id='expense-time'>{dayjs(expense.createdAt).format('HH:mm')}</div>
                    </div>
                  </div>
                  <div className='flex row justcont-spacebetween'>
                    <div id='expense-description'>{expense.description}</div>
                    <div id='expense-amount'>${expense.amount}</div>
                  </div>
                  <div className='flex row justcont-spacebetween alignitems-center'>
                    <div className='flex row alignitems-center' style={{ gap: '8px' }}>

                      <div style={{ fontSize: '12px', fontWeight: '700' }}>PAID BY</div>
                      <div
                        id='expense-pill' className='shadow'>
                        {expense?.spender.nickname}
                      </div>
                    </div>
                  </div>
                </div>
              )).reverse()}
              <div style={{ marginBottom: '80px' }}>
              </div>
            </div>

          </div> : ''}
      </div>

      <div style={{ marginTop: 'auto' }}>
        <div
          id='new-expense-submit'
          onClick={submitGuest}
        >
          {loading && <IonIcon name='sync' className='spin' />}
          {!loading && <div>Submit</div>}
        </div>
        {submitErrorMessage && <div className='mailmsg t6 alignself-center'>{submitErrorMessage}</div>}
      </div>

    </div>
  )
}

export default NewGuest