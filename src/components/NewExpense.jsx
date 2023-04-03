import IonIcon from '@reacticons/ionicons'
import currency from 'currency.js'
import { useState, useRef, useEffect } from 'react'
import useAxios from '../utility/useAxios'
import { useSelector,useDispatch } from 'react-redux'
import store from '../redux/store'
import { setToggle } from '../redux/mainSlice'

const NewExpense = ({ close }) => {
  const api = useAxios()
  const selectedGroup = useSelector(state => state.mainReducer.selectedGroup)
  const dispatch = useDispatch()
  const toggle = store.getState().mainReducer.toggle
  const abortControllerRef = useRef(null)
  const sessionData = store.getState().authReducer.sessionData
  const [submitLoading, setSubmitLoading] = useState(false)
  const [newExpense, setNewExpense] = useState({
    splitEqually: true,
    currency: "EUR",
    focus: false,
    amount: '',
    description: '',
    label: null,
    participants: selectedGroup?.members.map(member => ({ memberId: member.memberId, participationAmount: '' })),
    payers: [{ memberId: selectedGroup.members.find(member => member.userId === sessionData.userId).memberId, paymentAmount: '' }],
    includeNewMemberToThisExpense: true,
    paidbyYouClicked: true
  })

  const [submitErrorMessage, setSubmitErrorMessage] = useState('')
  const [newExpenseErrorMessages, setNewExpenseErrorMessages] = useState({})

  // console.log(JSON.stringify(newExpenseErrorMessages, null, 2))

  useEffect(() => {
    setNewExpense({ ...newExpense, participants: selectedGroup?.members.map(member => ({ memberId: member.memberId, participationAmount: '' })) })
  }, [selectedGroup])


  useEffect(() => {
    abortControllerRef.current = new AbortController()
    return () => {
      abortControllerRef.current.abort()
    }
    // eslint-disable-next-line
  }, [])

  useEffect(() => {
    setNewExpense({ ...newExpense, includeNewMemberToThisExpense: selectedGroup.members.length === newExpense.participants.length })
  }, [newExpense.participants])

  const allMembers = () => {
    if (newExpense.participants) {
      return selectedGroup.members.length === newExpense.participants.length
    }
    else return true
  }


  const populateAmounts = () => {
    if (newExpense.payers.length === 1) {
      newExpense.payers.map(payer => payer.paymentAmount = newExpense.amount)
    }
    if (newExpense.splitEqually === true) {
      const distributedAmountArray = currency(newExpense.amount).distribute(newExpense.participants.length).map(e => e.value)
      newExpense.participants = newExpense.participants.map((participant, index) => ({ ...participant, participationAmount: distributedAmountArray[index].toString() }))
    }
  }

  const submitExpense = async () => {

    if (!submitLoading) {
      populateAmounts()
      setSubmitErrorMessage('')
      setNewExpenseErrorMessages({})
      setSubmitLoading(true)
      try {
        const res = await api.post('expense/create', { ...newExpense, groupId: selectedGroup.id }, { signal: abortControllerRef.current.signal })

        if (res.data.validationArray) {
          const tempErrorMessages = {}
          res.data.validationArray.reverse().forEach(err => {
            tempErrorMessages[err.field] = err.message
          })
          setNewExpenseErrorMessages(tempErrorMessages)
          setSubmitLoading(false)
        }
        else {
          dispatch(setToggle(!toggle))
          setSubmitLoading(false)
          close()
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
        setSubmitLoading(false)
      }
    }
  }


  const labelClicked = (labelClickedId) => {
    if (newExpense.label === labelClickedId) {
      setNewExpense({ ...newExpense, label: null })
    }
    else {
      setNewExpense({ ...newExpense, label: labelClickedId })
    }
  }

  const removedparticipationAmountErrors = () => {
    const participationAmountErrorMessages = {}
    for (const field in newExpenseErrorMessages) {
      if (/^participants\[[0-9]+]\.participationAmount$/.test(field)) {
        participationAmountErrorMessages[field] = null
      }
    }
    return (participationAmountErrorMessages)
  }

  const participantClicked = (participantClickedId) => {
    setNewExpenseErrorMessages({ ...newExpenseErrorMessages, participants: null, ...removedparticipationAmountErrors() })
    if (newExpense.participants.map(participants => participants?.memberId).includes(participantClickedId)) {
      setNewExpense({ ...newExpense, participants: newExpense.participants.filter(participant => participant.memberId !== participantClickedId) })
    }
    else {
      setNewExpense({ ...newExpense, participants: [...newExpense.participants, { memberId: participantClickedId, participationAmount: '' }] })
    }
  }
  //payers: newExpense.payers.map(_payer => (_payer.memberId === payer.memberId) ? { ...payer, paymentAmount: e.target.value } : _payer)
  const payerClicked = (payerClickedId) => {
    setNewExpenseErrorMessages({ ...newExpenseErrorMessages, payers: null, ...removedparticipationAmountErrors() })

    if (newExpense.payers.map(payer => payer?.memberId).includes(payerClickedId)) {
      setNewExpense({ ...newExpense, payers: newExpense.payers.filter(payer => payer.memberId !== payerClickedId) })
    }
    else {
      //const distributedExpense=currency(newExpense.amount).distribute(newExpense.payers.length+1).map(e=>e.value)
      setNewExpense({ ...newExpense, payers: [...newExpense.payers, { memberId: payerClickedId, paymentAmount: "" }] })
      //setNewExpense({ ...newExpense, payers:[...newExpense.payers, { memberId: memberId, paymentAmount:distributedExpense[index] }]})
    }
  }

  //payers: (newExpense.payers.length === 1? newExpense.payers.map(payer => ({ ...payer, paymentAmount: e.target.value })):"" )
  const paidByClicked = () => {

    setNewExpenseErrorMessages({ ...newExpenseErrorMessages, ...removedparticipationAmountErrors() })
    if (newExpense.payers.length > 1) {
      setNewExpense(prev => ({ ...newExpense, paidbyYouClicked: !prev.paidbyYouClicked, payers: [{ memberId: selectedGroup.members.find(member => member.userId === sessionData.userId).memberId, paymentAmount: "" }] }))
    } else if (newExpense.payers.length === 1 && newExpense.payers.map(payer => payer.memberId).includes(selectedGroup.members.find(member => member.userId === sessionData.userId).memberId)) {
      setNewExpense(prev => ({ ...newExpense, paidbyYouClicked: !prev.paidbyYouClicked, payers: [{ memberId: selectedGroup.members.find(member => member.userId === sessionData.userId).memberId, paymentAmount: "" }] }))
    }
    else { setNewExpense(prev => ({ ...newExpense, paidbyYouClicked: !prev.paidbyYouClicked, payers: [{ memberId: selectedGroup.members.find(member => member.userId === sessionData.userId).memberId, paymentAmount: "" }] })) }
  }

  // const allMembers = () => {
  //   if (newExpense.participants) {
  //     return selectedGroup.members.length === newExpense.participants.length
  //   }
  //   else return true
  //}

  const allClick = () => {
    setNewExpenseErrorMessages({ ...newExpenseErrorMessages, splitEqually: null, participants: null, ...removedparticipationAmountErrors() })

    if (allMembers()) {
      setNewExpense({ ...newExpense, participants: [] })
    }
    else {
      setNewExpense({ ...newExpense, participants: selectedGroup?.members.map(member => ({ memberId: member.memberId, participationAmount: '' })) })
    }
  }

  const equalClick = () => {
    setNewExpenseErrorMessages({ ...newExpenseErrorMessages, ...removedparticipationAmountErrors() })

    if (newExpense.splitEqually) {
      setNewExpense({ ...newExpense, splitEqually: false })
    }
    else {
      setNewExpense({ ...newExpense, splitEqually: true, participants: newExpense.participants.map(participant => ({ memberId: participant.memberId, participationAmount: '' })) })
    }
  }

  const LabelSection = () => {
    return (
      <div className='bubble flex column' style={{ fontSize: '16px', fontWeight: '700', backgroundColor: '#151517' }}>
        <div style={{ color: '#b6bfec' }}>Label</div>
        <div className='flex row wrap' style={{ gap: '14px', padding: '0px 0px 6px 0px' }}>
          {selectedGroup?.labels.map(label => (
            <div className={`pill2 pointer shadow`}
              key={label._id} style={{ color: `${newExpense.label === label._id ? 'var(--' + label.color + ')' : '#606060'}` }}
              onClick={() => labelClicked(label._id)}
            >
              {label.name}
            </div>))}
        </div>
      </div>
    )
  }




  const PaidBy = () => {
    return (
      <div className='bubble flex column' style={{ fontSize: '16px', fontWeight: '700', backgroundColor: '#151517', borderBottomLeftRadius: newExpense.payers.length >= 2 ? "0px" : "", borderBottomRightRadius: newExpense.payers.length >= 2 ? "0px" : "" }}>
        <div
          className='flex row justcont-spacebetween alignitems-center pointer larger-click-area'
          onClick={paidByClicked}
        >
          <div style={{ color: '#b6bfec' }}>Paid by</div>
          <div
            className='flex row alignitems-center gap8'
            style={{ color: `${newExpense.paidbyYouClicked ? 'white' : 'gray'}` }}
          >
            <div>You</div>
            <div className='flex row alignitems-center' style={{ fontSize: '24px' }}>
              <div className='tick-cube' >{newExpense.paidbyYouClicked ? <i style={{ cursor: 'pointer', fontSize: '29px', bottom: '0px', color: 'rgb(182, 191, 236)' }} className='check icon absolute'></i> : ''} </div>

            </div>
          </div>
        </div>
        {!newExpense.paidbyYouClicked &&
          <div className='flex row wrap' style={{ gap: '14px' }}>
            {selectedGroup.members?.map((member, index) => (
              <div
                key={member.memberId}
                className={`pill2 pointer shadow ${newExpense.payers.map(payer => payer?.memberId).includes(member.memberId) ? 'filled' : ''}`}
                onClick={() => payerClicked(member.memberId, index)}
              >
                {member.name}
              </div>
            ))}
          </div>}
        {newExpenseErrorMessages.payers && <div className='mailmsg t6'>{newExpenseErrorMessages.payers}</div>}
      </div>
    )
  }

  const MemberSection = () => {
    return (
      <div className='bubble flex column' style={{ fontSize: '16px', fontWeight: '700', backgroundColor: '#151517' }}>
        <div
          className='flex row justcont-spacebetween alignitems-center pointer larger-click-area'
          onClick={allClick}
        >
          <div style={{ color: '#b6bfec' }}>Share with</div>
          <div
            className='flex row alignitems-center gap8'
            style={{ color: `${allMembers() ? 'white' : 'gray'}` }}
          >
            <div>All</div>
            <div className='flex row alignitems-center' style={{ fontSize: '24px' }}>
              <div className='tick-cube' >{allMembers() ? <i style={{ cursor: 'pointer', fontSize: '29px', bottom: '0px', color: 'rgb(182, 191, 236)' }} className='check icon absolute'></i> : ''} </div>
            </div>
          </div>
        </div>
        {!allMembers() &&
          <div className='flex row wrap' style={{ gap: '14px' }}>
            {selectedGroup.members?.map(member => (
              <div
                key={member.memberId}
                className={`pill2 pointer shadow ${newExpense.participants.map(participant => participant?.memberId).includes(member.memberId) ? 'filled' : ''}`}
                onClick={() => participantClicked(member.memberId)}
              >
                {member.name}
              </div>
            ))}
          </div>}
        {newExpenseErrorMessages.participants && <div className='mailmsg t6'>{newExpenseErrorMessages.participants}</div>}
      </div>
    )
  }


  //, payers: (newExpense.payers.length === 1? newExpense.payers.map(payer => ({ ...payer, paymentAmount: e.target.value })):"" )
  const changeAmount = (e) => {
    setNewExpenseErrorMessages({ ...newExpenseErrorMessages, amount: null })
    setNewExpense({ ...newExpense, amount: e.target.value })
  }

  const changeDescription = (e) => {
    setNewExpenseErrorMessages({ ...newExpenseErrorMessages, description: null })
    setNewExpense({ ...newExpense, description: e.target.value })
  }

  const changeParticipation = (e, participant, index) => {
    newExpenseErrorMessages['participants[' + index + '].participationAmount'] = null
    newExpenseErrorMessages.splitEqually = null
    //console.log(newExpenseErrorMessages)
    setNewExpense(
      {
        ...newExpense,
        participants: newExpense.participants.map(_participant => (_participant.memberId === participant.memberId) ? { ...participant, participationAmount: e.target.value } : _participant)
      }
    )
  }

  const changePaidByMany = (e, payer, index) => {
    newExpenseErrorMessages['payers[' + index + '].paymentAmount'] = null
    newExpenseErrorMessages.paidByMany = null
    setNewExpense(
      {
        ...newExpense,
        payers: newExpense.payers.map(_payer => (_payer.memberId === payer.memberId) ? { ...payer, paymentAmount: e.target.value } : _payer)
      })
  }



  const operatorRef = useRef(null)
  //console.log(operatorRef)
  const operatorBlurHandle = (event) => {

    if (operatorRef.current && operatorRef.current.contains(event.target)) {
      setNewExpense({ ...newExpense, focus: true })
    } else {

      setNewExpense({ ...newExpense, focus: false })
    }
  }

  return (
    <div id='new-expense' className='flex column fixed' style={{ paddingBottom: "5px" }}>
      <div id='menu-header' className='flex row'>
        <div className='cancelIcon alignself-center pointer' onClick={close}>
          <i className='arrow left icon'></i>
        </div>
        <div>
          New expense
        </div>
      </div>
      <div className='flex column overflow-auto' style={{ gap: '14px' }}>
        <div className='flex relative column'>
          <div style={{ fontSize: '18px', position: 'absolute', left: '14px', transform: 'translate(0, 50%)' }}>EUR</div>
          <input
            id='styled-input'
            className='text-align-right'
            type='text'
            inputMode='decimal'
            placeholder='0'
            value={newExpense.amount}
            onChange={e => changeAmount(e)}
            spellCheck='false'
            autoComplete='off'
            onFocus={() => setNewExpense({ ...newExpense, focus: true })}
            onBlur={(e) => operatorBlurHandle(e)}
          />
          {!newExpenseErrorMessages.amount && <div className='t6' style={{ color: '#b6bfec', marginTop: '2px', fontWeight: '800' }}>Amount</div>}
          {newExpenseErrorMessages.amount && <div className='t6' style={{ color: 'var(--pink)', marginTop: '2px', fontWeight: '800' }}>{newExpenseErrorMessages.amount}</div>}
        </div>
        <div className='flex relative column'>
          <input
            id='styled-input'
            className=''
            type='text'
            placeholder='e.g. Air tickets'
            value={newExpense.description}
            onChange={e => changeDescription(e)}
            spellCheck='false'
            autoComplete='off'
          />
          {!newExpenseErrorMessages.description && <div className='t6' style={{ color: '#b6bfec', marginTop: '2px', fontWeight: '800' }}>Description</div>}
          {newExpenseErrorMessages.description && <div className='t6' style={{ color: 'var(--pink)', marginTop: '2px', fontWeight: '800' }}>{newExpenseErrorMessages.description}</div>}
        </div>
        {selectedGroup?.labels.length !== 0 && <LabelSection />}
        <PaidBy />


        {newExpense.payers.length >= 2 &&
          <div className='bubble flex column' style={{ fontSize: '16px', fontWeight: '700', backgroundColor: '#151517', marginTop: "-15px", borderTopLeftRadius: "0px", borderTopRightRadius: "0px" }}>
            <div className='flex column' style={{ gap: '14px' }}>
              {newExpense.payers?.map((payer, index) => (
                <div key={payer.memberId} className='flex row justcont-spacebetween alignitems-center' style={{ gap: '14px' }}>
                  <div style={{ flex: '1 1 auto', width: '100%', overflow: 'hidden', textOverflow: 'ellipsis', color: '#dddddd' }}>
                    {selectedGroup?.members?.find(member => member.memberId === payer?.memberId)?.name}
                  </div>
                  <input
                    type='text'
                    inputMode='decimal'
                    className='text-align-right'
                    placeholder='0'
                    style={{
                      borderRadius: '8px',
                      padding: '6px',
                      fontSize: '16px',
                      flex: '1 1 auto',
                      width: '100%',
                      borderColor: `${newExpenseErrorMessages['payers[' + index + '].paymentAmount'] ? 'var(--pink)' : '#999999'}`,
                      borderWidth: '1px',
                      borderStyle: 'solid'
                    }}
                    id='styled-input'
                    onChange={e => changePaidByMany(e, payer, index)}
                    value={payer.paymentAmount}
                    autoComplete='off'
                  />
                </div>
              ))}
              <div style={{ fontSize: '12px', alignSelf: 'center' }}>
                REMAINING:&nbsp;
                {currency(newExpense.amount).subtract(newExpense.payers.reduce(((sum, payer) => currency(sum).add(payer.paymentAmount).value), 0)).value}
              </div>
              {newExpenseErrorMessages.paidByMany && <div className='mailmsg t6'>{newExpenseErrorMessages.paidByMany}</div>}
            </div>
          </div>
        }


        <MemberSection />
        <div className='bubble flex column' style={{ fontSize: '16px', fontWeight: '700', gap: '28px', backgroundColor: '#151517' }}>
          <div
            className='flex row justcont-spacebetween alignitems-center pointer'
            onClick={equalClick}
          >
            <div style={{ color: '#b6bfec' }}>Split</div>
            <div
              className='flex row alignitems-center gap8'
              style={{ color: `${newExpense.splitEqually ? 'white' : 'gray'}` }}
            >
              <div>Equally</div>
              <div className='flex row alignitems-center' style={{ fontSize: '24px' }}>
                <div className='tick-cube'> {newExpense.splitEqually ? <i style={{ fontSize: '29px', bottom: '0px', color: 'rgb(182, 191, 236)' }} className='check icon absolute'></i> : ''} </div>
              </div>
            </div>
          </div>

          {!newExpense?.splitEqually && newExpense.participants.length > 0 &&
            <div className='flex column' style={{ gap: '14px' }}>
              {newExpense.participants?.map((participant, index) => (
                <div className='flex row justcont-spacebetween alignitems-center' style={{ gap: '14px' }}>
                  <div style={{ flex: '1 1 auto', width: '100%', overflow: 'hidden', textOverflow: 'ellipsis', color: '#dddddd' }}>
                    {selectedGroup?.members?.find(member => member.memberId === participant?.memberId)?.name}
                  </div>
                  <input
                    type='text'
                    inputMode='decimal'
                    className='text-align-right'
                    placeholder='0'
                    style={{
                      borderRadius: '8px',
                      padding: '6px',
                      fontSize: '16px',
                      flex: '1 1 auto',
                      width: '100%',
                      borderColor: `${newExpenseErrorMessages['participants[' + index + '].participationAmount'] ? 'var(--pink)' : '#999999'}`,
                      borderWidth: '1px',
                      borderStyle: 'solid'
                    }}
                    id='styled-input'
                    onChange={e => changeParticipation(e, participant, index)}
                    value={participant.participationAmount}
                    autoComplete='off'
                  />
                </div>
              ))}
              <div style={{ fontSize: '12px', alignSelf: 'center' }}>
                REMAINING:&nbsp;
                {currency(newExpense.amount).subtract(newExpense.participants.reduce(((sum, participant) => currency(sum).add(participant.participationAmount).value), 0)).value}
              </div>
              {newExpenseErrorMessages.splitEqually && <div className='mailmsg t6'>{newExpenseErrorMessages.splitEqually}</div>}
            </div>
          }
        </div>
      </div>
      <div style={{ marginTop: 'auto' }}>
        <div
          id='new-expense-submit'
          className='pointer shadow'
          onClick={submitExpense}
        >
          {submitLoading && <IonIcon name='sync' className='spin' />}
          {!submitLoading && <div>Submit</div>}
        </div>
        {submitErrorMessage && <div className='mailmsg t6 alignself-center'>{submitErrorMessage}</div>}

        {newExpense.focus === true ?
          <div className='flex row justcont-spacebetween gap6'
            style={{ marginTop: "10px" }}
            ref={operatorRef}
          >
            <span id='operator'>+</span>
            <span id='operator'>-</span>
            <span id='operator'>x</span>
            <span id='operator'>/</span>
            <span id='operator'>=</span>
          </div> : ""}
      </div>
    </div>
  )
}

export default NewExpense
