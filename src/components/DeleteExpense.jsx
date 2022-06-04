import { useState, useEffect, useRef } from 'react'
import { SlidingBox } from './'
import store from '../redux/store'
import { useSearchParams } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { closeSlidingBox } from '../redux/slidingSlice'
import { setSelectedGroup, setSelectedExpense } from '../redux/mainSlice'
import populateLabels from '../utility/populateLabels'
import useAxios from '../utility/useAxios'
import IonIcon from '@reacticons/ionicons'

const DeleteExpense = ({ close }) => {
  const [searchParams, setSearchParams] = useSearchParams()
  const [isLoading, setLoading] = useState(false)
  const abortControllerRef = useRef(null)
  const dispatch = useDispatch()
  const api = useAxios()

  const expenseID = searchParams.get('id')

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
        expenseId: expenseID
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
    <div style={{zIndex: '2'}}>
      <div className='flex row t05 justcont-center alignitems-center padding4'>
        {`Delete?`}
        {isLoading && <IonIcon name='sync' className='t3 spin'/>}
      </div>
      <div className='flex column gap4 padding4'>
        <div
          className='group-selector-button medium flex row overflow-hidden justcont-center alignitems-center t3 padding1812 pointer shadow'
          onClick={deleteExpense}
        >
          <div>Yes</div>
        </div>
        <div
          className='group-selector-button medium flex row overflow-hidden justcont-center alignitems-center t3 padding1812 pointer shadow'
        >
          <div>No</div>
        </div>
      </div>
    </div>
  )
}

export default DeleteExpense
