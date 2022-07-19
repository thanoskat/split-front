import IonIcon from '@reacticons/ionicons'
import { useDispatch } from 'react-redux'
import { setSelectedGroup } from '../redux/mainSlice'
import useAxios from '../utility/useAxios'
import store from '../redux/store'
import { useRef, useState, useEffect } from 'react'

function SettleUp({ setSearchParams, name, amount, receiverId }) {

  const api = useAxios()
  const selectedGroup = store.getState().mainReducer.selectedGroup
  const sessionData = store.getState().authReducer.sessionData
  const abortControllerRef = useRef(null)
  const dispatch = useDispatch()
  const [loading, setLoading] = useState(false)


  useEffect(() => {
    abortControllerRef.current = new AbortController()
    return () => {
      abortControllerRef.current.abort()
    }
    // eslint-disable-next-line
  }, [])

  const recordTransfer = async (amount, receiverId) => {

    if (receiverId === "" || receiverId === null) return null; //do not proceed to recording tx if no user has been selected
    if (amount === "") return null; //do not proceed to recording tx if no amount has been given
    setLoading(true)
    try {
      const res = await api.post(`/expense/addtransfer`,
        {
          groupId: selectedGroup._id, //does it feed at first render? Need to check
          sender: sessionData.userId,
          receiver: receiverId,
          amount: amount,
          description: "settle debt"
        }, { signal: abortControllerRef.current.signal }
      )
      setLoading(false)
      dispatch(setSelectedGroup(res.data))
      //console.log(res)
    }
    catch (error) {
      console.log(error)
    }
    setSearchParams({})
  }

  return (
    <div className='bottom-menu top-radius padding4' style={{ zIndex: '2' }}>
      <div className='flex row justcont-spacebetween t05 padding4'>
        <div style={{ color: "var(--light-color)", fontSize: "25px" }}>
          Settle Up
        </div>
        <div onClick={() => setSearchParams({})}>
          <IonIcon name='close-outline' />
        </div>
      </div>
      <div className='flex column gap10 padding6'>
        <div className="whiteSpace-initial" style={{ color: "var(--light-color)", textAlign: "left" }}>
          You are about to settle a debt of <strong>${amount}</strong> with <strong>{name}</strong>
        </div>
        <div onClick={() => recordTransfer(amount, receiverId)} style={{ backgroundColor: "var(--label-color-6)" }} className="accept-reject medium flex row overflow-hidden alignitems-center t3 padding15 pointer shadow justcont-center">
          {loading ? <IonIcon name='sync' className='t3 spin' /> : "Settle Up"}
        </div>
        <div onClick={() => setSearchParams({})} style={{ backgroundColor: "var(--lightpink)" }} className="accept-reject medium flex row overflow-hidden alignitems-center t3 padding15 pointer shadow justcont-center">
          Cancel
        </div>
      </div>
    </div>
  )
}

export default SettleUp