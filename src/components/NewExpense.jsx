import IonIcon from '@reacticons/ionicons'
import currency from 'currency.js'
import { useState, useRef, useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { setSelectedGroup } from '../redux/mainSlice'
import useAxios from '../utility/useAxios'
import { useSelector } from 'react-redux'
import store from '../redux/store'

const NewExpense = ({ close }) => {
  const api = useAxios()
  const dispatch = useDispatch()
  const selectedGroup = useSelector(state => state.mainReducer.selectedGroup)
  const abortControllerRef = useRef(null)
  const sessionData = store.getState().authReducer.sessionData
  const [submitLoading, setSubmitLoading] = useState(false)
  const [newExpense, setNewExpense] = useState({
    splitEqually: true,

    amount: '',
    description: '',
    label: null,
    participants: selectedGroup?.members.map(member => ({ memberId: member._id, contributionAmount: '' })),
    spenders: [{ spenderId: sessionData.userId, spenderAmount: '' }],
    includeNewMemberToThisExpense: true,
    paidbyYouClicked: true
  })

  const [submitErrorMessage, setSubmitErrorMessage] = useState('')
  const [newExpenseErrorMessages, setNewExpenseErrorMessages] = useState({})
  console.log(newExpense)
  // console.log(JSON.stringify(newExpenseErrorMessages, null, 2))

  useEffect(() => {
    setNewExpense({ ...newExpense, participants: selectedGroup?.members.map(member => ({ memberId: member._id, contributionAmount: '' })) })
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

  // useEffect(()=>{
  //   console.log("UseEffect ran")
  //   distributeEqually()
  // },[newExpense.amount, newExpense.spender])

  const submitExpense = async () => {
    if (!submitLoading) {
      setSubmitErrorMessage('')
      setNewExpenseErrorMessages({})
      setSubmitLoading(true)
      try {
        const res = await api.post('expense/add', { newExpense: { ...newExpense, groupId: selectedGroup._id } }, { signal: abortControllerRef.current.signal })
        if (res.data.validationArray) {
          const tempErrorMessages = {}
          res.data.validationArray.reverse().forEach(err => {
            tempErrorMessages[err.field] = err.message
          })
          setNewExpenseErrorMessages(tempErrorMessages)
          setSubmitLoading(false)
        }
        else {
          dispatch(setSelectedGroup(res.data))
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

  const removedContributionAmountErrors = () => {
    const contributionAmountErrorMessages = {}
    for (const field in newExpenseErrorMessages) {
      if (/^participants\[[0-9]+]\.contributionAmount$/.test(field)) {
        contributionAmountErrorMessages[field] = null
      }
    }
    return (contributionAmountErrorMessages)
  }

  const participantClicked = (participantClickedId) => {
    setNewExpenseErrorMessages({ ...newExpenseErrorMessages, participants: null, ...removedContributionAmountErrors() })
    if (newExpense.participants.map(participants => participants?.memberId).includes(participantClickedId)) {
      setNewExpense({ ...newExpense, participants: newExpense.participants.filter(participant => participant.memberId !== participantClickedId) })
    }
    else {
      setNewExpense({ ...newExpense, participants: [...newExpense.participants, { memberId: participantClickedId, contributionAmount: '' }] })
    }
  }
//spenders: newExpense.spenders.map(_spender => (_spender.spenderId === spender.spenderId) ? { ...spender, spenderAmount: e.target.value } : _spender)
  const spenderClicked = (spenderID) => {
    setNewExpenseErrorMessages({ ...newExpenseErrorMessages, spenders: null, ...removedContributionAmountErrors() })
    console.log(newExpense.spenders.length)
    if (newExpense.spenders.map(spender => spender?.spenderId).includes(spenderID)) {
      setNewExpense({ ...newExpense, spenders: newExpense.spenders.filter(spender => spender.spenderId !== spenderID) })
    }
    else {
      //const distributedExpense=currency(newExpense.amount).distribute(newExpense.spenders.length+1).map(e=>e.value)
      setNewExpense({ ...newExpense, spenders:[...newExpense.spenders, { spenderId: spenderID, spenderAmount:"" }]})
      //setNewExpense({ ...newExpense, spenders:[...newExpense.spenders, { spenderId: spenderID, spenderAmount:distributedExpense[index] }]})
    }
  }

//spenders: (newExpense.spenders.length === 1? newExpense.spenders.map(spender => ({ ...spender, spenderAmount: e.target.value })):"" )
  const paidByClicked = () => {

    setNewExpenseErrorMessages({ ...newExpenseErrorMessages, ...removedContributionAmountErrors() })
    if (newExpense.spenders.length > 1) {
      setNewExpense(prev => ({ ...newExpense, paidbyYouClicked: !prev.paidbyYouClicked, spenders: [{ spenderId: sessionData.userId, spenderAmount: newExpense.amount }] }))
    } else if (newExpense.spenders.length === 1 && newExpense.spenders[0].spenderId === sessionData.userId) {
      setNewExpense(prev => ({ ...newExpense, paidbyYouClicked: !prev.paidbyYouClicked, spenders: [] }))
    }
    else { setNewExpense(prev => ({ ...newExpense, paidbyYouClicked: !prev.paidbyYouClicked, spenders: [{ spenderId: sessionData.userId, spenderAmount: newExpense.amount }] })) }
  }

  // const allMembers = () => {
  //   if (newExpense.participants) {
  //     return selectedGroup.members.length === newExpense.participants.length
  //   }
  //   else return true
  //}

  const allClick = () => {
    setNewExpenseErrorMessages({ ...newExpenseErrorMessages, splitEqually: null, participants: null, ...removedContributionAmountErrors() })

    if (allMembers()) {
      setNewExpense({ ...newExpense, participants: [] })
    }
    else {
      setNewExpense({ ...newExpense, participants: selectedGroup?.members.map(member => ({ memberId: member._id, contributionAmount: '' })) })
    }
  }

  const equalClick = () => {
    setNewExpenseErrorMessages({ ...newExpenseErrorMessages, ...removedContributionAmountErrors() })

    if (newExpense.splitEqually) {
      setNewExpense({ ...newExpense, splitEqually: false })
    }
    else {
      setNewExpense({ ...newExpense, splitEqually: true, participants: newExpense.participants.map(participant => ({ memberId: participant.memberId, contributionAmount: '' })) })
    }
  }

  const LabelSection = () => {
    return (
      <div className='bubble flex column' style={{ fontSize: '16px', fontWeight: '700', backgroundColor: '#151517' }}>
        <div style={{ color: '#b6bfec' }}>Label</div>
        <div className='flex row wrap' style={{ gap: '14px', padding: '0px 0px 6px 0px' }}>
          {selectedGroup?.groupLabels.map(label => (
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
      <div className='bubble flex column' style={{ fontSize: '16px', fontWeight: '700', backgroundColor: '#151517', borderBottomLeftRadius: newExpense.spenders.length >= 2 ? "0px" : "", borderBottomRightRadius: newExpense.spenders.length >= 2 ? "0px" : "" }}>
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
            {selectedGroup.members?.map((member,index) => (
              <div
                key={member._id}
                className={`pill2 pointer shadow ${newExpense.spenders.map(spender => spender?.spenderId).includes(member._id) ? 'filled' : ''}`}
                onClick={() => spenderClicked(member._id, index)}
              >
                {member.nickname}
              </div>
            ))}
          </div>}
        {newExpenseErrorMessages.spenders && <div className='mailmsg t6'>{newExpenseErrorMessages.spenders}</div>}
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
                key={member._id}
                className={`pill2 pointer shadow ${newExpense.participants.map(participant => participant?.memberId).includes(member._id) ? 'filled' : ''}`}
                onClick={() => participantClicked(member._id)}
              >
                {member.nickname}
              </div>
            ))}
          </div>}
        {newExpenseErrorMessages.participants && <div className='mailmsg t6'>{newExpenseErrorMessages.participants}</div>}
      </div>
    )
  }


  //, spenders: (newExpense.spenders.length === 1? newExpense.spenders.map(spender => ({ ...spender, spenderAmount: e.target.value })):"" )
  const changeAmount = (e) => {
    setNewExpenseErrorMessages({ ...newExpenseErrorMessages, amount: null })
    setNewExpense({ ...newExpense, amount: e.target.value })
  }

  const changeDescription = (e) => {
    setNewExpenseErrorMessages({ ...newExpenseErrorMessages, description: null })
    setNewExpense({ ...newExpense, description: e.target.value })
  }

  const changeContribution = (e, participant, index) => {
    newExpenseErrorMessages['participants[' + index + '].contributionAmount'] = null
    newExpenseErrorMessages.splitEqually = null
    console.log(newExpenseErrorMessages)
    setNewExpense(
      {
        ...newExpense,
        participants: newExpense.participants.map(_participant => (_participant.memberId === participant.memberId) ? { ...participant, contributionAmount: e.target.value } : _participant)
      }
    )
  }

  const changePaidByMany = (e, spender, index) => {
    newExpenseErrorMessages['spenders[' + index + '].spenderAmount'] = null
    newExpenseErrorMessages.paidByMany = null
    setNewExpense(
      {
        ...newExpense,
        spenders: newExpense.spenders.map(_spender => (_spender.spenderId === spender.spenderId) ? { ...spender, spenderAmount: e.target.value } : _spender)
      })
  }

  // const distributeEqually = () => {
  //   if (newExpense.splitEqually === true) {
  //     newExpenseErrorMessages.splitEqually = null
  //     for (let i = 0; i < newExpense.participants.length; i++) {
  //       newExpenseErrorMessages['participants[' + i + '].contributionAmount'] = null
  //     }
  //     const distributedAmountArray = currency(newExpense.amount)
  //       .distribute(newExpense.participants.length).map(e => e.value.toString()) //why is validator complaining about string in contribution amount?
  //     console.log(distributedAmountArray)
  //       setNewExpense({
  //       ...newExpense,
  //       participants: newExpense.participants.map((participant, index) => ({ ...participant, contributionAmount: distributedAmountArray[index] }))
  //     })
  //   } else return
  // }

  return (
    <div id='new-expense' className='flex column fixed'>
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
        {selectedGroup?.groupLabels.length !== 0 && <LabelSection />}
        <PaidBy />


        {newExpense.spenders.length >= 2 &&
          <div className='bubble flex column' style={{ fontSize: '16px', fontWeight: '700', backgroundColor: '#151517', marginTop: "-15px", borderTopLeftRadius: "0px", borderTopRightRadius: "0px" }}>
            <div className='flex column' style={{ gap: '14px' }}>
              {newExpense.spenders?.map((spender, index) => (
                <div key={spender.spenderId} className='flex row justcont-spacebetween alignitems-center' style={{ gap: '14px' }}>
                  <div style={{ flex: '1 1 auto', width: '100%', overflow: 'hidden', textOverflow: 'ellipsis', color: '#dddddd' }}>
                    {selectedGroup?.members?.find(member => member._id === spender?.spenderId)?.nickname}
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
                      borderColor: `${newExpenseErrorMessages['spenders[' + index + '].spenderAmount'] ? 'var(--pink)' : '#999999'}`,
                      borderWidth: '1px',
                      borderStyle: 'solid'
                    }}
                    id='styled-input'
                    onChange={e => changePaidByMany(e, spender, index)}
                    value={spender.spenderAmount}
                    autoComplete='off'
                  />
                </div>
              ))}
              <div style={{ fontSize: '12px', alignSelf: 'center' }}>
                REMAINING:&nbsp;
                {currency(newExpense.amount).subtract(newExpense.spenders.reduce(((sum, spender) => currency(sum).add(spender.spenderAmount).value), 0)).value}
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
                    {selectedGroup?.members?.find(member => member._id === participant?.memberId)?.nickname}
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
                      borderColor: `${newExpenseErrorMessages['participants[' + index + '].contributionAmount'] ? 'var(--pink)' : '#999999'}`,
                      borderWidth: '1px',
                      borderStyle: 'solid'
                    }}
                    id='styled-input'
                    onChange={e => changeContribution(e, participant, index)}
                    value={participant.contributionAmount}
                    autoComplete='off'
                  />
                </div>
              ))}
              <div style={{ fontSize: '12px', alignSelf: 'center' }}>
                REMAINING:&nbsp;
                {currency(newExpense.amount).subtract(newExpense.participants.reduce(((sum, participant) => currency(sum).add(participant.contributionAmount).value), 0)).value}
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
      </div>
    </div>
  )
}

export default NewExpense
