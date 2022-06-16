import { useState, useRef, useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { setSelectedGroup } from '../redux/mainSlice'
import populateLabels from '../utility/populateLabels'
import useAxios from '../utility/useAxios'
import store from '../redux/store'
import IonIcon from '@reacticons/ionicons'
import currency from 'currency.js'

function AddExpense2({ setSearchParams }) {
  const api = useAxios()
  const dispatch = useDispatch()
  const selectedGroup = store.getState().mainReducer.selectedGroup
  const sessionData = store.getState().authReducer.sessionData
  const abortControllerRef = useRef(null)
  const [loading, setLoading] = useState(false)
  const [includeAll, setIncludeAll] = useState(true)
  const [splitEqually, setSplitEqually] = useState(true)
  const [newExpense, setNewExpense] = useState({
    splitEqually: true,
    amount: '',
    description: '',
    labels: [],
    participants: selectedGroup?.members.map(member => ({ memberId: member._id, contributionAmount: "" }))
  })

  let totalContributed = 0
  newExpense.participants?.map((participant) => {
    totalContributed = currency(totalContributed).add(participant?.contributionAmount)
  })

  //console.log(newExpense.amount === "" || Number(newExpense.amount) === 0)
  //filters array of objects and only keeps those members that were clicked 
  const filteredGroupMembers = selectedGroup?.members.filter(
    function (e) {
      return this?.indexOf(e._id) > -1;
    },
    newExpense.participants?.map(participant => participant.memberId)
  );


  const changeMemberContributionAmount = (e, participantClickedId, isPct) => {
    let amount
    console.log(e.target.value)
    if (isPct) { //if user enters %age, calculate amount
      amount = currency(newExpense.amount).multiply(e.target.value / 100).value
      
    } else { //else use amount entered
      amount = e.target.value
    }
  
    const index = newExpense.participants?.findIndex(participant => participant.memberId === participantClickedId)
    setNewExpense({
      ...newExpense,
      participants: [
        ...newExpense.participants?.slice(0, index),
        Object.assign({}, newExpense.participants[index], { contributionAmount: amount }),
        ...newExpense.participants?.slice(index + 1)
      ]
    })
  }

  const addCommas = num => num?.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  const removeCommas = num => num?.toString().replace(/,/g, '');
  const removeNonNumeric = num => num?.toString().replace(/[^0-9.]/g, "")
  const process = (input) => {
    const index = input.indexOf('.');
    if (index > -1) {
      input = input.substr(0, index + 1) + input.slice(index).replace(/\./g, '');
    }
    return input;
  }

  useEffect(() => {
    abortControllerRef.current = new AbortController()

    return () => {
      abortControllerRef.current.abort()

    }
    // eslint-disable-next-line
  }, [])

  // const handleBack = (e) => {
  //   console.log("popstate event detected")
  //   //e.preventDefault();
  //   //window.history.go(1)//same as history.forward() ->goes forward one page
  //   dispatch(closeSlidingLeftBox())
  // }

  // const handleCloseSlidingLeft = () => {
  //   window.history.go(-1)
  // }


  const submitExpense = async () => {
    console.log("submitted")
    if (!newExpense.amount) return
    if (!loading) {
      setLoading(true)
      try {
        const res = await api.post('expense/add',
          {
            groupId: selectedGroup._id,
            sender: sessionData.userId,
            splitEqually: newExpense.splitEqually,
            amount: removeCommas(newExpense.amount),
            description: newExpense.description,
            tobeSharedWith: newExpense.participants,
            expenseTags: newExpense.labels,
          },
          { signal: abortControllerRef.current.signal })
        dispatch(setSelectedGroup(populateLabels(res.data)))
        setLoading(false)
      }
      catch (error) {
        console.log(error)
        setLoading(false)
      }
    }
    //dispatch(closeSlidingLeftBox())
    setSearchParams({}) //close menu
  }

  const labelClicked = (labelClickedId) => {
    if (newExpense.labels.includes(labelClickedId)) {
      setNewExpense({ ...newExpense, labels: newExpense.labels.filter(label => label !== labelClickedId) })
    }
    else {
      setNewExpense({ ...newExpense, labels: [...newExpense.labels, labelClickedId] })
      // Uncomment if only one label is allowed
      // setNewExpense({...newExpense, labels: [labelClickedId]})
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
            className='styledInput t3 text-align-right'
            type='tel'
            placeholder='0'
            step="0.01"
            value={newExpense.amount}
            onChange={e => setNewExpense({ ...newExpense, amount: process(addCommas(removeNonNumeric(e.target.value.toString().split(".").map((el, i) => i ? el.split("").slice(0, 2).join("") : el).join(".")))) })}
            autoFocus={true}
            spellCheck='false'
          />
        </div>

        <input
          className='styledInput t3'
          placeholder='Description (optional)'
          value={newExpense.description}
          onChange={e => setNewExpense({ ...newExpense, description: e.target.value })}
          spellCheck='false'

        />

        <div className='flex row wrap gap10'>
          {selectedGroup?.groupTags.map(label => (
            <div className={`pill pointer shadow ${newExpense.labels?.includes(label._id) ? 'filled' : 'empty'}`}
              key={label._id} style={{ '--pill-color': `var(--${label.color})` }}
              onClick={() => labelClicked(label._id)}
            >
              {label.name}
            </div>))}
        </div>

        {/* <div className='t4 medium flex row justcont-start alignitems-center gap6 pointer' onClick={includeAllClick}>
          <IonIcon className='t3' name={`${includeAll ? 'checkbox' : 'square-outline'}`} />
          Split equally among all members
        </div> */}

        <div style={{ borderRadius: "4px", padding: "0.8rem", border: "none", color: "var(--light-color)", fontSize: "16px", backgroundColor: "#3a3b3c" }}>
          <div className='shadow flex relative justcont-spacebetween' style={{ boxShadow: "none" }}>
            <div style={{ alignSelf: "center" }}>Split among all</div>
            <div className='tick-cube' onClick={includeAllClick}> {includeAll ? <i style={{ cursor: "pointer", fontSize: "29px", bottom: "0px", color: "var(--label-color-1)" }} className='check icon absolute'></i> : ""} </div>
          </div>

          {!includeAll &&
            <div style={{ marginTop: "10px" }}>
              <div style={{ marginBottom: "10px", fontSize: "12px" }}>Select members to split expense with.</div>
              <div className='flex row wrap gap10'>
                {selectedGroup.members.map(member => (
                  <div className={`pill pointer shadow ${newExpense?.participants.map(participants => participants.memberId).includes(member._id) ? 'filled' : 'empty'}`}
                    key={member._id} style={{ '--pill-color': `gray` }}
                    onClick={() => participantClicked(member._id)}
                  >
                    {member.nickname}
                  </div>))}
              </div>
            </div>}
        </div>


        <div style={{ borderRadius: "4px", padding: "0.8rem", border: "none", color: "var(--light-color)", fontSize: "16px", backgroundColor: "#3a3b3c" }}>
          <div className='shadow flex relative justcont-spacebetween' style={{ boxShadow: "none" }}>
            <div style={{ alignSelf: "center" }}>Split equally</div>
            <div className='tick-cube' onClick={splitEquallyClick}> {splitEqually ? <i style={{ fontSize: "29px", bottom: "0px", color: "var(--label-color-1)" }} className='check icon absolute'></i> : ""} </div>
          </div>
          {!splitEqually &&
            <div style={{ marginTop: "18px" }}>
              {/* {beginning of tree} */}
              <div className='tree' style={{ bottom: "5px", margin: "0 0 -15px 0" }}>
                <div className='flex row justcont-spacebetween'>
                  <div className='flex' style={{ maxWidth: "0px", marginLeft: "5px" }}>{removeCommas(newExpense.amount)}</div>
                  <div className='flex' style={{ marginLeft: "50px", fontSize: "13px" }}> Split by amount</div>
                  <span className='flex ' style={{ fontSize: "13px" }}>Split by %</span>
                </div>
                <ul style={{ marginLeft: "5px" }} >
                  {(includeAll ? selectedGroup?.members : filteredGroupMembers)?.map(member => (
                    <li key={member._id}>
                      <div className='flex justcont-spacebetween alignitems-center' >
                        <div style={{ maxWidth: "40px" }}>
                          {member.nickname}
                        </div>
                        <div className=''>
                          <input
                            style={{ maxWidth: "55px" }}
                            className='t3 text-align-right'
                            type='tel'
                            placeholder='0'
                            step="0.01"
                            value={newExpense.participants.find(participant => participant.memberId === member._id)?.contributionAmount || ''} //otherwise it complains for uncontrolled input due to undefined selectedGroup on 1st render
                            // onChange={e => setNewExpense({ ...newExpense, amount: process(addCommas(removeNonNumeric(e.target.value.toString().split(".").map((el, i) => i ? el.split("").slice(0, 2).join("") : el).join(".")))) })}
                            onChange={(e) => changeMemberContributionAmount(e, member._id)}
                            //autoFocus={true}
                            spellCheck='false'
                          />
                        </div>
                        <div className=''>
                          <input
                            style={{ maxWidth: "55px" }}
                            className='t3 text-align-right'
                            type='tel'
                            //placeholder={(newExpense.amount === "" || Number(newExpense.amount) === 0 )? "" : currency(newExpense.participants.find(participant => participant.memberId === member._id)?.contributionAmount).divide(newExpense.amount).value * 100 || ''}
                            step="0.01"
                            placeholder='0'
                            value={(newExpense.amount === "" || Number(newExpense.amount) === 0 )? "" : currency(newExpense.participants.find(participant => participant.memberId === member._id)?.contributionAmount).divide(newExpense.amount).value * 100 || ''}
                            onChange={(e) => changeMemberContributionAmount(e, member._id, true)}
                            spellCheck='false'
                          />
                        </div>
                     
                      </div>
                    </li>))}
                </ul>
              </div>
              {/* {end of tree} */}
              <div className='flex row justcont-spacebetween'>
                <div className='flex' style={{ maxWidth: "0px", marginLeft: "5px", marginTop: "0.7rem" }}></div>
                <div className='flex' style={{ marginLeft: "82px", fontSize: "13px", marginTop: "0.7rem" }}>

                  {currency(removeCommas(newExpense.amount)).subtract(totalContributed.value).value} remaining

                </div>
                <span className='flex ' style={{ fontSize: "13px", marginTop: "0.7rem" }}>30% remaining</span>
              </div>
            </div>
          }

        </div>
      </div>
      <div className='submit-button-container flex padding1010'>
        <button
          style={{ padding: "0.8rem" }}
          className={`shadow submit-button ${Number(newExpense.amount) !== 0 && splitEqually ? "active"
            :
            Number(newExpense.amount) !== 0 && currency(removeCommas(newExpense.amount)).subtract(totalContributed.value).value === 0 ?
              "active"
              :
              null} h-flex justcont-spacearound `}
          onClick={submitExpense}
          disabled={newExpense.amount && Number(newExpense.amount) !== 0 ? false : true}>
          {loading ? <IonIcon name='sync' className='t3 spin' /> : "Submit"}
        </button>
      </div>
    </div>
  )
}

export default AddExpense2
