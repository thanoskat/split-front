import { useDispatch, useSelector } from 'react-redux'
import { useState } from 'react'
import store from '../redux/store'


const TabSettleUp = () => {

  const sessionData = store.getState().authReducer.sessionData
  const selectedGroup = store.getState().mainReducer.selectedGroup

  const filterIDforPersonalTransactions = (value) => {//keeps userID for personal TXs
    if (String(value.sender._id) === sessionData.userId || String(value.receiver._id) === sessionData.userId) {
      return value;
    }
  }


  const personalTXs = selectedGroup?.pendingTransactions.filter(filterIDforPersonalTransactions)
  console.log(personalTXs)
  console.log(selectedGroup?.pendingTransactions)

  const SettleUp = ({ transaction }) => {
    return (
      <div className='settleUp flex column justcont-spacebetween gap8'>

        <div className='flex row justcont-spacebetween alignitems-center t25 white' style={{ padding: '20px 4px 20px 4px' }}>
          {transaction.sender._id === sessionData.userId ?
            <div className='main-text flex row gap6 alignitems-center'>
              <i style={{ width: "30px" }} className='arrow circle right icon'></i>
              <strong>You</strong>owe
              <strong>{transaction.receiver.nickname}</strong>
            </div> :
            <div className='main-text flex row gap6 alignitems-center'>
              <i style={{ width: "30px" }} className='arrow circle left icon'></i>
              <strong>{transaction.sender.nickname}
              </strong> owes <strong>You</strong></div>}
          <div className={transaction.sender._id !== sessionData.userId ? "amountSection-green medium" : "amountSection-red medium"}>{`$ ${transaction.amount}`}</div>
        </div>
      </div>
    )
  }



  return (
    <div className='flex flex-1 column overflow-hidden '>
      <div className='t4 flex row justcont-spacebetween'>
      </div>

      <div className='settleUp-tab t5  top-radius flex flex-1 column overflow-hidden'>
        <div className='overflow-auto'>
          {personalTXs?.map((transaction, index) =>
            <div key={index}>
              <SettleUp
                transaction={transaction} />
              <div className='separator-2 padding0014' />
            </div>
          )}
          <div className='settleTotal flex column justcont-spacebetween gap8'>
            <div className='flex row justcont-spacebetween alignitems-center t25 white' style={{ padding: '0px 4px 0px 4px' }}>
              <div className='flex column justcont-spacebetween gap8'> Total</div>
              <div className='amountSection'>$ 102.39</div>
            </div>
          </div>
          <div style={{ height: '120px' }} />
        </div>
      </div>
    </div>
  );
}

export default TabSettleUp;
