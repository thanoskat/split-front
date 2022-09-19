import React from 'react'
import { useEffect, useState, useRef } from 'react'
import useAxios from '../utility/useAxios'
import currency from 'currency.js'
import { useSelector } from 'react-redux'

export default function BreakDown({ setMenuParams }) {
  const [txhistory, getTxHistory] = useState()
  const [loading, setLoading] = useState(false)
  const api = useAxios()
  const displayedGroup = useSelector(state => state.mainReducer.selectedGroup)
  const abortControllerRef = useRef(new AbortController())

//in the end add group created date
//add loading
//add button on settle up
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

      <div id='menu-header' className='flex row '>
        <div className='cancelIcon alignself-center pointer' onClick={() => setMenuParams({ open: false })}>
          <i className='arrow left icon'></i>
        </div>
        <div>
        </div>
      </div>

      <div className='flex column overflow-auto' style={{maxWidth:"100%", overflowX:"hidden"}}>

        {txhistory?.map((tx, index) => (
          <div className='flex column alignitems-center' style={{ marginBottom: "15px" }} >
            <div className='flex column alignitems-center'>
              <div className='flex row justcont-spacebetween'>
                <div id="expense-date"> Aug 1&nbsp;</div>
                <div id="expense-time"> 11:39</div>
              </div>
              <div id="expense-description">
                {tx.description}
              </div>
            </div>
            <div className='flex row justcont-center alignitems-center gap10' style={{
              width: "400px",
              paddingTop: "5px"
            }}>
              <div className='flex row justcont-end' style={{ maxWidth: "50px" }}>
                <div className='flex column alignitems-end'>
                  <div style={{ color: "#8583F2" }}>
                    <strong>
                      {tx.isTransfer === true ? (tx.borrowed !== 0 ? "You received" : "You transferred")
                        :
                        (tx.borrowed !== 0 ? "Paid on your behalf" : "You contributed")}
                    </strong>
                  </div>
                  <div ><strong>{tx.borrowed !== 0 ? currency(tx.borrowed, { symbol: '€', decimal: ',', separator: '.' }).format()
                    :
                    currency(tx.lent, { symbol: '€', decimal: ',', separator: '.' }).format()}</strong></div>
                </div>
              </div>
              <div className='vl'></div>
              <div className='right text' style={{ maxWidth: "50px" }}>
                <div className='flex column'>
                  <div style={{ color: "#8583F2" }}><strong>{tx.balance > 0 ? (index === txhistory.length - 1 ? "You are owed" : "You were owed") : (index === txhistory.length - 1 ? "You owe" : "You owed")}</strong></div>
                  <div style={{ color: tx.balance > 0 ? "var(--green)" : "var(--pink)" }}><strong>{currency(Math.abs(tx.balance), { symbol: '€', decimal: ',', separator: '.' }).format()}</strong></div>
                </div>
              </div>
            </div>
          </div>
        )).reverse()}
      </div>

    </div>

  )
}
