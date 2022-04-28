import { useDispatch, useSelector } from 'react-redux'
import store from '../redux/store'
import { setCurrentMenu,setSelectedPendingTX } from '../redux/mainSlice'
import currency from 'currency.js'

const TabSettleUp = () => {

  const filterIDforPersonalTransactions = (value) => {//keeps userID for personal TXs
    if (String(value.sender._id) === sessionData.userId || String(value.receiver._id) === sessionData.userId) {
      return value
    }
  }

  const dispatch = useDispatch()
  const sessionData = store.getState().authReducer.sessionData
  const selectedGroup = useSelector(state => state.mainReducer.selectedGroup)
  const personalTXs = selectedGroup?.pendingTransactions?.filter(filterIDforPersonalTransactions)

 // console.log(personalTXs)

  // const total = (personalTXs) => {
  //   let sum = 0 //on refresh shows zero which is an issue
  //   personalTXs?.map(tx => {
  //     if (tx.receiver._id === sessionData.userId) {
  //       sum += tx.amount
  //     } else {
  //       sum -= tx.amount
  //     }
  //   })
  //   return sum
  // }

  //const totalSum = total(personalTXs)

  const handleClick = (_id,transaction)=>{

    dispatch(setSelectedPendingTX(transaction))
    dispatch(setCurrentMenu('recordPayment'))
  }

  const SettleUp2 = ({ transaction }) => {
    return (
      <div>
        {transaction.sender._id === sessionData.userId ?
          <div className='settleUp flex column justcont-spacebetween gap8 pointer'
          onClick={()=>handleClick(transaction.receiver._id,transaction)}>
            <div className='flex row justcont-spacebetween alignitems-center t25 white' style={{ padding: '20px 4px 20px 4px' }}>

              <div className='main-text flex row gap6 alignitems-center'>
                <i style={{ width: "30px" }} className='arrow circle right icon'></i>
                <strong>You</strong>owe
                <strong>{transaction.receiver.nickname}</strong>
              </div>
              <div className="amountSection-red medium">{` ${currency(transaction.amount, { symbol: '€', decimal: ',', separator: '.' }).format()}`}</div>
            </div>
          </div>
          :
          <div className='settleUp flex column justcont-spacebetween gap8'
             >
            <div className='flex row justcont-spacebetween alignitems-center t25 white' style={{ padding: '20px 4px 20px 4px' }}>

              <div className='main-text flex row gap6 alignitems-center'>
                <i style={{ width: "30px" }} className='arrow circle left icon'></i>
                <strong>{transaction.sender.nickname}
                </strong> owes <strong>You</strong>
                </div>
                <div className="amountSection-green medium">{`${currency(transaction.amount, { symbol: '€', decimal: ',', separator: '.' }).format()}`}</div>
            </div>
          </div>
        }
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
              <SettleUp2
                index={index}
                transaction={transaction} />
              <div className='separator-2 padding0014' />
            </div>
          )}
          {/* {personalTXs?.length <= 1 ? "" :
            <div className='settleTotal flex column justcont-spacebetween gap8'>
              <div className='flex row justcont-spacebetween alignitems-center t25 white' style={{ padding: '0px 4px 0px 4px' }}>
                <div className='flex column justcont-spacebetween gap8'> Total</div>
                <div className={totalSum >= 0 ? "amountSection-green medium" : "amountSection-red medium"}>$ 120</div>
              </div>
            </div>} */}

          <div style={{ height: '120px' }} />
        </div>
      </div>
    </div>
  );
}
//{Math.abs(totalSum)}
export default TabSettleUp;
