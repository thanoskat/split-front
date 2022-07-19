import { Outlet } from 'react-router-dom'
import { useSelector } from 'react-redux'
import currency from 'currency.js'
import store from '../redux/store'
import IonIcon from '@reacticons/ionicons'
import { useSearchParams } from 'react-router-dom'



const TabMembers = () => {
  const sessionData = store.getState().authReducer.sessionData
  const selectedGroup = useSelector(state => state.mainReducer.selectedGroup)
  const [searchParams, setSearchParams] = useSearchParams()


  Array.prototype.move = function (from, to) {
    this.splice(to, 0, this.splice(from, 1)[0]);
  };

  const memberInfoConstructor = (selectedGroup) => {
    let members = []
    selectedGroup?.members.forEach((member) => {
      let pendingTotalAmount = currency(0);
      let total = currency(0)
      let toFrom = []
      let isSenderReceiverSettled
      selectedGroup.expenses.forEach(expense => {
        if (expense.spender._id === member._id) {
          total = total.add(expense.amount)
        }
      })
      selectedGroup.pendingTransactions.forEach((tx) => {
        if (tx.sender?._id === member?._id) {
          pendingTotalAmount = pendingTotalAmount.add(tx.amount)
          toFrom.push({ _id: tx.receiver._id, name: tx.receiver.nickname, amount: tx.amount })
          isSenderReceiverSettled = 1 //sender->1
        } else if (tx.receiver._id === member._id) {
          pendingTotalAmount = pendingTotalAmount.add(tx.amount)
          toFrom.push({ _id: tx.sender?._id, name: tx.sender?.nickname, amount: tx.amount })
          isSenderReceiverSettled = 2 //receiver->2
        }
      })
      members.push({
        _id: member._id,
        name: member.nickname,
        isSenderReceiverSettled,
        toFrom,
        pendingTotalAmount: pendingTotalAmount.value,
        totalSpent: total.value
      })
    })
    return (members)
  }


  const memberInfo = memberInfoConstructor(selectedGroup)
  const userNoMembers = memberInfo.filter(member => member._id === sessionData.userId)
  const membersNoUser = memberInfo.filter(member => member._id !== sessionData.userId)


  const Tree = ({ toFrom, isSenderReceiverSettled, id }) => {

    return (
      <div className='tree' style={{ bottom: "10px", margin: "0 0 -15px 0" }}>
        <ul>
          {toFrom?.map(member => (
            <li key={member._id}>
              {isSenderReceiverSettled === 1 ?
                <div className='flex row justcont-spacebetween'>
                  <div className='flex row alignitems-center whiteSpace-initial'>
                    <div style={{ color: "var(--pink)" }}>{` ${currency(member.amount, { symbol: '€', decimal: ',', separator: '.' }).format()}`}&nbsp;
                    </div> to &nbsp;
                    <strong>{member.name}</strong>
                  </div>
                  &nbsp;
                  {id === sessionData.userId ? //only show buttons in You section
                    <div id='settleUp-pill' className='pointer shadow' onClick={() => setSearchParams({ menu: 'settleup', amount: member.amount, receiverId: member._id, name: member.name })}>Settle Up</div> : ""}
                </div>
                : isSenderReceiverSettled === 2 ?
                  <div className='flex row alignitems-center '>
                    <div style={{ color: "var(--green)" }}>{` ${currency(member.amount, { symbol: '€', decimal: ',', separator: '.' }).format()}`}&nbsp;
                    </div>
                    <div>
                      from
                    </div>
                    &nbsp;
                    <strong>{member.name}</strong>
                  </div>
                  : <></>}
            </li>))}
        </ul>
      </div>
    )
  }

  const Member = ({ id, name, isSenderReceiverSettled, toFrom, pendingTotalAmount, totalSpent }) => {
    console.log(toFrom)
    return (
      <div id='expense' className='flex column'>
        <div className="nameIDandTotal flex row justcont-spacebetween">
          <div className="name-ID flex row gap8 alignitems-center ">
            <div className="name medium t25 white">
              {id === sessionData.userId ? "You" : name}
            </div>
          </div>
          <div >
            Total spent
          </div>
        </div>
        <div className="owesOwed flex row justcont-spacebetween alignitems-center">
          {isSenderReceiverSettled === 1 ?
            <div className="description flex row alignitems-center">
              {id === sessionData.userId ? "owe" : "owes"}<div style={{ color: "var(--pink)" }}>&nbsp;{` ${currency(pendingTotalAmount, { symbol: '€', decimal: ',', separator: '.' }).format()}`}&nbsp; </div>
              {toFrom.length === 1 ? <div>to <strong>{toFrom[0].name}</strong> &nbsp;</div> : <div>in total &nbsp;</div>}
            </div> : isSenderReceiverSettled === 2 ?
              <div className="description flex row alignitems-center" >
                {id === sessionData.userId ? "are owed" : "is owed"}<div style={{ color: "var(--green)" }}>&nbsp;{` ${currency(pendingTotalAmount, { symbol: '€', decimal: ',', separator: '.' }).format()}`}&nbsp;</div>
                {toFrom.length === 1 ? <div>from <strong>{toFrom[0].name}</strong> &nbsp;</div> : <div>in total &nbsp;</div>}
              </div> :
              <div className="description flex row alignitems-center">
                <div>
                  {id === sessionData.userId ? "are" : "is"} settled
                </div>
                <IonIcon name='checkmark-sharp' className='t1' style={{ color: 'var(--green)', fontSize: "22px", fontWeight: "500" }} />
              </div>}
          <div className="totalSpent medium t25 white">
            {` ${currency(totalSpent, { symbol: '€', decimal: ',', separator: '.' }).format()}`}
          </div>
        </div>
        {id === sessionData.userId && isSenderReceiverSettled === 1 && toFrom.length === 1 ?
          <div className='flex justcont-start'>
            <div id='settleUp-pill' className='pointer shadow' onClick={() => setSearchParams({ menu: 'settleup', amount: toFrom[0].amount, receiverId: toFrom[0]._id, name: toFrom[0].name })}>Settle Up</div>
          </div>
          : ""}
        {toFrom.length === 1 || isSenderReceiverSettled === undefined ? <></> :
          <Tree
            id={id}
            toFrom={toFrom}
            isSenderReceiverSettled={isSenderReceiverSettled} />
        }
      </div>
    )
  }

  return (
    <div className='flex flex-1 column overflow-hidden' style={{ padding: '14px', gap: '14px' }}>
      <div id='expenses' className='flex flex-1 column overflow-auto'>
        {userNoMembers.map((member) => (
          <div key={member._id} className='overflow-visible'>
            <Member
              key={member._id}
              id={member._id}
              name={member.name}
              isSenderReceiverSettled={member.isSenderReceiverSettled}
              toFrom={member.toFrom}
              pendingTotalAmount={member.pendingTotalAmount}
              totalSpent={member.totalSpent} />
          </div>
        ))}
        {membersNoUser.map((member) => (
          <div key={member._id} className='overflow-visible'>
            <Member
              key={member._id}
              id={member._id}
              name={member.name}
              isSenderReceiverSettled={member.isSenderReceiverSettled}
              toFrom={member.toFrom}
              pendingTotalAmount={member.pendingTotalAmount}
              totalSpent={member.totalSpent} />
          </div>
        ))}
        <div style={{ marginBottom: "80px" }}>
        </div>
      </div>
      <Outlet />
    </div>
  );
}

export default TabMembers;
