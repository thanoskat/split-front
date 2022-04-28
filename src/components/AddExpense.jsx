import { SlidingBox } from './'
import { useState, useEffect, useRef } from 'react'
import { useDispatch } from 'react-redux'
import { setSelectedGroup } from '../redux/mainSlice'
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

  console.log(newExpense)

  useEffect(() => {
    abortControllerRef.current = new AbortController()
    return () => {
      abortControllerRef.current.abort()
    }
  }, [])

  const submitExpense = async () => {
    if(!loading) {
      setLoading(true)
      try {
        const res = await api.post('expense/add',
        {
          groupId: selectedGroup._id,
          sender: sessionData.userId,
          amount: newExpense.amount,
          description: newExpense.description,
          tobeSharedWith: newExpense.participants,
          expenseTags: newExpense.labels,
        },
        { signal: abortControllerRef.current.signal })
        dispatch(setSelectedGroup(populateLabels(res.data)))
        setLoading(false)
      }
      catch(error) {
        console.log(error)
        setLoading(false)
      }
    }
  }

  const labelClicked = (labelClickedId) => {
    if(newExpense.labels.includes(labelClickedId)) {
      setNewExpense({...newExpense, labels: newExpense.labels.filter(label => label !== labelClickedId)})
    }
    else {
      setNewExpense({...newExpense, labels: [...newExpense.labels, labelClickedId]})
      // Uncomment if only one label is allowed
      // setNewExpense({...newExpense, labels: [labelClickedId]})
    }
  }

  const participantClicked = (participantClickedId) => {
    if(newExpense.participants.includes(participantClickedId)) {
      setNewExpense({...newExpense, participants: newExpense.participants.filter(participant => participant !== participantClickedId)})
    }
    else {
      setNewExpense({...newExpense, participants: [...newExpense.participants, participantClickedId]})
    }
  }

  const includeAllClick = () => {
    if(includeAll) {
      setNewExpense({...newExpense, participants: []})
      setIncludeAll(false)
    }
    else {
      setNewExpense({...newExpense, participants: [...selectedGroup.members.map(member => member._id)]})
      setIncludeAll(true)
    }
  }

  return (
    <SlidingBox close={close} className='top-radius'>
      <div className='flex row t1 justcont-center alignitems-center padding4'>New Expense</div>
      <div className='separator-0'/>
      <div className='flex column gap10 padding1010'>
        <input
          className='addexpense-input t3'
          placeholder='Amount'
          value={newExpense.amount}
          onChange={e => setNewExpense({...newExpense, amount: e.target.value })}
          spellCheck='false'
        />
        <input
          className='addexpense-input t3'
          placeholder='Description (optional)'
          value={newExpense.description}
          onChange={e => setNewExpense({...newExpense, description: e.target.value })}
          spellCheck='false'
        />
        <div className='flex row wrap gap10'>
          {selectedGroup.groupTags.map(label => (
            <div className={`pill pointer shadow ${newExpense.labels.includes(label._id) ? 'filled' : 'empty'}`}
              key={label._id} style={{'--pill-color': `var(--${label.color})`}}
              onClick={() => labelClicked(label._id)}
            >
              {label.name}
            </div>))}
        </div>
        <div className='t4 medium flex row justcont-start alignitems-center gap6 pointer' onClick={includeAllClick}>
          <IonIcon className='t3' name={`${includeAll ? 'checkbox' : 'square-outline' }`}/>
          Split among all members
        </div>
        {!includeAll &&
        <div className='flex row wrap gap10'>
          {selectedGroup.members.map(member => (
          <div className={`pill pointer shadow ${newExpense.participants.includes(member._id) ? 'filled' : 'empty'}`}
            key={member._id} style={{'--pill-color': `gray`}}
            onClick={() => participantClicked(member._id)}
          >
            {member.nickname}
          </div>))}
        </div>}
        <div className='flex row justcont-center alignitems-center t2 gap8' onClick={submitExpense}>
          Submit
          {loading && <IonIcon name='sync' className='t2 spin'/>}
        </div>
      </div>
    </SlidingBox>
  )
}

export default AddExpense
