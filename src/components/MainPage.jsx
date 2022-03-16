import '../style/MainPage.css'
import '../style/summary.css'
import useAxios from '../utility/useAxios'
import { ModalFrame, LeaveGroupModal, AddExpenseModal, CreateGroupModal, SelectGroup, Container,Form } from '.'
import { useState, useEffect, useContext } from "react";
import { useLocation, useHistory, Link } from "react-router-dom";
import { AuthenticationContext } from '../contexts/AuthenticationContext'
import { GlobalStateContext } from '../contexts/GlobalStateContext'


function MainPage() {

  const [show, setShow] = useState(false);
  const [showLeaveGroup, setShowLeaveGroup] = useState(false);
  const [showExp, setShowExp] = useState(false);
  const [showtransact, setShowTransact]=useState(false)
  const [showCreate, setShowCreate] = useState(false);
  const [groupName, setGroupName] = useState("");
  const [groupInfo, setGroupInfo] = useState([]);
  const [groupID, setGroupID] = useState("");
  const [userInfo, setUserInfo] = useState({});
  // const [activeIndex, setActiveIndex] = useState(0);
  const [Users, setUsers] = useState([]);
  const { sessionData } = useContext(AuthenticationContext)
  const [refreshGroupList, setRefresh] = useState(false);
  const [size, setSize] = useState(200);
  const [personalTransactions, setPersonalTransactions] = useState([]);
  const [allTransactions, setAllTransactions] = useState([]);
  const [showAll, setShowAll] = useState(localStorage.getItem("showAll") == "true");
  const [members, setMembers] = useState([])
  const [showMembers, setShowMembers] = useState(localStorage.getItem("showMembers") == "true");
  const [transactionHistory, setTransactionHistory] = useState([]);
  const { activeIndex, setActiveIndex } = useContext(GlobalStateContext)
  const [inputAmount, setInputAmount] = useState('')
  const [txAmount, setTxAmount]=useState("")
  const [inputDescription, setInputDescription] = useState('')
  const [txDescription, setTxDescription]=useState("")
  const [keepID, setKeepID] = useState([])
  console.log(keepID)
  const api = useAxios()
  const location = useLocation()
  const history = useHistory()


  //https://javascript.info/object-copy
  //https://stackoverflow.com/questions/45373742/detect-route-change-with-react-router

  useEffect(async () => {

    try {
      const response = await api.get('/getusers/profile');
      const users = await api.get('/getusers')
      const pathIndex = parseInt(location.search.substring(location.search.indexOf("?") + 1))
      setUsers(users.data);
      setUserInfo(response.data);
      setGroupInfo(response.data.groups);
      if (isNaN(pathIndex)) {//will get in here when there is no link on top
        const pulledtransactions = await api.get(`/groups/${response.data.groups[0]._id}`) //gets don't have body so need to send data like this
        console.log("pending txs", pulledtransactions.data.members)
        setPersonalTransactions(pulledtransactions.data.pendingTransactions.filter(filterIDforPersonalTransactions))
        setAllTransactions(pulledtransactions.data.pendingTransactions);
        setTransactionHistory(pulledtransactions.data.transactions)
        setMembers(pulledtransactions.data.members.filter( filterIDfromMembers))
        console.log(pulledtransactions.data.members)
        history.push(`/main/${response.data.groups[activeIndex]._id}?${activeIndex}`)//reroutes to the first group on first render and then keeps track of the active index from global context
      } else {//it will get in here when there is a link to look at (hence pathIndex is not null)
        setGroupID(response.data.groups[pathIndex]._id)
        setGroupName(response.data.groups[pathIndex].title) //by keeping track of the path Index variable we can preserve a group after a refresh of the page
        setActiveIndex(pathIndex)//set active index in order to preserve highlighted option
        const pulledtransactions = await api.get(`/groups/${response.data.groups[pathIndex]._id}`)
        setPersonalTransactions(pulledtransactions.data.pendingTransactions.filter(filterIDforPersonalTransactions))
        console.log("!!",pulledtransactions.data.pendingTransactions)
        setAllTransactions(pulledtransactions.data.pendingTransactions);
        setTransactionHistory(pulledtransactions.data.transactions);
        setMembers(pulledtransactions.data.members.filter( filterIDfromMembers));
        console.log("members",pulledtransactions.data.members)
      }
    } catch (err) {
      console.dir(err);
    }
  }, [location])//This useEffect might be running twice (once at first render, then again because of changes in location)

  const cloner = () => { //replaced Users with members
    let clone = []
    for (let i = 0; i < members.length; i++) {
      if (members[i]._id === sessionData.userId) { continue } //do not feed own ID in users to be added to group
      clone.push(Object.assign({}, members[i]))
    }
    return clone;
  }

const utilities = {
  tobeRemovedOption: cloner(),
  tobeRetrievedOption: [],
}


const filterIDforPersonalTransactions = (value) => {//keeps userID for personal TXs
  if (String(value.sender._id) === sessionData.userId || String(value.receiver._id) === sessionData.userId) {
    return value;
  }
}
const filterIDfromMembers = (value) => { //removes userID from members
  if (String(value._id) !== sessionData.userId) {
    return value;
  }
}

  // const showAll = () => {
  //   console.log(transactionHistory.length)
  //   setSize(transactionHistory.length)
  // }
  
const membersComponent=()=>{
  return(
    <Container className="members-container">
    <div className='members-header'>
      <span className='members-header-text'>Members</span>
      <span className='transaction-history-header-total'>Balance</span>
    </div>
    {members.map(
      (member, index) => (
        <button className="transaction-button pending" key={index}>
          <div className='image'>
            <i className="user icon el"></i>
          </div>
          <span className="text-item-content">
            {member.nickname !== null ?
              <span className='item-content'>
                <strong>{member.nickname}</strong>
              </span> :
              <span className='item-content'>
                <strong>No Members</strong>
              </span>
            }
          </span>
        </button>
      )
    )}
  </Container>
  )
}

const transactHistory = () => {
    return (
      <Container className="transaction-history-container">
        <div className='transaction-history-header'>
          <span className='transaction-history-header-text'>Transaction History</span>
          <span className='transaction-history-header-total'>Amount</span>
        </div>
        {transactionHistory.slice(0, size)?.map(
          (transaction, index) => (
            <button className="transaction-button pending" key={index}>
              <div className='image'>
                <i className={transaction.receiver === null ? `las la-coins el` : `long arrow alternate right icon el`}></i>
              </div>
              <span className="text-item-content">
                {transaction.receiver !== null ?
                  <span className='item-content'>
                    <strong>{transaction.sender.nickname}</strong>&nbsp;to&nbsp;<strong>{transaction.receiver.nickname}</strong>
                  </span> :
                  <span className='item-content'>
                    <strong>{transaction.sender.nickname}</strong>
                  </span>
                }
              </span>
              <span className='amount'>
                {transaction.amount} $
              </span>
            </button>
          )
        )}
        <div className='showall'>show all</div>
      </Container>
    )
  }

const personalPendingTransactions = () => {
return (
  <Container className="pending-transactions-container">
    <div className='widget-subheader'>
      {personalTransactions.length ?
        <span className="transactions-header">
          Pending Transactions
        </span> : <span className="transactions-header">
          No Pending Transactions
        </span>}
    </div>
    <div className='transaction-block'>
      {personalTransactions?.map((transaction, index) => (
        <button className="transaction-button" key={index}>
          <div className='image'>
            <i className={transaction.sender._id === sessionData.userId ? `arrow right icon el` : `arrow left icon el`}></i>
          </div>
          <span className='item-content'>
            <span className="text-item-content">
              {transaction.sender._id === sessionData.userId ?
                <span>To <strong>{transaction.receiver.nickname}</strong>
                </span> :
                <span>From <strong>{transaction.sender.nickname}</strong>
                </span>}
            </span>
          </span>
          <span className='amount'>
                {transaction.amount} $
              </span>
        </button>))}
    </div>
  </Container>
  )
  }

const allPendingTransactions = () => {
    return (
      <Container className="pending-transactions-container">
        <div className='widget-subheader'>
          {allTransactions.length ?
            <span className="transactions-header">
              Pending Transactions
            </span> : <span className="transactions-header">
              No Pending Transactions
            </span>}
        </div>
        <div className='transaction-block'>
          {allTransactions?.map((transaction, index) => (
            <button className="transaction-button" key={index}>
              <div className='image'>
                <i className="arrow right icon el"></i>
              </div>
              <span className='item-content'>
                <span className="text-item-content">
                  <span>
                    <strong>{transaction.sender._id === sessionData.userId ? "You" : transaction.sender.nickname}</strong>&nbsp;to&nbsp;<strong>{transaction.receiver._id === sessionData.userId ? "You" : transaction.receiver.nickname}</strong>
                  </span>
                </span>
              </span>
              <span className='amount'>
                {transaction.amount} $
              </span>
            </button>))}
        </div>
      </Container>
    )
  }

const handleAllPersonalClick = (boolean) => {
    localStorage.setItem("showAll", boolean)
    setShowAll(boolean);
  }

const handleHistoryOrFriendsClick = (boolean) => {
    localStorage.setItem("showMembers", boolean)
    setShowMembers(boolean);
  }

const addExpense = async () => {
  try {
    const res = await api.post(`/expense/addtransaction`,
      {
        groupId: groupID, //does it feed at first render? Need to check 
        sender: sessionData.userId,
        receiver:null,
        amount: inputAmount,
        description: inputDescription
      }
    )
    setInputAmount('')
    setInputDescription('')
    console.log(res)
  }
  catch(error) {
    console.log(error)
  }

}

const recordTx = async ()=>{
  //console.log("ID",utilities.tobeRetrievedOption[0]._id)

  if (keepID == null) return null; //do not proceed to recording tx if no user has been selected
  if (txAmount==null) return null; //do not proceed to recording tx if no amount has been given
  if (txDescription==null) return null; //do not proceed to recording tx if no description has been given
  try {
    const res = await api.post(`/expense/addtransaction`,
      {
        groupId: groupID, //does it feed at first render? Need to check 
        sender: sessionData.userId,
        receiver:keepID[0], //utilities.tobeRetrievedOption[0]._id, //can't record multiple txs at the moment. (will need a map)
        amount: txAmount,
        description: txDescription
      }
    )
    setTxAmount('')
    setTxDescription('')
    console.log(res)
  }
  catch(error) {
    console.log(error)
  }
}

return (
<div className="main-page">
  <div className='box1'>
    <div className='homewidget'>
      <div className='widget-header'>

        <div className='group-selection-button'>
          <button type="button" className="selection-button group-name-button " onClick={() => setShow(true)}>
            <span className="group-title">
              <strong>{groupName}</strong>
            </span>
            <span className="button-position">
              <div className="button-layout">
                <i className='angle down icon'>  </i>
              </div>
            </span>
          </button>
          <button className='option-button' onClick={() => setShowCreate(true)}>
            <i className='group icon y'></i></button>
          <button className='option-button granazi' >
            <i className='cog icon'></i>
          </button>
          {/* {showSelect && <Select headline="Groups" rightHeadline="total" optionsArray={groupInfo} mapOn={mapOn} setOption={setOptionAndClose} close={toggleSelect} />} */}
          <ModalFrame
            onClose={() => setShow(false)}
            content={SelectGroup({ refreshGroupList, activeIndex, setActiveIndex, setShow })}
            show={show}
            header="Groups" />
        </div>
        <div className='option-buttons'>
          <button className='option-button' onClick={() => setShowExp(true)}>
            <i className='add icon y'></i>
            <strong>Add expense</strong>
          </button>
          <button className='option-button' onClick={() => setShowTransact(true)}>
            <i className='exchange icon y '></i>
            <strong> Transact </strong>
          </button>
        </div>
      </div>
      {showExp &&
        <Form headline="Add Expense" submit={addExpense} close={() => setShowExp(false)} >
          <Form.InputField
            value={inputAmount}
            label="Amount"
            maxLength={20}
            required={true}
            onChange={e => setInputAmount(e.target.value)}
            clear={e => setInputAmount('')} //this is for the X button? How does the automatic clearing works on submit?
          />
          <Form.InputField
            value={inputDescription}
            label="Description"
            maxLength={100}
            required={false}
            onChange={e => setInputDescription( e.target.value)}
            clear={e => setInputDescription('')}
          />
        </Form>
      }
      {
        showtransact &&
        <Form headline="Record tx" submit={recordTx} close={() => setShowTransact(false)} >
          <Form.InputField
            value={txAmount}
            label="Amount"
            maxLength={20}
            required={true}
            onChange={e => setTxAmount(e.target.value)}
            clear={e => setTxAmount('')}
          />
          <Form.InputField
            value={txDescription}
            label="Description"
            maxLength={100}
            required={true}
            onChange={e => setTxDescription( e.target.value)}
            clear={e => setTxDescription('')}
          />   
        <Form.MultiSelect
          setKeepID={setKeepID}
          value={keepID}
          optionsArray={members}
          label="label"
          allowMultiSelections={true}/>
      </Form>
      }

    </div>
    <div className='pending-transactions'>
      <div className="all-personal-options">
        <button className={showAll ? "all-active" : "all-inactive"} onClick={() => handleAllPersonalClick(true)}><strong>All</strong></button>
        <button className={showAll ? "personal-inactive" : "personal-active"} onClick={() => handleAllPersonalClick(false)}><strong>Personal</strong></button>
      </div>
      {showAll ? allPendingTransactions() : personalPendingTransactions()}
    </div>
    <div className='transaction-history'>
      <div className="history-friends-options">
        <button className={showMembers ? "history-inactive" : "history-active"} onClick={() => handleHistoryOrFriendsClick(false)}><strong>History</strong></button>
        <button className={showMembers ? "members-active" : "members-inactive"} onClick={() => handleHistoryOrFriendsClick(true)}><strong>Members</strong></button>
      </div>
      {showMembers ? membersComponent() : transactHistory()}
    </div>
    <LeaveGroupModal
      showLeaveGroup={showLeaveGroup}
      onCloseLeaveGroup={() => setShowLeaveGroup(false)}
      userInfoID={userInfo._id}
      groupID={groupID}
      groupName={groupName}
      setGroupName={setGroupName}
      setGroupInfo={setGroupInfo}
    />
    <CreateGroupModal
      showCreate={showCreate}
      setShowCreate={setShowCreate}
      utilities={utilities}
      setRefresh={setRefresh}
    />
  </div>

  <div className="box2">
    box2

  </div>
  <div className="box3">
    box3
  </div>
  <div className="box4">
    box4
  </div>
  <div className="box5">
    box5
  </div>
</div>

  )
}

export default MainPage;