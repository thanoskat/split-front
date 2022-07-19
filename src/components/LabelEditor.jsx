import { useRef, useState, useEffect } from 'react'
import useAxios from '../utility/useAxios'
import store from '../redux/store'
import { useDispatch, useSelector, shallowEqual } from 'react-redux'
import { setSelectedGroup } from '../redux/mainSlice'
import "../style/Form.css"
import IonIcon from '@reacticons/ionicons'

const LabelItem = ({ labelId }) => {
  const api = useAxios()
  const group = store.getState().mainReducer.selectedGroup
  const dispatch = useDispatch()
  const abortControllerRef = useRef(null)
  const label = useSelector(state => state.mainReducer.selectedGroup.groupLabels.find(label => label._id === labelId), shallowEqual)
  const dummySpan = useRef()
  const [loading, setLoading] = useState(false)
  const [mode, setMode] = useState('read')
  const [content, setContent] = useState(label?.name)
  const [width, setWidth] = useState(0)

  useEffect(() => {
    abortControllerRef.current = new AbortController()
    return () => {
      abortControllerRef.current.abort()
    }
  }, [])

  useEffect(() => {
    setWidth(dummySpan.current.offsetWidth)
  }, [content])

  const cancelEdit = () => {
    setContent(label.name)
    setMode('read')
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
          dispatch(setSelectedGroup(res.data))
          setLoading(false)
        }
        catch(error) {
          console.log(error)
          setLoading(false)
        }
      }
      setMode('read')
    }
  }

  const keyPress = async (e) => {
    if (e.key === 'Enter') {
      await submitEdit()
    }
  }

  const submitDelete = async () => {
    setLoading(true)
    try {
      const res = await api.post('groups/label/remove', {
        groupId: group._id,
        labelId: label._id,
      }, { signal: abortControllerRef.current.signal })
      dispatch(setSelectedGroup(res.data))
    }
    catch(error) {
      console.log(error)
    }
    finally {
      setLoading(false)
      setMode('read')
    }
  }

  const cancelDelete = () => {
    setMode('read')
  }

  const isUsed = (labelId) => (
    store.getState().mainReducer.selectedGroup.expenses.some(expense => (
      expense.label === labelId
    ))
  )

  if(!label) return(<></>)
  return(
    <div className='flex row justcont-spacebetween alignitems-center' style={{height: 'fit-content'}}>
      <span className='pill2 hidden shadow' ref={dummySpan}>{content}</span>
      {!(mode === 'edit') &&
      <div className={`pill2 shadow ${mode === 'delete' ? 'shake' : ''}`}
        style={{ color: `var(--${label.color})` }}
      >{label.name}</div>}
      {(mode === 'edit') &&
      <input
        type='text'
        onKeyPress={keyPress}
        value={content}
        className='pill2 filled shadow overflow-hidden'
        style={{
          width,
          color: `var(--${label.color})`,
          borderColor: `var(--${label.color})`,
          borderWidth: '3px',
          outlineWidth: '0'
        }}
        autoFocus
        onChange={(e) => setContent(e.target.value)}/>}
      {(mode === 'read')  &&
      <div className='flex row gap10'>
        {!isUsed(labelId) &&
        <div
          className='pill2 t5 empty pointer shadow'
          style={{ color: 'var(--darkletterColor)' }}
          onClick={() => setMode('delete')}
        >
          <IonIcon name='trash' className='t2' />
        </div>}
        <div
          className='pill2 t5 empty pointer shadow'
          style={{ color: 'var(--darkletterColor)' }}
          onClick={() => setMode('edit')}
        >
          <IonIcon name='pencil' className='t2' />
        </div>
      </div>}
      {(mode === 'edit') &&
      <div className='flex row gap10'>
        {!loading &&
        <div
          className='pill2 t5 empty pointer shadow'
          style={{ color: 'gray' }}
          onClick={cancelEdit}
        >
          Discard
        </div>}
        <div
          className='pill2 t5 empty pointer shadow'
          style={{ color: 'var(--green)' }}
          onClick={submitEdit}
        >
          Apply
          {loading && <IonIcon name='sync' className='t5 spin'/>}
        </div>
      </div>}
      {(mode === 'delete') &&
      <div className='flex row gap10'>
        {!loading &&
        <div
          className='pill2 t5 empty pointer shadow'
          style={{ color: 'gray' }}
          onClick={cancelDelete}
        >
          Cancel
        </div>}
        <div
          className='pill2 t5 empty pointer shadow'
          style={{ color: 'var(--pink)' }}
          onClick={submitDelete}
        >
          Delete!
          {loading && <IonIcon name='sync' className='t5 spin'/>}
        </div>
      </div>}
    </div>
  )
}

const LabelEditor = () => {
  const api = useAxios()
  const dispatch = useDispatch()
  const abortControllerRef = useRef(null)
  const group = store.getState().mainReducer.selectedGroup
  const newLabelInput = useRef(null)
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
    const defaultColorsUsed = group.groupLabels.map(label => label.color)
    const firstAvailableColor = defaultColors.filter(color => !defaultColorsUsed.includes(color))[0]
    setLoading(true)
    const res = await api.post(`/expense/addtag`,
      {
        groupId: group._id,
        groupTag: { name: newLabel.name, color: firstAvailableColor }
      },
      { signal: abortControllerRef.current.signal })
    dispatch(setSelectedGroup(res.data))
    setNewLabel({...newLabel, name: ''})
    setLoading(false)
    setNewMode(false)
  }

  const cancelNewMode = () => {
    setNewLabel({...newLabel, name: ''})
    setNewMode(false)
  }

  const keyPress = (e) => {
    if (e.key === 'Enter') {
      createNewLabel()
    }
  }

  const setNewModeOrFocus = () => {
    if(!newMode) {
      setNewMode(true)
    }
    else {
      newLabelInput.current.focus()
    }
  }

  return (
    <div className='bottom-menu top-radius overflow-auto' style={{ zIndex: '2', maxHeight: '80vh' }}>
      <div className='flex row t1 justcont-center padding4'>Labels</div>
      <div className='flex column overflow-hidden' style={{ gap: '14px', padding: '14px 14px' }}>
        <div
          style={{ alignSelf: 'center', color: 'var(--light-color)', borderColor: 'var(--label-color-6)', backgroundColor: 'var(--label-color-6)', alignSelf: 'auto' }}
          className='pill t5 empty pointer shadow'
          onClick={setNewModeOrFocus}
        >
          Create new label
        </div>
        {group?.groupLabels.map(label => (
          <LabelItem key={label._id} labelId={label._id}/>
        ))}
        {newMode &&
        <div className='flex row justcont-spacebetween'>
          <input
            ref={newLabelInput}
            onKeyPress={(e) => keyPress(e)}
            type='text'
            value={newLabel.name}
            className='pill2 empty editable t5 shadow'
            style={{ width: '100px', color: `white` }}
            autoFocus
            onChange={(e) => setNewLabel({...newLabel, name: e.target.value})}
          />
          <div className='flex row gap10 pointer'>
            <div className='pill2 t5' onClick={cancelNewMode}>Cancel</div>
            <div className='pill2 t5' onClick={() => createNewLabel()}>
              OK
              {loading && <IonIcon name='sync' className='t5 spin'/>}
            </div>
          </div>
        </div>
        }
      </div>
    </div>
  )
}

export default LabelEditor
