import { useState, useEffect, useRef } from 'react'
import store from '../redux/store'
import { useParams, useSearchParams, useNavigate } from 'react-router-dom'
import useAxios from '../utility/useAxios'
import IonIcon from '@reacticons/ionicons'
import { setSelectedGroup } from '../redux/mainSlice'
import { useDispatch } from 'react-redux'

const DeleteExpense = () => {

  const params = useParams()
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const api = useAxios()
  const abortControllerRef = useRef(null)
  const [isLoading, setLoading] = useState(false)
  const [searchParams] = useSearchParams()
  const expenseID = searchParams.get('id')


  useEffect(() => {
    window.addEventListener('popstate', event => console.log(event));
    abortControllerRef.current = new AbortController()
    return () => {
      window.removeEventListener('popstate', event => console.log(event));
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
    <div className='bottom-menu top-radius' style={{zIndex: '2'}}>
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
          onClick={clickedNo}
        >
          <div>No</div>
        </div>
      </div>
    </div>
  )
}

export default DeleteExpense
