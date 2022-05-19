import { useState, useEffect, useRef } from 'react'
import { SlidingBox } from './'
import store from '../redux/store'
import { useDispatch } from 'react-redux'
import { closeSlidingBox } from '../redux/slidingSlice'
import { setSelectedGroup, setSelectedExpense } from '../redux/mainSlice'
import populateLabels from '../utility/populateLabels'
import useAxios from '../utility/useAxios'
import IonIcon from '@reacticons/ionicons'

const MenuExpenseOptions = ({ close }) => {
  const [isLoading, setLoading] = useState(false)
  const abortControllerRef = useRef(null)
  const dispatch = useDispatch()
  const selectedExpense = store.getState().mainReducer.selectedExpense
  const api = useAxios()

  useEffect(() => {
    abortControllerRef.current = new AbortController()
    return () => {
      abortControllerRef.current.abort()
    }
  },[])

  const deleteExpense = async () => {
    setLoading(true)
    try {
      const res = await api.post('/expense/remove',
      {
        groupId: store.getState().mainReducer.selectedGroup._id,
        expenseId: selectedExpense._id
      },
      { signal: abortControllerRef.current.signal })
      console.log("res.data = ", res.data)
      dispatch(setSelectedGroup(populateLabels(res.data)))
    }
    catch(error) {
      console.log(error.message)
    }
    finally {
      setLoading(false)
      dispatch(closeSlidingBox())
      console.log('finally')
    }
  }

  const removeSelectedExpenseAndClose = () => {
    dispatch(setSelectedExpense(null))
    close()
  }

  return (
    <SlidingBox close={removeSelectedExpenseAndClose} className='group-selector top-radius'>
      <div className='flex row t05 justcont-center alignitems-center padding4'>
      {`Delete ${selectedExpense.description}?`}
      {isLoading && <IonIcon name='sync' className='t3 spin'/>}
      </div>
      <div className='flex column gap4 padding4'>
        <div
        className='group-selector-button medium flex row overflow-hidden justcont-center alignitems-center t3 padding1812 pointer shadow'
        onClick={deleteExpense}>
          <div>Yes</div>
        </div>
        <div
        className='group-selector-button medium flex row overflow-hidden justcont-center alignitems-center t3 padding1812 pointer shadow'
        onClick={() => dispatch(closeSlidingBox())}>
          <div>No</div>
        </div>
      </div>
    </SlidingBox>
  )
}

export default MenuExpenseOptions
