import IonIcon from '@reacticons/ionicons'
import { useDispatch } from 'react-redux'
import { setSelectedGroup } from '../redux/mainSlice'
import useAxios from '../utility/useAxios'
import store from '../redux/store'
import { useRef, useState, useEffect } from 'react'
import currency from 'currency.js'

function SettleUp({ setMenuParams, name, amount, receiverId, senderName, senderId }) {

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
          sender: senderId,
          receiver: receiverId,
          amount: amount.toString(),
          description: "settle debt"
        }, { signal: abortControllerRef.current.signal }
      )
      setLoading(false)
      console.log(res.data)
      dispatch(setSelectedGroup(res.data))
      //console.log(res)
    }
    catch (error) {
      console.log(error)
    }
    setMenuParams({ open: false })
  }

  return (
    <div className='bottom-menu-settle top-radius' style={{ zIndex: '2' }}>
      <div className='flex row justcont-spacebetween t05' style={{ padding: "10px" }}>
        <div style={{ color: "var(--light-color)", fontSize: "25px" }}>
          Settle Up
        </div>
        <div className='pointer' onClick={() => setMenuParams({ open: false })}>
          <IonIcon name='close-outline' />
        </div>
      </div>
      <div className='flex column gap10 padding1010'>
        <div className="flex row whiteSpace-initial wrap" style={{ color: "var(--light-color)", textAlign: "left" }}>
          You are about to settle a debt of
          <div style={{ color: "var(--pink)", marginLeft: "5px" }}> {currency(amount, { symbol: '€', decimal: ',', separator: '.' }).format()}&nbsp;</div>
          <div> between <strong>{`${sessionData.userId === senderId ? "You" : senderName}`}</strong></div>
          &nbsp;and&nbsp;
          <strong>{name}</strong>
        </div>
        <div onClick={() => recordTransfer(amount, receiverId)} style={{ backgroundColor: "var(--label-color-6)" }} className="accept-reject medium flex row overflow-hidden alignitems-center t3 padding15 pointer shadow justcont-center">
          {loading ? <IonIcon name='sync' className='t3 spin' /> : "Settle Up"}
        </div>
        <div onClick={() => setMenuParams({ open: false })} style={{ backgroundColor: "var(--lightpink)" }} className="accept-reject medium flex row overflow-hidden alignitems-center t3 padding15 pointer shadow justcont-center">
          Cancel
        </div>
      </div>
    </div>
  )
}

export default SettleUp