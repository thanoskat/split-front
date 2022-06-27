import { useState, useEffect, useRef } from 'react'
import { Link, useParams, useNavigate } from 'react-router-dom'
import useAxios from '../utility/useAxios'
import store from '../redux/store'
import IonIcon from '@reacticons/ionicons'
import dayjs from 'dayjs'

export default function ReviewGroups() {
  const params = useParams()
  const api = useAxios()
  const navigate = useNavigate()
  const abortControllerRef = useRef(new AbortController())
  const sessionData = store.getState().authReducer.sessionData
  const [expenses, setExpenses] = useState({
    groupTitle:"",
    all:[],
    filtered:[]
  })
  const [loading, setLoading] = useState(false)
  const [participateInAll, setParticipateInAll] = useState(true)

  //fix going back before submitting any reviews
 // console.log(params)
  const verifyInvitation = async () => {
    try {
      abortControllerRef.current.abort()
      abortControllerRef.current = new AbortController()
      const res = await api.post('/invitation/verify', {
        code: `${params.invitationCode}`
      },
        { signal: abortControllerRef.current.signal })
      const members = res.data.members
      const expenses = res.data.expenses
      let expArr = []
      expenses.map((expense) => {
        if (expense.splitEqually === true && expense.participants.length === members.length) {
          expArr.push(expense)
        }
      })
      console.log(res.data)
      setExpenses({all:expArr, filtered:[], groupTitle:res.data.groupTitle})
      if (members.includes(sessionData.userId)) return
      console.log("navigate")
      //navigate(`/i/${params.invitationCode}`)
    }
    catch (error) {
      console.log('/invitation/verify', error.response?.status, error.response?.data)
    }
  }

  useEffect(() => {
    verifyInvitation()
    // eslint-disable-next-line
  }, [])

  const handleClick = (clickedExpense) =>{
    if(expenses.filtered?.map(expense=>expense._id).includes(clickedExpense?._id)){
      setExpenses({...expenses, filtered:expenses.filtered.filter(expense=>expense._id!==clickedExpense._id)})
    }else{
      //setNewExpense({ ...newExpense, participants: [...newExpense.participants, { memberId: participantClickedId }] })
      setExpenses({...expenses, filtered:[...expenses.filtered, clickedExpense]})
    }
  }

  return (

    <div className='gotogroup flex column fixed'>

      <div id="homepage" className=' flex column' style={{ color: "var(--light-color)" }}>

        <div className='logo t66 flex alignitems-center justcont-spacebetween '>
          <div>
            α
          </div>
        </div>
        <div className='padding3rem3rem'></div>

        <div className='loginBox flex column ' style={{ backgroundColor: "var(--layer-1-color)", borderColor: "var(--layer-1-color)", borderStyle: "solid" }}>
          <div className='whiteSpace-initial'>
            <div className='flex column gap4 padding4'>
              <div>There are shared expenses in <strong>{expenses?.groupTitle}</strong> which were created by current members before you joined. What would you like to do?  </div>
            </div>
          </div>
        </div>


        <div style={{ borderRadius: "4px", padding: "0.8rem", border: "none", color: "var(--light-color)", backgroundColor: "#1f1f22", marginTop: "1rem" }}>
          <div className='shadow flex relative justcont-spacebetween' style={{ boxShadow: "none" }}>
            <div className='alignself-center'>Participate in all shared expenses</div>
            <div className='tick-cube' onClick={() => setParticipateInAll(prev => !prev)}> {participateInAll ? <i style={{ cursor: "pointer", fontSize: "29px", bottom: "0px", color: "var(--label-color-1)" }} className='check icon absolute'></i> : ""} </div>
          </div>
        </div>

        {!participateInAll ?
          <div>
            <div className='loginBox flex column ' style={{ backgroundColor: "var(--layer-1-color)", borderColor: "var(--layer-1-color)", borderStyle: "solid", marginTop: "1rem" }}>
              <div className='whiteSpace-initial'>
                <div className='flex column gap4 padding4'>
                  <div>Review shared expenses and choose those you should participate in</div>
                </div>
              </div>
            </div>


            <div id='expenses' className='flex flex-1 column overflow-auto' style={{ marginTop: "1rem" }}>
              {expenses?.all.map(expense => (
                <div key={expense._id} id='expense' className={`flex column pointer ${expenses.filtered?.map(expense=>expense._id).includes(expense._id)? 'expenseFilled':'expenseEmpty'}`} onClick={()=>handleClick(expense)}>
                  <div className='flex row justcont-spacebetween alignitems-center'>
                    <div className='flex row'>
                      {/* <div id='expense-date'>{dayjs(expense.createdAt).calendar(null, calendarConfig).toUpperCase()}&nbsp;</div> */}
                      <div id='expense-time'>{dayjs(expense.createdAt).format('HH:mm')}</div>
                    </div>

                  </div>
                  <div className='flex row justcont-spacebetween'>
                    <div id='expense-description'>{expense.description}</div>
                    <div id='expense-amount'>${expense.amount}</div>
                  </div>
                  <div className='flex row justcont-spacebetween alignitems-center'>
                    <div className='flex row alignitems-center' style={{ gap: '8px' }}>

                      <div style={{ fontSize: '12px', fontWeight: '700' }}>PAID BY</div>
                      <div
                        id='expense-pill' className='shadow'>
                        {expense?.spender.nickname}
                      </div>
                    </div>
                  </div>
                </div>
              )).reverse()}
              <div style={{ marginBottom: "80px" }}>
              </div>
            </div>
          </div> : ""}
      </div>

      <div className='submit-button-container flex alignself-center padding1010 fixed'>
        <button
          style={{ padding: "0.8rem" }}
          className={`shadow submit-button ${"" ? "active"
            : null} h-flex justcont-spacearound `}
          onClick={()=>console.log("")}
          disabled={"" ? false : true}>
          {loading ? <IonIcon name='sync' className='t3 spin' /> : "Continue to Group"}
        </button>
      </div>

    </div>
  )
}
