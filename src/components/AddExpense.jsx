import { SlidingBox, Label } from './'
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
    participants: selectedGroup.members
  })

  console.log(newExpense)

  useEffect(() => {
    abortControllerRef.current = new AbortController();
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
      // setNewExpense({...newExpense, labels: [labelClickedId]})
    }
  }

  const participantClicked = (participantClickedId) => {
    if(newExpense.participants.includes(participantClickedId)) {
      setNewExpense({...newExpense, participants: newExpense.participants.filter(participant => participant !== participantClickedId)})
    }
    else {
      setNewExpense({...newExpense, participants: [...newExpense.participants, participantClickedId]})
      // setNewExpense({...newExpense, labels: [labelClickedId]})
    }
  }

  const includeAllClick = () => {
    if(includeAll) {
      setNewExpense({...newExpense, participants: []})
      setIncludeAll(false)
    }
    else {
      setNewExpense({...newExpense, participants: [...selectedGroup.members]})
      setIncludeAll(true)
    }
  }

  return (
    <SlidingBox close={close} className='top-radius' style={{backgroundColor: 'var(--layer-1-color)'}}>
      <div className='flex row t05 justcont-center alignitems-center padding4'>Create expense</div>
      <div className='flex column gap10 padding1010'>
        <input
          className='input-field'
          placeholder='Amount'
          value={newExpense.amount}
          onChange={e => setNewExpense({...newExpense, amount: e.target.value })}
          spellCheck='false'
        />
        <input
          className='input-field'
          placeholder='Description'
          value={newExpense.description}
          onChange={e => setNewExpense({...newExpense, description: e.target.value })}
          spellCheck='false'
        />
        <div className='flex row wrap gap10'>
          {selectedGroup.groupTags.map(label => (
            <Label
            key={label._id}
            text={label.name}
            color={label.color}
            selected={newExpense.labels.includes(label._id)}
            onClick={() => labelClicked(label._id)}/>
          ))}
        </div>
        <div className='t4 medium flex row justcont-start alignitems-center gap6 pointer' onClick={includeAllClick}>
          <IonIcon className='t3' name={`${includeAll ? 'checkbox' : 'square-outline' }`}/>
          Split among all members
        </div>
        {!includeAll &&
          <div className='flex row wrap gap10'>
            {selectedGroup.members.map(member => (
              <Label
              key={member._id}
              text={member.nickname}
              color={'#aaaaaa'}
              selected={newExpense.participants.includes(member._id)}
              onClick={() => participantClicked(member._id)}/>
            ))}
          </div>
        }
        <div className='flex row justcont-center' onClick={submitExpense}>
          Submit
          {loading && <IonIcon name='sync' className='t3 spin'/>}
        </div>
      </div>
    </SlidingBox>
  )
}

export default AddExpense
