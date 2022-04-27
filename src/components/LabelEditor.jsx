import { SlidingBox } from './'
import { useRef, useState, useEffect } from 'react'
import useAxios from '../utility/useAxios'
import store from '../redux/store'
import { useDispatch, useSelector, shallowEqual } from 'react-redux'
import { closeSlidingBox } from '../redux/slidingSlice'
import { setSelectedGroup } from '../redux/mainSlice'
import populateLabels from '../utility/populateLabels'
import "../style/Form.css"
import IonIcon from '@reacticons/ionicons'

function LabelEditor({ close }) {

  const groupLabels = store.getState().mainReducer.selectedGroup.groupTags
  const group = store.getState().mainReducer.selectedGroup
  const dispatch = useDispatch()

  const LabelItem = ({ labelId }) => {

    // console.log(`${Date.now()} LabelItem rendered with labelId: `, labelId)
    const api = useAxios()
    const abortControllerRef = useRef(null)
    const [loading, setLoading] = useState(false)
    const label = useSelector(state => state.mainReducer.selectedGroup.groupTags.find(label => label._id === labelId), shallowEqual)
    const [editMode, setEditMode] = useState(false)
    const [deleteMode, setDeleteMode] = useState(false)
    const [content, setContent] = useState(label.name)
    const [width, setWidth] = useState(0)
    const dummySpan = useRef()

    useEffect(() => {
      abortControllerRef.current = new AbortController;
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

    const isUsed = (labelId) => (
      store.getState().mainReducer.selectedGroup.expenses.some((expense) => (
        expense.expenseTags.some(expenseLabel => expenseLabel._id === labelId)
      ))
    )

    return(
      <div className='flex row justcont-spacebetween alignitems-center' style={{height: 'fit-content'}}>
        <span className='hide t5' ref={dummySpan}>{content}</span>
        {!editMode &&
        <div className='pill t5 shadow' style={{color: 'var(--layer-0-color)', backgroundColor: label.color, borderColor: label.color}}>
          {label.name}
        </div>}
        {editMode &&
        <input
          type='text'
          value={content}
          className='label editable t5 shadow'
          style={{ width, color: 'var(--layer-1-color)', backgroundColor: label.color, borderColor: label.color }}
          autoFocus
          onChange={(e) => setContent(e.target.value)}/>}
        {!editMode && !deleteMode &&
        <div className='flex row gap10'>
          {!isUsed(labelId) &&
          <div className='pill t5 empty pointer shadow' style={{color: `${isUsed(labelId) ? 'grey' : '#D16666'}`}}>
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
          <div className='pill t5 empty pointer shadow' style={{color: 'red'}} onClick={cancelEdit}>
            Cancel
          </div>}
          <div className='pill t5 empty pointer shadow' style={{color: 'green'}} onClick={submitEdit}>
            OK
            {loading && <IonIcon name='sync' className='t5 spin'/>}
          </div>
        </div>}
      </div>
    )
  }

  return (
    <SlidingBox close={close} className='top-radius' style={{backgroundColor: 'var(--layer-1-color)'}}>
      <div className='flex row t05 justcont-center padding4'>Labels</div>
        <div className='pill t5 empty pointer shadow new-label alignself-end'>
          {/* <IonIcon name='add-outline' className='t5'/> */}
          New label
        </div>
      <div className='flex column gap10 padding1010'>
        {groupLabels.map(label => (
          <LabelItem labelId={label._id}/>
        ))}
        {/* <LabelItem labelId={groupLabels[3]._id}/> */}
      </div>
    </SlidingBox>
  )
}

export default LabelEditor
