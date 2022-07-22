import IonIcon from '@reacticons/ionicons'
import currency from 'currency.js'
import { useState, useRef, useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { setSelectedGroup } from '../redux/mainSlice'
import useAxios from '../utility/useAxios'
import { useSelector } from 'react-redux'
import { useSearchParams } from 'react-router-dom'

const NewExpense = ({ setSearchParams }) => {
  const api = useAxios()
  const dispatch = useDispatch()
  const selectedGroup = useSelector(state => state.mainReducer.selectedGroup)
  const abortControllerRef = useRef(null)
  const [searchParams] = useSearchParams()
  const [submitLoading, setSubmitLoading] = useState(false)
  const [newExpense, setNewExpense] = useState({
    splitEqually: true,
    amount: '',
    description: '',
    label: null,
    participants: selectedGroup?.members.map(member => ({ memberId: member._id, contributionAmount: '' })),
    guestId: (searchParams.get('user') === null ? 0 : searchParams.get('user'))
  })

  const [submitErrorMessage, setSubmitErrorMessage] = useState('')
  const [newExpenseErrorMessages, setNewExpenseErrorMessages] = useState({})
  // const userID = searchParams.get('user')
  //console.log(newExpense)
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
          setSearchParams({})
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
    if (newExpense.participants.map(participants => participants.memberId).includes(participantClickedId)) {
      setNewExpense({ ...newExpense, participants: newExpense.participants.filter(participant => participant.memberId !== participantClickedId) })
    }
    else {
      setNewExpense({ ...newExpense, participants: [...newExpense.participants, { memberId: participantClickedId, contributionAmount: '' }] })
    }
  }

  const allMembers = () => {
    if (newExpense.participants) {
      return selectedGroup.members.length === newExpense.participants.length
    }
    else return true
  }

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
      <div className='flex row wrap' style={{ gap: '14px' }}>
        {selectedGroup?.groupLabels.map(label => (
          <div className={`pill2 pointer shadow`}
            key={label._id} style={{ color: `${newExpense.label === label._id ? 'var(--' + label.color + ')' : '#606060'}` }}
            onClick={() => labelClicked(label._id)}
          >
            {label.name}
          </div>))}
      </div>)
  }

  const MemberSection = () => {
    return (
      <div className='bubble flex column' style={{ fontSize: '16px', fontWeight: '700', backgroundColor: '#151517' }}>
        <div
          className='flex row justcont-spacebetween alignitems-center pointer larger-click-area'
          onClick={allClick}
        >
          <div style={{ color: '#b6bfec' }}>Split among members</div>
          <div
            className='flex row alignitems-center'
            style={{ color: `${allMembers() ? 'white' : 'gray'}` }}
          >
            <div>All</div>
            <div className='flex row alignitems-center' style={{ fontSize: '24px' }}>
              {allMembers() && <svg xmlns="http://www.w3.org/2000/svg" aria-hidden="true" role="img" width="1em" height="1em" preserveAspectRatio="xMidYMid meet" viewBox="0 0 24 24"><path fill="currentColor" d="M19 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V5a2 2 0 0 0-2-2m0 2v14H5V5h14m-9 12l-4-4l1.41-1.42L10 14.17l6.59-6.59L18 9" /></svg>}
              {!allMembers() && <svg xmlns="http://www.w3.org/2000/svg" aria-hidden="true" role="img" width="1em" height="1em" preserveAspectRatio="xMidYMid meet" viewBox="0 0 24 24"><path fill="currentColor" d="M19 3H5c-1.11 0-2 .89-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V5a2 2 0 0 0-2-2m0 2v14H5V5h14Z" /></svg>}
            </div>
          </div>
        </div>
        {!allMembers() &&
          <div className='flex row wrap' style={{ gap: '14px' }}>
            {selectedGroup.members?.map(member => (
              <div
                className={`pill2 pointer shadow ${newExpense.participants.map(participant => participant.memberId).includes(member._id) ? 'filled' : ''}`}
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
    setNewExpense(
      {
        ...newExpense,
        participants: newExpense.participants.map(_participant => (_participant.memberId === participant.memberId) ? { ...participant, contributionAmount: e.target.value } : _participant)
      }
    )
  }

  return (
    <div id='new-expense' className='flex column fixed'>
      <div id='menu-header' className='flex row'>
        <div className='cancelIcon alignself-center pointer' onClick={() => setSearchParams({})}>
          <i className='arrow left icon'></i>
        </div>
        <div>
          New expense
        </div>
      </div>
      <div className='flex relative column'>
        <div style={{ fontSize: '18px', position: 'absolute', left: '14px', transform: 'translate(0, 50%)' }}>EUR</div>
        <input
          id='styled-input'
          className='text-align-right'
          type='text'
          inputmode='decimal'
          placeholder='0'
          value={newExpense.amount}
          onChange={e => changeAmount(e)}
          autoFocus={true}
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
      <MemberSection />
      <div className='bubble flex column' style={{ fontSize: '16px', fontWeight: '700', gap: '28px', backgroundColor: '#151517' }}>
        <div
          className='flex row justcont-spacebetween alignitems-center pointer'
          onClick={equalClick}
        >
          <div style={{ color: '#b6bfec' }}>Split</div>
          <div
            className='flex row alignitems-center'
            style={{ color: `${newExpense.splitEqually ? 'white' : 'gray'}` }}
          >
            <div>Equal</div>
            <div className='flex row alignitems-center' style={{ fontSize: '24px' }}>
              {newExpense.splitEqually && <svg xmlns="http://www.w3.org/2000/svg" aria-hidden="true" role="img" width="1em" height="1em" preserveAspectRatio="xMidYMid meet" viewBox="0 0 24 24"><path fill="currentColor" d="M19 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V5a2 2 0 0 0-2-2m0 2v14H5V5h14m-9 12l-4-4l1.41-1.42L10 14.17l6.59-6.59L18 9" /></svg>}
              {!newExpense.splitEqually && <svg xmlns="http://www.w3.org/2000/svg" aria-hidden="true" role="img" width="1em" height="1em" preserveAspectRatio="xMidYMid meet" viewBox="0 0 24 24"><path fill="currentColor" d="M19 3H5c-1.11 0-2 .89-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V5a2 2 0 0 0-2-2m0 2v14H5V5h14Z" /></svg>}
            </div>
          </div>
        </div>
        {!newExpense?.splitEqually && newExpense.participants.length > 0 &&
          <div className='flex column' style={{ gap: '14px' }}>
            {newExpense.participants?.map((participant, index) => (
              <div className='flex row justcont-spacebetween alignitems-center' style={{ gap: '14px' }}>
                <div style={{ flex: '1 1 auto', width: '100%', overflow: 'hidden', textOverflow: 'ellipsis', color: '#dddddd' }}>
                  {selectedGroup?.members?.find(member => member._id === participant.memberId)?.nickname}
                </div>
                <input
                  type='text'
                  inputmode='decimal'
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
          </div>}
      </div>
      <div style={{ marginTop: 'auto' }}>
        <div
          id='new-expense-submit'
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
