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
    participateInAll: false,
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