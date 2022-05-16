import { useState } from 'react'
import useAxios from '../utility/useAxios'
import { useSelector } from 'react-redux'
import currency from 'currency.js'

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
  console.log(selectedGroup)

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
          toFrom.push({_id:tx.receiver._id,name:tx.receiver.nickname, amount:tx.amount})
          isSenderReceiverSettled = 1 //sender->1
        } else if (tx.receiver._id === member._id) {
          pendingTotalAmount = pendingTotalAmount.add(tx.amount)
          toFrom.push({_id:tx.sender._id,name:tx.sender.nickname, amount:tx.amount})
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

  console.log(memberInfoConstructor(selectedGroup))
 
  const Member = ({ name, amount, total }) => {
    return (
      <div className='member flex column justcont-spacebetween gap8'>
        <div className="nameIDandTotal flex row justcont-spacebetween">
          <div className="name-ID flex row gap8 ">
            <div className="name">
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
        <div className="owesOwed flex row justcont-spacebetween">
          <div className="description">
            owes {"$40"} to 4
          </div>
          <div className="totalSpent">
            {"$19"}
          </div>
        </div>

      </div>
    )
  }


  return (
    <div className='flex flex-1 column overflow-hidden '>
      <div className='t4 flex row justcont-spacebetween'>
      </div>

      <div className='expenses-tab t5  top-radius flex flex-1 column overflow-hidden'>
        <div className='overflow-auto'>

          <Member name={"Christos"} />
          <div className='separator-2 padding0014' />

          <Member name={"Stratos"} />
          <div className='separator-2 padding0014' />

          <div style={{ height: '120px' }} />
        </div>
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
