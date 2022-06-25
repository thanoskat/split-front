import { useState } from 'react'
import { Outlet } from 'react-router-dom'
import { useSelector } from 'react-redux'
import currency from 'currency.js'


const TabMembers = () => {

  const selectedGroup = useSelector(state => state.mainReducer.selectedGroup)

  const [showTreeID, ] = useState([])
  console.log(selectedGroup)
  console.log(showTreeID)
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
        if (tx.sender._id === member._id) {
          pendingTotalAmount = pendingTotalAmount.add(tx.amount)
          toFrom.push({ _id: tx.receiver._id, name: tx.receiver.nickname, amount: tx.amount })
          isSenderReceiverSettled = 1 //sender->1
        } else if (tx.receiver._id === member._id) {
          pendingTotalAmount = pendingTotalAmount.add(tx.amount)
          toFrom.push({ _id: tx.sender._id, name: tx.sender.nickname, amount: tx.amount })
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
  //console.log(memberInfo)

  const Tree = ({ toFrom, isSenderReceiverSettled }) => {
    return (
      <div className='tree' style={{ bottom: "10px", margin: "0 0 -15px 0" }}>
        <ul>
          {toFrom?.map(member => (
            <li key={member._id}>
              {isSenderReceiverSettled === 1 ?
                <div className='flex row'><div style={{ color: "var(--pink)" }}>{` ${currency(member.amount, { symbol: '€', decimal: ',', separator: '.' }).format()}`}&nbsp;</div> to {member.name}</div>
                : isSenderReceiverSettled === 2 ?
                  <div className='flex row'><div style={{ color: "var(--green)" }}>{` ${currency(member.amount, { symbol: '€', decimal: ',', separator: '.' }).format()}`}&nbsp;</div> from {member.name}</div> : <></>}
            </li>))}
        </ul>
      </div>
    )
  }

  const Member = ({ id, name, isSenderReceiverSettled, toFrom, pendingTotalAmount, totalSpent }) => {

    // const showTreefcnt = (id) => {
    //   if (showTreeID.includes(id)) {
    //     setShowTreeID(showTreeID.filter(treeID => treeID !== id))
    //   } else {
    //     setShowTreeID([...showTreeID, id])
    //   }
    // }

    return (
      <div className='member flex column justcont-spacebetween gap8'>
        <div className="nameIDandTotal flex row justcont-spacebetween">
          <div className="name-ID flex row gap8 alignitems-center ">
            <div className="name medium t25 white">
              {name}
            </div>
            <div className="memberID">
              #1235
            </div>
          </div>
          <div className="totalSpent">
            Total spent
          </div>
        </div>
        <div className="owesOwed flex row justcont-spacebetween alignitems-center">
          {isSenderReceiverSettled === 1 ?
            <div className="description flex row alignitems-center">
              owes<div style={{ color: "var(--pink)" }}>&nbsp;{` ${currency(pendingTotalAmount, { symbol: '€', decimal: ',', separator: '.' }).format()}`}&nbsp; </div>
              {toFrom.length === 1 ? <div>to {toFrom[0].name} &nbsp;</div> : <div>in total &nbsp;</div>}
              {/* <div className='pill empty pointer justcont-center' onClick={() => showTreefcnt(id)}
                style={{ '--pill-color': 'var(--layer-6-color)' }}>
                <IonIcon name='people-sharp' />
                {toFrom?.length}
              </div>&nbsp; */}
            </div> : isSenderReceiverSettled === 2 ?
              <div className="description flex row alignitems-center" style={{margin:"0 0 15px 0"}}>
                is owed<div style={{ color: "var(--green)" }}>&nbsp;{` ${currency(pendingTotalAmount, { symbol: '€', decimal: ',', separator: '.' }).format()}`}&nbsp;</div>
                {toFrom.length === 1 ? <div>from {toFrom[0].name} &nbsp;</div> : <div>in total &nbsp;</div>}
                {/* <div className='pill empty pointer justcont-center' onClick={() => showTreefcnt(id)}
                  style={{ '--pill-color': 'var(--layer-6-color)' }}>
                  <IonIcon name='people-sharp' />
                  {toFrom?.length}
                </div>&nbsp; */}
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
    <div className='flex flex-1 column overflow-hidden '>
      <div className='t4 flex row justcont-spacebetween'>
      </div>

      <div className='expenses-tab t5  top-radius flex flex-1 column overflow-auto'>
        {memberInfo.map((member) => (
          <div key={member._id} className='overflow-visible'>
            <Member
              key={member._id}
              id={member._id}
              name={member.name}
              isSenderReceiverSettled={member.isSenderReceiverSettled}
              toFrom={member.toFrom}
              pendingTotalAmount={member.pendingTotalAmount}
              totalSpent={member.totalSpent} />
            <div className='separator-2 padding0014' />
          </div>
        ))}
      </div>

      <Outlet />
    </div>
  );
}

export default TabMembers;
