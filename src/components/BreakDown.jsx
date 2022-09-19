import React from 'react'
import { useEffect, useState, useRef } from 'react'
import useAxios from '../utility/useAxios'
import currency from 'currency.js'
import { useSelector } from 'react-redux'
import dayjs from 'dayjs'
import calendar from 'dayjs/plugin/calendar'
import IonIcon from '@reacticons/ionicons'
dayjs.extend(calendar)

export default function BreakDown({ setMenuParams }) {
  const [txhistory, getTxHistory] = useState()
  const [loading, setLoading] = useState(false)
  const api = useAxios()
  const displayedGroup = useSelector(state => state.mainReducer.selectedGroup)
  const abortControllerRef = useRef(new AbortController())
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

  const getHistoricBalance = async () => {
    setLoading(true)
    try {
      const res = await api.post('/expense/txhistory', { groupID: displayedGroup._id }, { signal: abortControllerRef.current.signal })
      console.log(res.data)
      getTxHistory(res.data)
    } catch (err) {
      console.log("txhistory Error", err)
    }
    setLoading(false)
  }

  useEffect(() => {
    getHistoricBalance()
  }, [])


  return (
    <div id='breakDown' className='flex column fixed' style={{ right: "0px" }}>
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

      <div className='flex column overflow-auto' style={{ maxWidth: "100%", overflowX: "hidden" }}>

        {txhistory?.map((tx, index) => (
          <div className='flex column alignitems-center' style={{ marginBottom: "15px", marginLeft: "40px" }} >
            <div className='flex column alignitems-center' style={{ gap: "0px" }}>
              <div className='flex row justcont-spacebetween'>
                <div id="expense-date"> {dayjs(tx.date).calendar(null, calendarConfig).toUpperCase()}&nbsp;</div>
                <div id="expense-time"> {dayjs(tx.date).format('HH:mm')}</div>
              </div>
              <div id="expense-description">
                {tx.description}
              </div>
            </div>
            <div className='flex row justcont-center alignitems-center gap10' style={{
              width: "400px",
              minHeight: "80px"

            }}>
              <div className='flex row justcont-end' style={{ maxWidth: "50px" }}>
                <div className='flex column alignitems-end'>
                  <div style={{ color: "#8583F2" }}>
                    <strong>
                      {tx.isTransfer === true ? (tx.borrowed !== 0 ? "You received" : "You transferred")
                        :
                        (tx.borrowed !== 0 ? "Paid on your behalf" :
                          <div className='flex column gap6'>
                            <div className='flex row justcont-end' style={{ color: "#7f7f7f" }}>You paid {currency(tx.userPaid, { symbol: '€', decimal: ',', separator: '.' }).format()}</div>
                            <div className='flex row justcont-end' style={{ color: "#7f7f7f" }}>Your share -{currency(tx.userShare, { symbol: '€', decimal: ',', separator: '.' }).format()}</div>
                            <div className='flex row justcont-end'><div>You lent an extra</div>&nbsp;<div style={{ color: "#dddddd" }}>{currency(tx.lent, { symbol: '€', decimal: ',', separator: '.' }).format()}</div></div>
                          </div>
                        )}
                    </strong>
                  </div>
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
              <div className='vl'></div>
              <div className='right text' style={{ maxWidth: "50px" }}>
                <div className='flex column'>
                  {tx.balance === 0 ?

                    <div className='flex row alignitems-center' style={{ color: "#8583F2" }}>
                      <div className='flex row alignitems-center'>
                        <strong>{index === txhistory.length - 1 ? "You are settled" : "You were settled"}</strong>
                        <IonIcon name='checkmark-sharp' className='t1' style={{ color: 'var(--green)', fontSize: '22px', fontWeight: '500' }} />
                      </div>
                    </div>

                    :
                    <div>
                      <div style={{ color: "#8583F2" }}><strong>{tx.balance > 0 ? (index === txhistory.length - 1 ? "You are owed" : "You were owed") : (index === txhistory.length - 1 ? "You owe" : "You owed")}</strong></div>
                      <div style={{ color: tx.balance > 0 ? "var(--green)" : "var(--pink)" }}><strong>{currency(Math.abs(tx.balance), { symbol: '€', decimal: ',', separator: '.' }).format()}</strong></div>
                    </div>}
                </div>
              </div>
            </div>
          </div>
        )).reverse()}
        <div className='flex column alignitems-center' style={{ marginBottom: "15px", marginLeft: "40px" }}>
          <div className='flex row justcont-spacebetween'>
            <div id="expense-date"> {dayjs(displayedGroup.createdAt).calendar(null, calendarConfig).toUpperCase()}&nbsp;</div>
            <div id="expense-time"> {dayjs(displayedGroup.createdAt).format('HH:mm')}</div>
          </div>
          <div id="expense-description">
            Group Created
          </div>
        </div>
      </div>
    </div>

  )
}
