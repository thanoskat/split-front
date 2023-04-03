import useAxios from '../utility/useAxios'
import store from '../redux/store'
import IonIcon from '@reacticons/ionicons'
import { useState, useRef, useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { setToggle } from '../redux/mainSlice'

function RecordTransfer({ close }) {
  const api = useAxios()
  const selectedGroup = store.getState().mainReducer.selectedGroup
  const sessionData = store.getState().authReducer.sessionData
  const toggle = store.getState().mainReducer.toggle
  const abortControllerRef = useRef(null)
  const dispatch = useDispatch()
  const inputAmountRef = useRef(null)
  const [loading, setLoading] = useState(false)
  const [newTransfer, setNewTransfer] = useState({
    amount: '',
    description: '',
    currency: 'EUR',
    transferTo: '',
    transferFrom: selectedGroup.members.find(member => member.userId === sessionData.userId).memberId
  })
  const [submitErrorMessage, setSubmitErrorMessage] = useState('')
  const [newTransferErrorMessages, setNewTransferErrorMessages] = useState({})

  useEffect(() => {
    setTimeout(() => {
      inputAmountRef.current.focus()
    }, 300)
    abortControllerRef.current = new AbortController()
    return () => {
      abortControllerRef.current.abort()
    }
    // eslint-disable-next-line
  }, [])


  const updateAmount = (e) => {
    setNewTransfer({
      ...newTransfer,
      amount: e.target.value //process(addCommas(removeNonNumeric(e.target.value.toString().split('.').map((el, i) => i ? el.split('').slice(0, 2).join('') : el).join('.'))))
    })
  }

  const recordTransfer = async () => {

    //if (newTransfer.transferTo === "") return null; //do not proceed to recording tx if no user has been selected
    //if (newTransfer.amount === "") return null; //do not proceed to recording tx if no amount has been given
    setNewTransferErrorMessages({})
    setSubmitErrorMessage('')
    setLoading(true)
    try {
      const res = await api.post(`/transfer/create`,
        {
          groupId: selectedGroup.id, //does it feed at first render? Need to check
          senderId: newTransfer.transferFrom,
          currency: 'EUR',
          receiverId: newTransfer.transferTo,
          amount: newTransfer.amount,
          description: newTransfer.description
        }, { signal: abortControllerRef.current.signal }
      )
      if (res.data.validationArray) {
        const tempErrorMessages = {}
        res.data.validationArray.reverse().forEach(err => {
          tempErrorMessages[err.field] = err.message
        })
        setNewTransferErrorMessages(tempErrorMessages)
        setLoading(false)
      } else {
        setLoading(false)
        setNewTransfer({ ...newTransfer, amount: "", description: "" })
        close()
        dispatch(setToggle(!toggle))
        console.log(res)
      }

    }
    catch (error) {
      if (error.response) {
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

  const participantClicked = (memberClickedId) => {
    if (newTransfer.transferTo === memberClickedId) {
      setNewTransfer({ ...newTransfer, transferTo: null })
    }
    else {
      setNewTransfer({ ...newTransfer, transferTo: memberClickedId })
    }
  }

  // const filterUser = () => {
  //   if (newTransfer.transferFrom === sessionData.userId) {
  //     return selectedGroup?.members.filter(member => member._id !== sessionData.userId)
  //   } else
  //     return selectedGroup?.members

  // }

  const senderClicked = (spenderID) => {
    if (newTransfer.transferFrom === spenderID) {
      setNewTransfer({ ...newTransfer, transferFrom: '' })
    }
    else {
      setNewTransfer({ ...newTransfer, transferFrom: spenderID })
    }
  }
  const transferredFromClicked = () => {
    //setNewExpenseErrorMessages({ ...newExpenseErrorMessages, ...removedContributionAmountErrors() })
    if (newTransfer.transferFrom === selectedGroup.members.find(member => member.userId === sessionData.userId).memberId) {
      setNewTransfer({ ...newTransfer, transferFrom: '' })
    } else {
      setNewTransfer(({ ...newTransfer, transferFrom: selectedGroup.members.find(member => member.userId === sessionData.userId).memberId }))
    }
  }

  const TransferredBy = () => {
    return (
      <div className='bubble flex column' style={{ fontSize: '16px', fontWeight: '700', backgroundColor: '#151517' }}>
        <div
          className='flex row justcont-spacebetween alignitems-center pointer larger-click-area'
          onClick={transferredFromClicked}
        >
          <div style={{ color: '#b6bfec' }}>Transfer from</div>
          <div
            className='flex row alignitems-center gap8'
            style={{ color: `${newTransfer.transferFrom === selectedGroup.members.find(member => member.userId === sessionData.userId).memberId ? 'white' : 'gray'}` }}
          >
            <div>You</div>
            <div className='flex row alignitems-center' style={{ fontSize: '24px' }}>
              <div className='tick-cube' >{newTransfer.transferFrom === selectedGroup.members.find(member => member.userId === sessionData.userId).memberId ? <i style={{ cursor: 'pointer', fontSize: '29px', bottom: '0px', color: 'rgb(182, 191, 236)' }} className='check icon absolute'></i> : ''} </div>

            </div>
          </div>
        </div>
        {newTransfer.transferFrom !== selectedGroup.members.find(member => member.userId === sessionData.userId).memberId &&
          <div className='flex row wrap' style={{ gap: '14px' }}>
            {selectedGroup.members?.map(member => (
              <div
                className={`pill2 pointer shadow ${newTransfer.transferFrom === member.memberId ? 'filled' : ''}`}
                onClick={() => senderClicked(member.memberId)}
              >
                {member.name}
              </div>
            ))}
          </div>}
        {newTransferErrorMessages.sender && <div className='mailmsg t6'>{newTransferErrorMessages.sender}</div>}
      </div>
    )
  }

  return (
    <div id='new-expense' className='flex column fixed'>
      <div id='menu-header' className='flex row'>
        <div className='cancelIcon alignself-center pointer' onClick={close}>
          <i className='arrow left icon'></i>
        </div>
        <div>
          New Transfer
        </div>
      </div>

      <div className='inputsAndOptions-container flex column gap10 padding1010'>
        <div className='flex relative column'>
          <div className='input-amount flex relative column justcont-evenly '>
            <div className='currency-ticker-section '>
              <i className='angle down icon'></i>
              <div className='currency-ticker'>EUR </div>
            </div>

            <input
              id='styled-input'
              className='text-align-right'
              type='text'
              inputmode='decimal'
              placeholder='0'
              value={newTransfer.amount}
              onChange={(e) => updateAmount(e)}
              ref={inputAmountRef}
              spellCheck='false'
            />

          </div>
          {!newTransferErrorMessages.amount && <div className='t6' style={{ color: '#b6bfec', marginTop: '2px', fontWeight: '800' }}>Amount</div>}
          {newTransferErrorMessages.amount && <div className='t6' style={{ color: 'var(--pink)', marginTop: '2px', fontWeight: '800' }}>{newTransferErrorMessages.amount}</div>}
        </div>
        <div className='flex relative column'>
          <input
            id='styled-input'
            placeholder='e.g. settled debt'
            value={newTransfer.description}
            onChange={e => setNewTransfer({ ...newTransfer, description: e.target.value })}
            spellCheck='false'
          />
          <div className='t6' style={{ color: '#b6bfec', marginTop: '2px', fontWeight: '800' }}>Description</div>
        </div>
        <TransferredBy />
        <div div className='bubble flex column' style={{ fontSize: '16px', fontWeight: '700', backgroundColor: '#151517' }}>
          <span style={{ color: "rgb(182, 191, 236)" }}>To:</span>
          <div className='flex row wrap gap10'>
            {selectedGroup?.members.map(member => (
              <div className={`pill2 pointer shadow ${newTransfer.transferTo === (member.memberId) ? 'filled' : 'empty'}`}
                key={member.memberId} style={{ '--pill-color': `gray` }}
                onClick={() => participantClicked(member.memberId)}
              >
                {member.name}
              </div>))}
          </div>
          {newTransferErrorMessages.receiver && <div className='mailmsg t6'>{newTransferErrorMessages.receiver}</div>}
        </div>
      </div>

      <div style={{ marginTop: 'auto' }}>
        <div
          id='new-expense-submit'
          className='pointer shadow'
          onClick={recordTransfer}
        >
          {loading && <IonIcon name='sync' className='spin' />}
          {!loading && <div>Submit</div>}
        </div>
        {submitErrorMessage && <div className='mailmsg t6 alignself-center'>{submitErrorMessage}</div>}
      </div>

    </div>
  )
}

export default RecordTransfer