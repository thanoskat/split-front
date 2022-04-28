import { SlidingBox } from './'
import { useRef, useState, useEffect } from 'react'
import useAxios from '../utility/useAxios'
import store from '../redux/store'
import { useDispatch, useSelector, shallowEqual } from 'react-redux'
import { setSelectedGroup } from '../redux/mainSlice'
import populateLabels from '../utility/populateLabels'
import "../style/Form.css"
import IonIcon from '@reacticons/ionicons'

const LabelItem = ({ labelId }) => {
  const api = useAxios()
  const group = store.getState().mainReducer.selectedGroup
  const dispatch = useDispatch()
  const abortControllerRef = useRef(null)
  const [loading, setLoading] = useState(false)
  const label = useSelector(state => state.mainReducer.selectedGroup.groupTags.find(label => label._id === labelId), shallowEqual)
  const [editMode, setEditMode] = useState(false)
  const [deleteMode, setDeleteMode] = useState(false)
  const [content, setContent] = useState(label?.name)
  const [width, setWidth] = useState(0)
  const dummySpan = useRef()

  useEffect(() => {
    abortControllerRef.current = new AbortController();
    return () => {
      abortControllerRef.current.abort()
    }
  }, [])

  useEffect(() => {
    setWidth(dummySpan.current.offsetWidth)
  }, [content])

  const cancelEdit = () => {
    setContent(label.name)
    setEditMode(false)
  }

  const submitEdit = async () => {
    if(!loading) {
      if(content !== label.name) {
        try {
          setLoading(true)
          const res = await api.post('groups/label/edit', {
            groupid: group._id,
            id: label._id,
            text: content
          }, { signal: abortControllerRef.current.signal })
          dispatch(setSelectedGroup(populateLabels(res.data)))
          setLoading(false)
        }
        catch(error) {
          console.log(error)
          setLoading(false)
        }
      }
      setEditMode(false)
    }
  }

  const submitDelete = async () => {
    setLoading(true)
    try {
      const res = await api.post('groups/label/remove', {
        groupId: group._id,
        labelId: label._id,
      }, { signal: abortControllerRef.current.signal })
      dispatch(setSelectedGroup(populateLabels(res.data)))
    }
    catch(error) {
      console.log(error)
    }
    finally {
      setLoading(false)
      setDeleteMode(false)
    }
  }

  const cancelDelete = () => {
    setDeleteMode(false)
  }

  const isUsed = (labelId) => (
    store.getState().mainReducer.selectedGroup.expenses.some((expense) => (
      expense.expenseTags.some(expenseLabel => expenseLabel._id === labelId)
    ))
  )

  if(!label) return(<></>)
  return(
    <div className='flex row justcont-spacebetween alignitems-center' style={{height: 'fit-content'}}>
      <span className='hide t5' ref={dummySpan}>{content}</span>
      {!editMode &&
      <div className={`pill t5 shadow ${deleteMode ? 'shake' : ''}`} style={{color: 'var(--layer-0-color)', backgroundColor: `var(--${label.color})`, borderColor: `var(--${label.color})`}}>
        {label.name}
      </div>}
      {editMode &&
      <input
        type='text'
        value={content}
        className='label editable t5 shadow'
        style={{ width, color: 'var(--layer-1-color)', backgroundColor: `var(--${label.color})`, borderColor: `var(--${label.color})` }}
        autoFocus
        onChange={(e) => setContent(e.target.value)}/>}
      {!editMode && !deleteMode &&
      <div className='flex row gap10'>
        {!isUsed(labelId) &&
        <div className='pill t5 empty pointer shadow' style={{color: `${isUsed(labelId) ? 'grey' : '#D16666'}`}} onClick={() => setDeleteMode(true)}>
          Delete
        </div>}
        <div className='pill t5 empty pointer shadow' style={{color: 'var(--base-color-1)'}} onClick={() => setEditMode(true)}>
          Edit
        </div>
      </div>
      }
      {editMode &&
      <div className='flex row gap10'>
        {!loading &&
        <div className='pill t5 empty pointer shadow' style={{color: 'gray'}} onClick={cancelEdit}>
          Discard
        </div>}
        <div className='pill t5 empty pointer shadow' style={{color: 'lightgreen'}} onClick={submitEdit}>
          Apply
          {loading && <IonIcon name='sync' className='t5 spin'/>}
        </div>
      </div>}
      {deleteMode &&
      <div className='flex row gap10'>
        {!loading &&
        <div className='pill t5 empty pointer shadow' style={{color: 'gray'}} onClick={cancelDelete}>
          Cancel
        </div>}
        <div className='pill t5 empty pointer shadow' style={{color: 'red'}} onClick={submitDelete}>
          Delete!
          {loading && <IonIcon name='sync' className='t5 spin'/>}
        </div>
      </div>}
    </div>
  )
}

const LabelEditor = ({ close }) => {
  const api = useAxios()
  const dispatch = useDispatch()
  const abortControllerRef = useRef(null)
  const group = store.getState().mainReducer.selectedGroup
  const [loading, setLoading] = useState(false)
  const [newMode, setNewMode] = useState(false)
  const [newLabel, setNewLabel] = useState({
    name: '',
    color: ''
  })
  const defaultColors = [
    'label-color-0',
    'label-color-1',
    'label-color-2',
    'label-color-3',
    'label-color-4',
    'label-color-5',
    'label-color-6',
    'label-color-7',
  ]

  useEffect(() => {
    abortControllerRef.current = new AbortController()
    return () => {
      abortControllerRef.current.abort()
    }
  }, [])

  const createNewLabel = async () => {
    const defaultColorsUsed = group.groupTags.map(label => label.color)
    const firstAvailableColor = defaultColors.filter(color => !defaultColorsUsed.includes(color))[0]
    setLoading(true)
    const res = await api.post(`/expense/addtag`,
      {
        groupId: group._id,
        groupTag: { name: newLabel.name, color: firstAvailableColor }
      },
      { signal: abortControllerRef.current.signal })
    dispatch(setSelectedGroup(populateLabels(res.data)))
    setNewLabel({...newLabel, name: ''})
    setLoading(false)
    setNewMode(false)
  }

  const cancelNewMode = () => {
    setNewLabel({...newLabel, name: ''})
    setNewMode(false)
  }

  return (
    <SlidingBox close={close} className='top-radius' style={{backgroundColor: 'var(--layer-1-color)'}}>
      <div className='flex row t1 justcont-center padding4'>Labels</div>
      <div className='flex column gap10 padding1010'>
        {group.groupTags.map(label => (
          <LabelItem labelId={label._id}/>
        ))}
        {!newMode &&
        <div className='pill t5 empty pointer shadow new-label' onClick={() => setNewMode(true)}>Create new label</div>}
        {newMode &&
        <div className='flex row justcont-spacebetween'>
          <input
            type='text'
            value={newLabel.name}
            className='label editable t5 shadow'
            style={{ width: '100px', color: 'white'}}
            autoFocus
            onChange={(e) => setNewLabel({...newLabel, name: e.target.value})}
          />
          <div className='flex row gap10 pointer'>
            <div className='pill t5' onClick={cancelNewMode}>Cancel</div>
            <div className='pill t5' onClick={() => createNewLabel()}>
              OK
              {loading && <IonIcon name='sync' className='t5 spin'/>}
            </div>
          </div>
        </div>
        }
      </div>
    </SlidingBox>
  )
}

export default LabelEditor
