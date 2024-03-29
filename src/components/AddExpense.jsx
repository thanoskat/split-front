import { useState, useRef, useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { setSelectedGroup } from '../redux/mainSlice'
import useAxios from '../utility/useAxios'
import store from '../redux/store'
import IonIcon from '@reacticons/ionicons'
import currency from 'currency.js'

function AddExpense({ setSearchParams }) {
  const api = useAxios()
  const dispatch = useDispatch()
  const selectedGroup = store.getState().mainReducer.selectedGroup
  const sessionData = store.getState().authReducer.sessionData
  const abortControllerRef = useRef(null)

  const [loading, setLoading] = useState(false)
  const [includeAll, setIncludeAll] = useState(true)
  const [splitEqually, setSplitEqually] = useState(true)
  const precision = 4
  const [newExpense, setNewExpense] = useState({
    populatingPercentage: false,
    splitEqually: true,
    amount: '',
    description: '',
    label: null,
    participants: selectedGroup?.members.map(member => ({ memberId: member._id, contributionAmount: '', percentage: '' }))
  })
  const inputAmountRef = useRef(null)

  //console.log('participants', newExpense.participants?.length !== 0)

  const addCommas = num => num?.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
  const removeCommas = num => num?.toString().replace(/,/g, '')
  const removeNonNumeric = num => num?.toString().replace(/[^0-9.]/g, '')
  const process = (input) => {
    const index = input.indexOf('.')
    if (index > -1) {
      input = input.substr(0, index + 1) + input.slice(index).replace(/\./g, '')
    }
    return input
  }

  const rounding = value => currency(value, { increment: .05 })
  let totalContributed = 0
  let totalpercentage = 0
  newExpense.participants?.forEach((participant) => {
    totalContributed = currency(totalContributed).add(participant?.contributionAmount)
    totalpercentage = currency(totalpercentage).add(participant?.percentage)
  })
  const remainingAmount = currency((newExpense.amount), { precision }).subtract(totalContributed.value).value

  const remaining = () => {
    const remainingAmount = currency((newExpense.amount), { precision }).subtract(totalContributed.value).value
    const remainingPercentage = currency(100, { precision }).subtract(totalpercentage.value).value
    //console.log(remainingAmount,remainingPercentage)
    //console.log(isNaN(removeCommas(newExpense.amount)))
    if (newExpense.populatingPercentage === true) {
      if (remainingPercentage === 0 && remainingAmount !== 0) {
        let stateParticipantsArr = [...newExpense.participants]
        const currentParticipants = newExpense.participants?.filter(participant => (typeof participant.contributionAmount === 'string' || typeof participant.contributionAmount === 'number') && (participant.contributionAmount !== 0 && participant.percentage !== 0))
        const distrArr = currency(remainingAmount).distribute(currentParticipants.length).map(element => element.value)
        //console.log(distrArr.map(x => currency(x, { precision: 5 }).divide(2).value))
        const distArrAdjusted = distrArr.map(x => currency(x, { precision: 5 }).divide(2).value)//divide by 2 because function runs twice (double render due to 2 cells being updated at the same time). Therefore distributed amount has to be halfed and added twice
        let counter = 0
        stateParticipantsArr?.map((tempParticipant) => {
          currentParticipants?.map((participant) => {
            if (participant.memberId === tempParticipant.memberId) {
              //console.log('before',tempParticipant.contributionAmount)
              tempParticipant.contributionAmount = currency(tempParticipant.contributionAmount, { precision }).add(distArrAdjusted[counter]).value
              //console.log('after',tempParticipant.contributionAmount)
              counter = counter + 1
            }
            return true
          })
          return true
        })
      }
    } else {
      if (remainingPercentage !== 0 && remainingAmount === 0) {
        let stateParticipantsArr = [...newExpense.participants]
        const currentParticipants = newExpense.participants?.filter(participant => (typeof participant.contributionAmount === 'string' || typeof participant.contributionAmount === 'number') && (participant.contributionAmount !== 0 && participant.percentage !== 0))
        const distrArr = currency(remainingPercentage).distribute(currentParticipants.length).map(element => element.value)
        //console.log(distrArr.map(x => currency(x, { precision: 5 }).divide(2).value))
        const distArrAdjusted = distrArr.map(x => currency(x, { precision: 5 }).divide(2).value)//divide by 2 because function runs twice (double render due to 2 cells being updated at the same time). Therefore distributed amount has to be halfed and added twice
        let counter = 0
        stateParticipantsArr?.map((tempParticipant) => {
          currentParticipants?.map((participant) => {
            if (participant.memberId === tempParticipant.memberId) {
              //console.log('before',tempParticipant.percentage)
              tempParticipant.percentage = currency(tempParticipant.percentage, { precision }).add(distArrAdjusted[counter]).value
              //console.log('after',tempParticipant.percentage)
              counter = counter + 1
            }
            return true
          })
          return true
        })
      }
    }
    return { remainingAmount, remainingPercentage }
  }

  const filteredGroupMembers = selectedGroup?.members.filter(
    function (e) {
      return this?.indexOf(e._id) > -1
    },
    newExpense.participants?.map(participant => participant.memberId)
  )

  useEffect(() => {
    abortControllerRef.current = new AbortController()
    setTimeout(()=>{
      inputAmountRef.current.focus()
    },300)
    return () => {
      abortControllerRef.current.abort()
    }
    // eslint-disable-next-line
  }, [])


  const changeMemberContributionAmount = (e, participantClickedId) => {
    if ((newExpense.amount === '' || Number(newExpense.amount) === 0)) return
    const index = newExpense.participants?.findIndex(participant => participant.memberId === participantClickedId)
    const { target: { name, value } } = e
    setNewExpense({ ...newExpense, participants: { [name]: value } })
    switch (name) {
      case 'percentage':
        const newAmount = rounding(currency(value, { precision }).divide(100).multiply(newExpense.amount).value).value   // Assuming fullAmount set in state
        //const newAmount = currency(value, { precision }).divide(100).multiply(newExpense.amount).value
        console.log('newAmount', newAmount)
        setNewExpense({
          ...newExpense,
          populatingPercentage: true,
          participants: [
            ...newExpense.participants?.slice(0, index),
            Object.assign({}, newExpense.participants[index], { contributionAmount: newAmount, percentage: value }),
            ...newExpense.participants?.slice(index + 1)
          ]
        })
        break
      case 'contributionAmount':
        const newPercent = rounding(currency(value, { precision }).multiply(100).divide(newExpense.amount).value).value
        // const newPercent = currency(value, { precision }).multiply(100).divide(newExpense.amount).value
        // console.log('newPercent', newPercent)
        setNewExpense({
          ...newExpense,
          populatingPercentage: false,
          participants: [
            ...newExpense.participants?.slice(0, index),
            Object.assign({}, newExpense.participants[index], { contributionAmount: value, percentage: newPercent }),
            ...newExpense.participants?.slice(index + 1)
          ]
        })
        break
      default:
        break
    }
  }

  const updateAmount = (e) => {
    setNewExpense({
      ...newExpense,
      amount:e.target.value //process(addCommas(removeNonNumeric(e.target.value.toString().split('.').map((el, i) => i ? el.split('').slice(0, 2).join('') : el).join('.'))))
    })
  }

  const submitExpense = async () => {
    if (!newExpense.amount) return
    if (!loading) {
      setLoading(true)
      try {
        const res = await api.post('expense/add2',
          {
            groupId: selectedGroup._id,
            spender: sessionData.userId,
            splitEqually: newExpense.splitEqually,
            amount: newExpense.amount,
            description: newExpense.description,
            participants: newExpense.participants,
            label: newExpense.label,
          },
          { signal: abortControllerRef.current.signal })
        dispatch(setSelectedGroup(res.data))
        setLoading(false)
        setSearchParams({}) //close menu
      }
      catch (error) {
        console.log(error)
        setLoading(false)
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

  const participantClicked = (participantClickedId) => {
    if (newExpense.participants.map(participants => participants.memberId).includes(participantClickedId)) {
      setNewExpense({ ...newExpense, participants: newExpense.participants.filter(participant => participant.memberId !== participantClickedId) })
    }
    else {
      setNewExpense({ ...newExpense, participants: [...newExpense.participants, { memberId: participantClickedId }] })
    }
  }

  const includeAllClick = () => {
    if (includeAll) {
      setNewExpense({ ...newExpense, participants: [] })
      setIncludeAll(false)
    }
    else {
      setNewExpense({ ...newExpense, participants: [...selectedGroup.members.map(member => ({ memberId: member._id }))] })
      setIncludeAll(true)
    }
  }

  const splitEquallyClick = () => {
    if (splitEqually) {
      if (includeAll) {
        setNewExpense({ ...newExpense, splitEqually: false, participants: [...selectedGroup.members.map(member => ({ memberId: member._id }))] })
      } else {
        setNewExpense({ ...newExpense, splitEqually: false })
      }
      setSplitEqually(false)

    }
    else {
      setNewExpense({ ...newExpense, splitEqually: true })
      setSplitEqually(true)
    }
  }
  
  return (
    <div className='addExpenseBox flex column fixed'>
      <div className='addExpenseHeader flex row t1  padding1010 gap10'>
        <div className='cancelIcon alignself-center' onClick={() => setSearchParams({})}>
          <i className='arrow left icon t3'></i>
        </div>
        <div>
          Add expense
        </div>
        <div className='separator-0' />
      </div>
      <div className='inputsAndOptions-container flex column gap10 padding1010'>
        <div className='input-amount flex relative column justcont-evenly '>
          <div className='currency-ticker-section '>
            <i className='angle down icon'></i>
            <div className='currency-ticker'>EUR </div>
          </div>
          <input
            ref={inputAmountRef}
            className='styledInput t3 text-align-right'
            type='tel'
            placeholder='0'
            step='0.01'
            value={newExpense.amount}
            onChange={(e) => updateAmount(e)}
            //autoFocus={true}
            spellCheck='false'
          />
        </div>
        <input
          className='styledInput t3'
          placeholder='Description'
          value={newExpense.description}
          onChange={e => setNewExpense({ ...newExpense, description: e.target.value })}
          spellCheck='false'
        />
        <div className='flex row wrap gap10'>
          {selectedGroup?.groupLabels.map(label => (
            <div className={`pill2 pointer shadow`}
              key={label._id} style={{ color: `${newExpense.label === label._id ? 'var(--'+label.color+')' : 'gray'}` }}
              onClick={() => labelClicked(label._id)}
            >
              {label.name}
            </div>))}
        </div>
        {/* <div className='t4 medium flex row justcont-start alignitems-center gap6 pointer' onClick={includeAllClick}>
          <IonIcon className='t3' name={`${includeAll ? 'checkbox' : 'square-outline'}`} />
          Split equally among all members
        </div> */}
        <div style={{ borderRadius: '4px', padding: '0.8rem', border: 'none', color: 'var(--light-color)', fontSize: '16px', backgroundColor: '#3a3b3c' }}>
          <div className='shadow flex relative justcont-spacebetween' style={{ boxShadow: 'none' }}>
            <div style={{ alignSelf: 'center' }}>Split among all</div>
            <div className='tick-cube' onClick={includeAllClick}> {includeAll ? <i style={{ cursor: 'pointer', fontSize: '29px', bottom: '0px', color: 'var(--label-color-1)' }} className='check icon absolute'></i> : ''} </div>
          </div>
          {!includeAll &&
            <div style={{ marginTop: '10px' }}>
              <div style={{ marginBottom: '10px', fontSize: '12px' }}>Select members to split expense with.</div>
              <div className='flex row wrap gap10'>
                {selectedGroup.members.map(member => (
                  <div className={`pill pointer shadow ${newExpense?.participants.map(participants => participants.memberId).includes(member._id) ? 'filled' : 'empty'}`}
                    key={member._id} style={{ '--pill-color': `gray` }}
                    onClick={() => participantClicked(member._id)}>
                    {member.nickname}
                  </div>))}
              </div>
            </div>}
        </div>
        <div id={!splitEqually && newExpense?.participants.length === 0 ? 'warningBorder' : ''} style={{ borderRadius: '4px', padding: '0.8rem', color: 'var(--light-color)', fontSize: '16px', backgroundColor: '#3a3b3c' }}>
          <div className='shadow flex relative justcont-spacebetween' style={{ boxShadow: 'none' }}>
            <div style={{ alignSelf: 'center' }}>Split equally</div>
            <div className='tick-cube' onClick={splitEquallyClick}> {splitEqually ? <i style={{ fontSize: '29px', bottom: '0px', color: 'var(--label-color-1)' }} className='check icon absolute'></i> : ''} </div>
          </div>
          {!splitEqually && newExpense?.participants.length !== 0 ?
          <div style={{ marginTop: '40px' }}>
            {/* {beginning of tree} */}
            <div id='unequalTree' style={{ bottom: '5px', margin: '0 0 -15px 0' }}>
              <div className='flex row justcont-spacebetween'>
                <div className='flex' style={{ maxWidth: '0px' }}>
                  <div style={{ fontSize: '13px' }}>
                    Split unequally
                    <div style={{ marginTop: '5px' }}>
                      {!newExpense.amount ?
                        ''
                        :
                        <span>€</span>}
                      <span>{newExpense.amount}</span>
                    </div>
                  </div>
                </div>
                {/* <div className='flex' style={{ marginLeft: '50px', fontSize: '13px' }}> Split by €</div>
                <span className='flex ' style={{ fontSize: '13px', marginRight: '8px' }}>Split by %</span> */}
              </div>
              <ul style={{ marginLeft: '5px' }} >
                {(includeAll ? selectedGroup?.members : filteredGroupMembers)?.map(member => (
                  <li key={member._id}>
                    <div className='flex justcont-spacebetween alignitems-center' >
                      <div style={{ maxWidth: '40px' }}>
                        {member.nickname}
                      </div>
                      <div className='input-amount flex relative column justcont-evenly '>
                        <div className='currency-ticker-section ' style={{color:'var(--inactiveColor)'}}>
                          €
                        </div>
                        <input
                          style={{ maxWidth: '75px' }}
                          className='styledInput t3 text-align-right'
                          type='tel'
                          placeholder='0'
                          step='0.01'
                          spellCheck='false'
                          name='contributionAmount'
                          value={(newExpense.amount === '' || Number(newExpense.amount) === 0) ? '' : newExpense.participants.find(participant => participant.memberId === member._id)?.contributionAmount || ''}
                          //value={dummy.contributionAmount }
                          onChange={e => changeMemberContributionAmount(e, member._id)}
                        //onChange={e => handleInputChange(e)}
                        />
                      </div>
                      <div className='input-amount flex relative column justcont-evenly '>
                        <div className='currency-ticker-section ' style={{color:'var(--inactiveColor)'}}>
                          %
                        </div>
                        <input
                          style={{ maxWidth: '75px' }}
                          className='styledInput t3 text-align-right'
                          type='tel'
                          step='0.01'
                          placeholder='0'
                          spellCheck='false'
                          name='percentage'
                          value={(newExpense.amount === '' || Number(newExpense.amount) === 0) ? '' : newExpense.participants.find(participant => participant.memberId === member._id)?.percentage || ''}
                          //value={dummy.percentage}
                          onChange={e => changeMemberContributionAmount(e, member._id)}
                        //onChange={e => handleInputChange(e)}
                        />
                      </div>
                    </div>
                  </li>))}
              </ul>
            </div>
            {/* {end of tree} */}
            <div className='flex row justcont-spacebetween ' style={{marginLeft:'23px'}}>
              <div className='flex alignitems-center' style={{ width: '40px', marginTop: '0.7rem' }}></div>
              <div className='flex justcont-center' style={{ fontSize: '13px', marginTop: '0.7rem', gap: '3px', padding:'0.8rem',width: '75px' }}>
                <span>€</span>
                <span>{(newExpense.amount === '' || Number(newExpense.amount) === 0) ? '0' : remaining().remainingAmount}</span>
                <span>remaining</span>
              </div>
              <span className='flex justcont-center' style={{ fontSize: '13px', marginTop: '0.7rem' ,padding:'0.8rem',width: '75px'}}>
                {(newExpense.amount === '' || Number(newExpense.amount) === 0) ? '100' : remaining().remainingPercentage}
                %
              </span>
            </div>
          </div> : splitEqually ? '' :
          <div className='flex row' style={{ marginTop: '10px', fontSize: '12px', color: 'var(--pink)' }}>
            Select  members to split expense unequally.
          </div>}
        </div>
      </div>
      <div className='submit-button-container flex padding1010'>
        <button
          style={{ padding: '0.8rem' }}
          className={`shadow submit-button ${Number(newExpense.amount) !== 0 && splitEqually && newExpense.participants?.length !== 0 ? 'active'
            :
            Number(newExpense.amount) !== 0 &&
              currency(newExpense.amount, { precision }).subtract(totalContributed.value).value === 0 &&
              currency(100, { precision }).subtract(totalpercentage.value).value === 0 ?
              'active'
              :
              null} flex row justcont-spacearound `}
          onClick={submitExpense}
          disabled={newExpense.amount &&
            Number(newExpense.amount) !== 0 &&
            (!splitEqually? currency(newExpense.amount, { precision }).subtract(totalContributed.value).value === 0 &&
            currency(100, { precision }).subtract(totalpercentage.value).value === 0 :true) ? false : true}>
          {loading ? <IonIcon name='sync' className='t3 spin' /> : 'Submit'}
        </button>
      </div>
    </div>
  )
}

export default AddExpense
