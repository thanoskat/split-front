import useAxios from '../utility/useAxios'
import store from '../redux/store'
import IonIcon from '@reacticons/ionicons'
import currency from 'currency.js'
import { useState, useRef, useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { setSelectedGroup } from '../redux/mainSlice'


function RecordTransfer({ setSearchParams }) {
  const api = useAxios()
  const selectedGroup = store.getState().mainReducer.selectedGroup
  const sessionData = store.getState().authReducer.sessionData
  const abortControllerRef = useRef(null)
  const dispatch = useDispatch()
  const inputAmountRef = useRef(null)
  const [loading, setLoading] = useState(false)
  const [newTransfer, setNewTransfer] = useState({
    amount: "",
    description: "",
    transferTo: ""
  })

  console.log(newTransfer)
  useEffect(() => {
    setTimeout(() => {
      inputAmountRef.current.focus()
    }, 300)
    abortControllerRef.current = new AbortController()
    return () => {
      abortControllerRef.current.abort()
    }
    // eslint-disable-next-line
  }, [])


  const updateAmount = (e) => {
    setNewTransfer({
      ...newTransfer,
      amount: e.target.value //process(addCommas(removeNonNumeric(e.target.value.toString().split(".").map((el, i) => i ? el.split("").slice(0, 2).join("") : el).join("."))))
    })
  }

  const recordTransfer = async () => {

    if (newTransfer.transferTo === "") return null; //do not proceed to recording tx if no user has been selected
    if (newTransfer.amount === "") return null; //do not proceed to recording tx if no amount has been given
    setLoading(true)
    try {
      const res = await api.post(`/expense/addtransfer`,
        {
          groupId: selectedGroup._id, //does it feed at first render? Need to check
          sender: sessionData.userId,
          receiver: newTransfer.transferTo,
          amount: newTransfer.amount,
          description: newTransfer.description
        }, { signal: abortControllerRef.current.signal }
      )
      setLoading(false)
      setNewTransfer({ ...newTransfer, amount: "", description: "" })
      dispatch(setSelectedGroup(res.data))
      console.log(res)
    }
    catch (error) {
      console.log(error)
    }
    setSearchParams({})
  }

  const participantClicked = (memberClickedId) => {
    if (newTransfer.transferTo === memberClickedId) {
      setNewTransfer({ ...newTransfer, transferTo: null })
    }
    else {
      setNewTransfer({ ...newTransfer, transferTo: memberClickedId })
    }
  }

  const filterUser = (selectedGroup?.members.filter(member => member._id !== sessionData.userId))

  return (
    <div className='addExpenseBox flex column fixed'>
      <div className='addExpenseHeader flex row t1  padding1010 gap10'>
        <div className='cancelIcon alignself-center' onClick={() => setSearchParams({})}>
          <i className='arrow left icon t3'></i>
        </div>
        <div>
          Record Transfer
        </div>
        <div className='separator-0' />
      </div>

      <div className='inputsAndOptions-container flex column gap10 padding1010'>
        <div className='flex relative column'>
          <div className='input-amount flex relative column justcont-evenly '>
            <div className='currency-ticker-section '>
              <i className='angle down icon'></i>
              <div className='currency-ticker'>EUR </div>
            </div>

            <input
              id='styled-input'
              className='text-align-right'
              type='text'
              inputmode='decimal'
              placeholder='0'
              value={newTransfer.amount}
              onChange={(e) => updateAmount(e)}
              ref={inputAmountRef}
              spellCheck='false'
            />
           
          </div>
          <div className='t6' style={{ color: '#b6bfec', marginTop: '2px', fontWeight: '800' }}>Amount</div>
        </div>
        <div className='flex relative column'>
        <input
          className='styledInput t3'
          placeholder='e.g. settled debt'
          value={newTransfer.description}
          onChange={e => setNewTransfer({ ...newTransfer, description: e.target.value })}
          spellCheck='false'
        />
         <div className='t6' style={{ color: '#b6bfec', marginTop: '2px', fontWeight: '800' }}>Description</div>
        </div>

        To:
        <div className='flex row wrap gap10'>
          {filterUser.map(member => (
            <div className={`pill2 pointer shadow ${newTransfer.transferTo === (member._id) ? 'filled' : 'empty'}`}
              key={member._id} style={{ '--pill-color': `gray` }}
              onClick={() => participantClicked(member._id)}
            >
              {member.nickname}
            </div>))}
        </div>
      </div>

      <div className='submit-button-container flex padding1010'>
        <button
          style={{ padding: "0.8rem" }}
          className={`shadow submit-button ${Number(newTransfer.amount) !== 0 && newTransfer.transferTo !== null ? "active"
            :
            null} h-flex justcont-spacearound `}
          onClick={recordTransfer}
          disabled={newTransfer.amount &&
            Number(newTransfer.amount) !== 0
            ? false : true}>
          {loading ? <IonIcon name='sync' className='t3 spin' /> : "Submit"}
        </button>
      </div>

    </div>
  )
}

export default RecordTransfer