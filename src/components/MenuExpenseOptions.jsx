import { useState, useEffect, useRef } from 'react'
import { SlidingBox } from './'
// import { SlidingBoxContext } from '../contexts/SlidingBoxContext'
// import { AuthenticationContext } from '../contexts/AuthenticationContext'
import store from '../redux/store'
import { useDispatch } from 'react-redux'
import { closeSlidingBox } from '../redux/slidingSlice'
import { setCurrentMenu, setSelectedExpense } from '../redux/mainSlice'
import useAxios from '../utility/useAxios'
import IonIcon from '@reacticons/ionicons'

const MenuExpenseOptions = ({ close }) => {
  const [isLoading, setLoading] = useState(false)
  const abortControllerRef = useRef(null)
  const dispatch = useDispatch()
  const selectedExpense = store.getState().mainReducer.selectedExpense
  const api = useAxios()

  useEffect(() => {
    abortControllerRef.current = new AbortController;
    return () => {
      abortControllerRef.current.abort()
    }
  },[])

  const deleteExpense = async () => {
    setLoading(true)
    try {
      const res = await api.post('/expense/delete', { groupId: store.getState().mainReducer.selectedGroup._id, expense: selectedExpense }, { signal: abortControllerRef.current.signal })
      console.log(`${selectedExpense.description} deleted!`)
      console.log(res)
      setLoading(false)
    }
    catch(error) {
      console.log(error)
    }
    dispatch(closeSlidingBox())
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
