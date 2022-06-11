import { useState, useRef } from 'react'
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
    amount: '',
    description: '',
    labels: [],
    participants: selectedGroup?.members.map(member => member._id)
  })
  const [participantArr, setParticipantArr] = useState([])

  console.log(participantArr)
  console.log("participants", selectedGroup?.members)

  const addCommas = num => num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  const removeCommas = num => num.toString().replace(/,/g, '');
  const removeNonNumeric = num => num.toString().replace(/[^0-9.]/g, "")
  const process = (input) => {
    const index = input.indexOf('.');
    if (index > -1) {
      input = input.substr(0, index + 1) + input.slice(index).replace(/\./g, '');
    }
    return input;
  }

  // useEffect(() => {
  //   abortControllerRef.current = new AbortController()
  //   window.addEventListener('popstate', handleBack);
  //   return () => {
  //     abortControllerRef.current.abort()
  //     window.removeEventListener('popstate', handleBack)
  //   }
  // // eslint-disable-next-line
  // }, [])

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
    console.log("sdfdsfg")
    if (!newExpense.amount) return
    if (!loading) {
      setLoading(true)
      try {
        const res = await api.post('expense/add',
          {
            groupId: selectedGroup._id,
            sender: sessionData.userId,
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
    if (newExpense.participants.includes(participantClickedId)) {
      setNewExpense({ ...newExpense, participants: newExpense.participants.filter(participant => participant !== participantClickedId) })
      setParticipantArr(participantArr.filter(participant => participant._id !== participantClickedId))
    }
    else {
      setParticipantArr([...participantArr, selectedGroup.members.filter(member => member._id === participantClickedId)[0]]) // KAKI PATENTA
      setNewExpense({ ...newExpense, participants: [...newExpense.participants, participantClickedId] })
    }
  }

  const includeAllClick = () => {
    if (includeAll) {
      setNewExpense({ ...newExpense, participants: [] })
      setIncludeAll(false)
    }
    else {

      setNewExpense({ ...newExpense, participants: [...selectedGroup.members.map(member => member._id)] })
      setIncludeAll(true)
    }
  }

  const splitEquallyClick = () => {
    if (splitEqually) {

      setSplitEqually(false)
    }
    else {

      setSplitEqually(true)
    }
  }

  const Tree = ({ members }) => {
    return (
      <div className='tree' style={{ bottom: "5px", margin: "0 0 -15px 0" }}>
        <ul>
          {members?.map(member => (
            <li key={member._id}>
              <div className='flex justcont-spacebetween alignitems-center' >
                <div style={{ maxWidth: "15px" }}>
                  {member.nickname}
                </div>
                <div className=''>
                  <input
                    style={{maxWidth:"45px"}}
                    className='t3 text-align-right'
                    type='tel'
                    placeholder='0'
                    step="0.01"
                    value={newExpense.amount}
                    //onChange={e => setNewExpense({ ...newExpense, amount: process(addCommas(removeNonNumeric(e.target.value.toString().split(".").map((el, i) => i ? el.split("").slice(0, 2).join("") : el).join(".")))) })}
                    //autoFocus={true}
                    spellCheck='false'
                  />
                  </div>
                <div className=''>sdf</div>
              </div>
            </li>))}
        </ul>
      </div>
    )
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
            <div className={`pill pointer shadow ${newExpense.labels.includes(label._id) ? 'filled' : 'empty'}`}
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
                  <div className={`pill pointer shadow ${newExpense.participants.includes(member._id) ? 'filled' : 'empty'}`}
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
            <div style={{ marginTop: "10px" }}>
              <span className='flex justcont-center'>
                Split unequally
              </span>
              <Tree members={includeAll ? selectedGroup?.members : participantArr} />
            </div>
          }
        </div>

      </div>
      <div className='submit-button-container flex padding1010'>
        <button
          style={{ padding: "0.8rem" }}
          className={`shadow submit-button ${newExpense.amount && Number(newExpense.amount) !== 0 ? "active" : null} h-flex justcont-spacearound `}
          onClick={submitExpense}
          disabled={newExpense.amount && Number(newExpense.amount) !== 0 ? false : true}>
          {loading ? <IonIcon name='sync' className='t3 spin' /> : "Submit"}
        </button>
      </div>
    </div>
  )
}

export default AddExpense2
