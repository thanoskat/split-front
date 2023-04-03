import React from 'react'
import { useEffect, useState, useRef } from 'react'
import useAxios from '../utility/useAxios'
import currency from 'currency.js'
import dayjs from 'dayjs'
import calendar from 'dayjs/plugin/calendar'
import IonIcon from '@reacticons/ionicons'
import { useDispatch, useSelector } from 'react-redux'
import { setTrackID } from '../redux/mainSlice'
import { useNavigate } from 'react-router-dom'
dayjs.extend(calendar)

export default function BreakDown({ setMenuParams }) {
  const [txhistory, setTxHistory] = useState()
  const [loading, setLoading] = useState(false)
  const api = useAxios()
  const displayedGroup = useSelector(state => state.mainReducer.selectedGroup)
  const abortControllerRef = useRef(new AbortController())
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const calendarConfig = {
    sameDay: '[Today]',
    nextDay: '[Tomorrow]',
    nextWeek: 'dddd',
    lastDay: '[Yesterday]',
    lastWeek: 'MMM DD',
    sameElse: 'MMM DD'
  }

  //add button on settle up
  //navigate to expense when clicked?
  console.log(displayedGroup)
  const getHistoricBalance = async () => {
    setLoading(true)
    try {
      const res = await api.post('/transaction/history', { groupID: displayedGroup.id }, { signal: abortControllerRef.current.signal })
      //console.log(res.data)
      // const items = Array.from(res.data.keys());
      setTxHistory(res.data.EUR) //need to decide how to display other currencies
    } catch (err) {
      console.log("txhistory Error", err)
    }
    setLoading(false)
  }

  useEffect(() => {
    getHistoricBalance()
  }, [])


  const handleTransactionClick = (id, isTransfer) => {
    dispatch(setTrackID(id))
    setMenuParams({ open: false })
    if (isTransfer) {
      navigate(`/${displayedGroup.id}/transfers`)
    } else {
      navigate(`/${displayedGroup.id}/expenses`)
    }
  }

  return (
    <div id='breakDown' className='flex column fixed ' style={{ right: "0px" }}>
      {loading && <div className='loadingCenter alignself-center'>
        <IonIcon name='sync' className='spin' size={50} />
      </div>}
      <div id='menu-header' className='flex row '>
        <div className='cancelIcon alignself-center pointer' onClick={() => setMenuParams({ open: false })}>
          <i className='arrow left icon'></i>
        </div>
        <div>
        </div>
      </div>
      <div className='flex column overflow-auto ' style={{ maxWidth: "100%", overflowX: "hidden" }}>
        {txhistory?.map((tx, index) => (
          <div id="marginLeft" className='flex column alignitems-center' style={{ marginBottom: "15px" }} onClick={() => handleTransactionClick(tx.id, tx.isTransfer)}>
            <div className='flex column alignitems-center' style={{ gap: "0px" }}>
              <div className='flex row justcont-spacebetween'>
                <div id="expense-date"> {dayjs(tx.date).calendar(null, calendarConfig).toUpperCase()}&nbsp;</div>
                <div id="expense-time"> {dayjs(tx.date).format('HH:mm')}</div>
              </div>
              <div id="expense-description">
                {tx.description}
              </div>
            </div>
            <div className='flex row justcont-center alignitems-center gap10 pointer' style={{
              width: "400px",
              minHeight: "80px"
            }}>
              <div className='flex row justcont-end' style={{ maxWidth: "50px" }}>
                <div className='flex column alignitems-end'>
                  <div className='cla flex row justcont-end' style={{ color: "#8583F2" }}>
                    <strong>
                      {tx.isTransfer === true ? (tx.borrowed !== 0 ? "You received" : "You transferred")
                        :
                        (tx.borrowed !== 0 ? "Paid on your behalf" :
                          <div className='flex column gap6' style={{ marginTop: "7px" }}>
                            <div className='flex row justcont-end' style={{ color: "#7f7f7f" }}>You paid {currency(tx.userPaid, { symbol: '€', decimal: ',', separator: '.' }).format()}</div>
                            <div className='flex row justcont-end' style={{ color: "#7f7f7f" }}>Your share -{currency(tx.userShare, { symbol: '€', decimal: ',', separator: '.' }).format()}</div>
                            <div className='cla flex row justcont-end'><div>You paid an extra</div>&nbsp;<div style={{ color: "#dddddd" }}>{currency(tx.lent, { symbol: '€', decimal: ',', separator: '.' }).format()}</div></div>
                          </div>
                        )}
                    </strong>
                    &nbsp;
                    <div style={{ color: "#dddddd" }}>
                      <strong>
                        {tx.borrowed !== 0 ? currency(tx.borrowed, { symbol: '€', decimal: ',', separator: '.' }).format()
                          :
                          (tx.isTransfer === true ? currency(tx.lent, { symbol: '€', decimal: ',', separator: '.' }).format() : "")
                        }
                      </strong>
                    </div>
                  </div>
                </div>
              </div>
              <div className='vl'></div>
              <div className='' style={{ maxWidth: "50px" }}>
                <div className='flex row'>
                  {tx.balance === 0 ?

                    <div className='flex row alignitems-center' style={{ color: "#8583F2" }}>
                      <div className='flex row alignitems-center'>
                        <strong>{index === txhistory.length - 1 ? "You are settled" : "You were settled"}</strong>
                        <IonIcon name='checkmark-sharp' className='t1' style={{ color: 'var(--green)', fontSize: '22px', fontWeight: '500' }} />
                      </div>
                    </div>
                    :
                    <div className="cla flex row">
                      <div style={{ color: "#8583F2" }}>
                        <strong>{tx.balance > 0 ? (index === txhistory.length - 1 ? "You are owed" : "You were owed") : (index === txhistory.length - 1 ? "You owe" : "You owed")}
                        </strong>
                      </div>
                      &nbsp;
                      <div style={{ color: tx.balance > 0 ? "var(--green)" : "var(--pink)" }}>
                        <strong>{currency(Math.abs(tx.balance), { symbol: '€', decimal: ',', separator: '.' }).format()}
                        </strong>
                      </div>
                    </div>}
                </div>
              </div>
            </div>
          </div>
        )).reverse()}

        {txhistory?.length === 0 ?
          <div id="marginLeft" className='flex column alignitems-center' style={{ marginBottom: "0px" }}>
            <div className='flex row justcont-spacebetween'>
              <div id="expense-date"> {dayjs().calendar(null, calendarConfig).toUpperCase()}&nbsp;</div>
              <div id="expense-time"> {dayjs().format('HH:mm')}</div>
            </div>
            <div id="expense-description" style={{ whiteSpace: 'initial', textAlign: 'center', alignSelf: 'center', justifySelf: 'center' }}>
              No recorded expenses or transfers 😴
            </div>
            <div className='flex row justcont-center alignitems-center gap10' style={{
              width: "400px",
              minHeight: "80px"
            }}>
              <div className='flex row justcont-end' style={{ maxWidth: "50px" }}>
              </div>
              <div className='vl'></div>
              <div className='' style={{ maxWidth: "50px" }}>
              </div>
            </div>
          </div>
          : ""}
        <div id="marginLeft" className='flex column alignitems-center' style={{ marginBottom: "15px" }}>
          <div className='flex row justcont-spacebetween'>
            <div id="expense-date"> {dayjs(displayedGroup.createdAt).calendar(null, calendarConfig).toUpperCase()}&nbsp;</div>
            <div id="expense-time"> {dayjs(displayedGroup.createdAt).format('HH:mm')}</div>
          </div>
          {/* <h2><span>Group Created</span></h2> */}
          <div style={{ fontSize: "22px", fontWeight: "600", color: "#dddddd" }}>Group Created</div>
          <div className='dot' style={{ marginTop: "10px" }}></div>
        </div>

      </div>
    </div>
  )
}
