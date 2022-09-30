import { useState, useEffect, useRef } from 'react'
import store from '../redux/store'
import { useParams, useSearchParams, useNavigate } from 'react-router-dom'
import useAxios from '../utility/useAxios'
import IonIcon from '@reacticons/ionicons'
import { setSelectedGroup } from '../redux/mainSlice'
import { useDispatch } from 'react-redux'

const ExpenseOptions = ({ openMenu, expense }) => {

  const params = useParams()
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const api = useAxios()
  const abortControllerRef = useRef(null)
  const [isLoading, setLoading] = useState(false)
  const [searchParams] = useSearchParams()
  const expenseID = null

  useEffect(() => {
    //window.addEventListener('popstate', event => console.log(event));
    abortControllerRef.current = new AbortController()
    return () => {
      //window.removeEventListener('popstate', event => console.log(event));
      abortControllerRef.current.abort()
    }
  // eslint-disable-next-line
  },[])

  const deleteExpense = async () => {
    setLoading(true)
    try {
      await api.post('/expense/remove',
      {
        groupId: store.getState().mainReducer.selectedGroup._id,
        expenseId: expenseID
      },
      { signal: abortControllerRef.current.signal })
      getGroup(params.groupid)
      navigate('expenses', { replace: true })
    }
    catch(error) {
      console.log(error.message)
    }
    finally {
      setLoading(false)
    }
  }

  const clickedNo = () => {
    navigate('expenses', { replace: true })
  }

  const getGroup = async (id) => {
    try {
      const res = await api.post('/groups/getgroup', { groupid: id }, { signal: abortControllerRef.current.signal })
      dispatch(setSelectedGroup(res.data))
    }
    catch(error) {
      console.log('/groups/getgroup', error)
    }
  }

  return (
    <div className='top-radius flex column fixed' style={{ zIndex: '2', gap: '14px', padding: '14px', left: '14px', bottom: '0px', backgroundColor: 'var(--layer-1-color)', width: 'calc(100% - 28px)' }}>
      <div className='flex row' style={{ fontSize: '26px' }}>
        {expense.description}
      </div>
      <div
        onClick={(e) => openMenu(e, 'editExpense')}
        className='group-selector-button medium flex row overflow-hidden justcont-center alignitems-center t3 pointer shadow'
        style={{ padding: '14px', width: '100%', gap: '14px' }}
      >
        <IonIcon name='pencil' className='t2' />
        <div>Edit</div>
      </div>
      <div
        onClick={(e) => openMenu(e, 'deleteExpense')}
        className='group-selector-button medium flex row overflow-hidden justcont-center alignitems-center t3 pointer shadow'
        style={{ padding: '14px', width: '100%', gap: '14px' }}
      >
        <IonIcon name='trash' className='t2' />
        <div>Delete</div>
      </div>
    </div>
  )
}

export default ExpenseOptions
