import { useState } from 'react'
import useAxios from '../utility/useAxios'
import { useSelector } from 'react-redux'
import currency from 'currency.js'
import IonIcon from '@reacticons/ionicons'

const TabMembers = () => {

  const selectedGroup = useSelector(state => state.mainReducer.selectedGroup)
  //to be deleted
  const [UserIDtoBeAdded, SetUserIDtoBeAdded] = useState("")
  const [GroupIDtoAddUser, SetGroupIDtoAddUser] = useState("")
  const api = useAxios()
  const onSubmitAddUserToGroup = async (e) => {
    const IDs = {
      userID: UserIDtoBeAdded,
      groupID: GroupIDtoAddUser
    }

    await api.post('groups/addUserToGroup', IDs)
    //e.target.reset()
    //need to rerender for calculations to appear
  }
  //end of - to be deleted
  const [showTreeID, setShowTreeID] = useState([])
  console.log(selectedGroup)
  console.log(showTreeID)
  const memberInfoConstructor = (selectedGroup) => {
    let members = []

    selectedGroup?.members.map((member) => {
      let pendingTotalAmount = currency(0);
      let total = currency(0)
      let toFrom = []
      let isSenderReceiverSettled
      selectedGroup.expenses.map(expense => {
        if (expense.sender._id === member._id) {
          total = total.add(expense.amount)
        }
      })
      selectedGroup.pendingTransactions.map((tx) => {
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
  console.log(memberInfo)

  const Tree = ({ toFrom, isSenderReceiverSettled }) => {
    return (
      <div className='tree' style={{ bottom: "10px" }}>
        <ul>
          {toFrom?.map(member => (
            <li key={toFrom._id}>
              {isSenderReceiverSettled === 1 ?
                <div className='flex row'><div style={{ color: "var(--pink)" }}>{` ${currency(member.amount, { symbol: '€', decimal: ',', separator: '.' }).format()}`}&nbsp;</div> to {member.name}</div>
                : isSenderReceiverSettled === 2 ?
                  <div className='flex row'><div style={{ color: "var(--green)" }}>{` ${currency(member.amount, { symbol: '€', decimal: ',', separator: '.' }).format()}`}&nbsp;</div> from {member.name}</div> : ""}
            </li>))}
        </ul>
      </div>
    )
  }

  const Member = ({ id, name, isSenderReceiverSettled, toFrom, pendingTotalAmount, totalSpent }) => {

    const showTreefcnt = (id) => {
      if (showTreeID.includes(id)) {
        setShowTreeID(showTreeID.filter(treeID => treeID !== id))
      } else {
        setShowTreeID([...showTreeID, id])
      }
    }

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
              owes<div style={{ color: "var(--pink)" }}>&nbsp;{` ${currency(pendingTotalAmount, { symbol: '€', decimal: ',', separator: '.' }).format()}`}&nbsp; </div> to &nbsp;
              <div className='pill empty pointer justcont-center' onClick={() => showTreefcnt(id)}
                style={{ '--pill-color': 'var(--layer-6-color)' }}>
                <IonIcon name='people-sharp' />
                {toFrom?.length}
              </div>&nbsp;
            </div> : isSenderReceiverSettled === 2 ?
              <div className="description flex row alignitems-center">
                is owed<div style={{ color: "var(--green)" }}>&nbsp;{` ${currency(pendingTotalAmount, { symbol: '€', decimal: ',', separator: '.' }).format()}`}&nbsp;</div>from &nbsp;
                <div className='pill empty pointer justcont-center' onClick={() => showTreefcnt(id)}
                  style={{ '--pill-color': 'var(--layer-6-color)' }}>
                  <IonIcon name='people-sharp' />
                  {toFrom?.length}
                </div>&nbsp;
              </div> :
              <div className="description">
                is settled
              </div>}

          <div className="totalSpent medium t25 white">
            {` ${currency(totalSpent, { symbol: '€', decimal: ',', separator: '.' }).format()}`}
          </div>
        </div>


        <Tree
        toFrom={toFrom}
        isSenderReceiverSettled={isSenderReceiverSettled} />



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


      <form
        onSubmit={e => onSubmitAddUserToGroup(e)}
      >
        <input
          onChange={event => SetUserIDtoBeAdded(event.target.value)}
          placeholder='User ID' />
        <input
          onChange={event => SetGroupIDtoAddUser(event.target.value)}
          placeholder='group ID address ' />
        <button type="submit">Add User to Group</button>
      </form>

    </div>
  );
}

export default TabMembers;
