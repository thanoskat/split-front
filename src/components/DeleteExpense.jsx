import { useState, useEffect, useRef } from 'react'
import store from '../redux/store'
import useAxios from '../utility/useAxios'
import IonIcon from '@reacticons/ionicons'
import { setToggle } from '../redux/mainSlice'
import { useDispatch } from 'react-redux'

const DeleteExpense = ({ expense, openMenu }) => {


  const dispatch = useDispatch()
  const api = useAxios()
  const abortControllerRef = useRef(null)
  const toggle = store.getState().mainReducer.toggle

  const [loading, setLoading] = useState(false)

  useEffect(() => {
    abortControllerRef.current = new AbortController()
    return () => {
      abortControllerRef.current.abort()
    }
    // eslint-disable-next-line
  }, [])

  const deleteExpense = async () => {
    setLoading(true)
    try {
      await api.post('/expense/remove',
        {
          groupId: store.getState().mainReducer.selectedGroup.id,
          expenseId: expense.id
        },
        { signal: abortControllerRef.current.signal })
      dispatch(setToggle(!toggle))
    }
    catch (error) {
      console.log(error.message)
    }
    finally {
      setLoading(false)
    }
  }

  return (
    <div className='top-radius flex column fixed' style={{ zIndex: '2', gap: '14px', padding: '14px', left: '14px', bottom: '0px', backgroundColor: 'var(--layer-1-color)', width: 'calc(100% - 28px)' }}>
      <div className='flex row' style={{ fontSize: '26px' }}>
        Delete {expense.description}?
      </div>
      <div
        onClick={deleteExpense}
        className='group-selector-button medium flex row overflow-hidden justcont-center alignitems-center t3 pointer shadow'
        style={{ padding: '14px', width: '100%', gap: '14px' }}
      >
        {loading && <IonIcon name='sync' className='t3 spin' />}
        <div>Yes</div>
      </div>
      <div
        onClick={(e) => openMenu(e, null)}
        className='group-selector-button medium flex row overflow-hidden justcont-center alignitems-center t3 pointer shadow'
        style={{ padding: '14px', width: '100%', gap: '14px' }}
      >
        <div>No</div>
      </div>
    </div>
  )
}

export default DeleteExpense
