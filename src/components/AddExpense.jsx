import { SlidingLeftBox } from './'
import { useState, useEffect, useRef } from 'react'
import { useDispatch } from 'react-redux'
import { setSelectedGroup } from '../redux/mainSlice'
import { closeSlidingLeftBox } from '../redux/slidingLeftSlice'
import populateLabels from '../utility/populateLabels'
import useAxios from '../utility/useAxios'
import store from '../redux/store'
import IonIcon from '@reacticons/ionicons'


function AddExpense({ close }) {
  const api = useAxios()
  const dispatch = useDispatch()
  const selectedGroup = store.getState().mainReducer.selectedGroup
  const sessionData = store.getState().authReducer.sessionData
  const abortControllerRef = useRef(null)
  const [loading, setLoading] = useState(false)
  const [includeAll, setIncludeAll] = useState(true)
  const [newExpense, setNewExpense] = useState({
    amount: '',
    description: '',
    labels: [],
    participants: selectedGroup.members.map(member => member._id)
  })

  const addCommas = num => num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  const removeCommas = num => num.toString().replace(/\,/g, '');
  const removeNonNumeric = num => num.toString().replace(/[^0-9.]/g, "")
  // console.log(newExpense)

  useEffect(() => {
    abortControllerRef.current = new AbortController()
    window.addEventListener('popstate',handleBack); 
    return () => {
      abortControllerRef.current.abort()
      window.removeEventListener('popstate',handleBack)
    }
  }, [])

  const handleBack = (e)=>{
    console.log("popstate event detected")
    //e.preventDefault();
    window.history.go(1)//same as history.forward() ->goes forward one page
    dispatch(closeSlidingLeftBox())
  }

  const submitExpense = async () => {
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
    dispatch(closeSlidingLeftBox())
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
    }
    else {
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



  return (  
    
      <SlidingLeftBox close={close} className='flex column overflow-auto' style={{ "height": "100vh", "maxHeight": "100%" }}>
        <div className='addExpenseHeader flex row t1  padding1010 gap10'>
        <div className='cancelIcon alignself-center' onClick={()=>dispatch(closeSlidingLeftBox())}>
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
              className='addexpense-input t3 text-align-right'
              type="text"
              placeholder='0'
              value={newExpense.amount}
              onChange={e => setNewExpense({ ...newExpense, amount: addCommas(removeNonNumeric(e.target.value.toString().split(".").map((el,i)=>i?el.split("").slice(0,2).join(""):el).join("."))) })}
              autoFocus={true}
              spellCheck='false'
            />

          </div>

          <input
            className='addexpense-input t3'
            placeholder='Description (optional)'
            value={newExpense.description}
            onChange={e => setNewExpense({ ...newExpense, description: e.target.value })}
            spellCheck='false'

          />

          <div className='flex row wrap gap10'>
            {selectedGroup.groupTags.map(label => (
              <div className={`pill pointer shadow ${newExpense.labels.includes(label._id) ? 'filled' : 'empty'}`}
                key={label._id} style={{ '--pill-color': `var(--${label.color})` }}
                onClick={() => labelClicked(label._id)}
              >
                {label.name}
              </div>))}
          </div>

          <div className='t4 medium flex row justcont-start alignitems-center gap6 pointer' onClick={includeAllClick}>
            <IonIcon className='t3' name={`${includeAll ? 'checkbox' : 'square-outline'}`} />
            Split among all members
          </div>

          {!includeAll &&
            <div className='flex row wrap gap10'>
              {selectedGroup.members.map(member => (
                <div className={`pill pointer shadow ${newExpense.participants.includes(member._id) ? 'filled' : 'empty'}`}
                  key={member._id} style={{ '--pill-color': `gray` }}
                  onClick={() => participantClicked(member._id)}
                >
                  {member.nickname}
                </div>))}
            </div>}


        </div>
        <div className='submit-button-container flex shadow padding1010'>
        <div
          className={`submit-button ${newExpense.amount ? "active" : null} h-flex justcont-spacearound `}
          onClick={submitExpense}>
          {loading ? <IonIcon name='sync' className='t3 spin' /> : "Submit"}
        </div>
      </div>
      </SlidingLeftBox>  
  )
}

export default AddExpense
