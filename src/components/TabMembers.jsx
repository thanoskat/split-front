import { Outlet } from 'react-router-dom'
import { useSelector } from 'react-redux'
import currency from 'currency.js'
import store from '../redux/store'

const TabMembers = () => {
  const sessionData = store.getState().authReducer.sessionData
  const selectedGroup = useSelector(state => state.mainReducer.selectedGroup)


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

  console.log(membersNoUser)
  console.log(userNoMembers)

  const Tree = ({ toFrom, isSenderReceiverSettled }) => {
    return (
      <div className='tree' style={{ bottom: "10px", margin: "0 0 -15px 0" }}>
        <ul>
          {toFrom?.map(member => (
            <li key={member._id}>
              {isSenderReceiverSettled === 1 ?
                <div className='flex row'><div style={{ color: "var(--pink)" }}>{` ${currency(member.amount, { symbol: '€', decimal: ',', separator: '.' }).format()}`}&nbsp;</div> to &nbsp;<strong>{member.name}</strong></div>
                : isSenderReceiverSettled === 2 ?
                  <div className='flex row'><div style={{ color: "var(--green)" }}>{` ${currency(member.amount, { symbol: '€', decimal: ',', separator: '.' }).format()}`}&nbsp;</div> from &nbsp;<strong>{member.name}</strong></div> : <></>}
            </li>))}
        </ul>
      </div>
    )
  }

  const Member = ({ id, name, isSenderReceiverSettled, toFrom, pendingTotalAmount, totalSpent }) => {

    return (
      <div id='expense' className='flex column'>
        <div className="nameIDandTotal flex row justcont-spacebetween">
          <div className="name-ID flex row gap8 alignitems-center ">
            <div className="name medium t25 white">
              {id === sessionData.userId ? "You" : name}
            </div>
          </div>
          <div className="totalSpent">
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
                is settled
              </div>}
          <div className="totalSpent medium t25 white">
            {` ${currency(totalSpent, { symbol: '€', decimal: ',', separator: '.' }).format()}`}
          </div>
        </div>
        {toFrom.length === 1 || isSenderReceiverSettled === undefined ? <></> :
          <Tree
            toFrom={toFrom}
            isSenderReceiverSettled={isSenderReceiverSettled} />
        }
      </div>
    )
  }

  return (
    <div className='flex flex-1 column overflow-hidden'>
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
