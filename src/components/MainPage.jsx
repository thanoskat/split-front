import '../style/MainPage.css'
import '../style/summary.css'
import useAxios from '../utility/useAxios'
import { ModalFrame, LeaveGroupModal, CreateGroupModal, Container, Form, SelectBox, SelectGroup } from '.'
import { useState, useEffect, useContext, useRef } from "react";
import { useLocation, useHistory, Link } from "react-router-dom";
// import { AuthenticationContext } from '../contexts/AuthenticationContext'
import { GlobalStateContext } from '../contexts/GlobalStateContext'
import store from '../redux/store'

function MainPage() {

  const [show, setShow] = useState(false);
  const [showLeaveGroup, setShowLeaveGroup] = useState(false);
  const [showExp, setShowExp] = useState(false);
  const [showtransact, setShowTransact] = useState(false)
  const [showCreate, setShowCreate] = useState(false);
  const [groupName, setGroupName] = useState("");
  const [groupInfo, setGroupInfo] = useState([]);
  const [groupID, setGroupID] = useState("");
  const [userInfo, setUserInfo] = useState({});
  // const [activeIndex, setActiveIndex] = useState(0);
  const [Users, setUsers] = useState([]);
  // const { sessionData } = useContext(AuthenticationContext)
  const sessionData = store.getState().authReducer.sessionData
  const [refreshGroupList, setRefresh] = useState(false);
  const [size, setSize] = useState(200);
  const [personalTransactions, setPersonalTransactions] = useState([]);
  const [allTransactions, setAllTransactions] = useState([]);
  const [showAll, setShowAll] = useState(localStorage.getItem("showAll") == "true");

  const [showMembers, setShowMembers] = useState(localStorage.getItem("showMembers") == "true");
  const [transactionHistory, setTransactionHistory] = useState([]);
  const { activeIndex, setActiveIndex } = useContext(GlobalStateContext)
 
  const [txAmount, setTxAmount] = useState("")
  
  const [txDescription, setTxDescription] = useState("")
  
  const [trackIndexAndIDsingle, setTrackIndexAndIDsingle] = useState([])
  const [showSelectGroups, setShowSelectGroups] = useState(false)
  const [groupTags, setGroupTags] = useState([])
  
  const [tagText, setTagText] = useState("");
  const [members, setMembers] = useState([])
  const [splitAmongMembersCheck, setSplitAmongMembersCheck] = useState(true)

  //console.log(trackIndexAndIDmulti)
  //console.log(members.map((option,index)=>({ _id: option._id, index: index })))

  const tagTextRef = useRef(tagText)
  const newtagRef = useRef(null)

  const api = useAxios()
  const location = useLocation()
  const history = useHistory()


  // const tickAllmembers = (members) => {
  //   if(!splitAmongMembersCheck) return
  //   setTrackIndexAndIDmulti(() => [members.map((option,index)=>({ _id: option._id, index: index })) ])
  //  }



  //https://javascript.info/object-copy
  //https://stackoverflow.com/questions/45373742/detect-route-change-with-react-router

  useEffect(() => {

    fetchData()

  }, [location, splitAmongMembersCheck])

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

  //some returns true if the condition is satisfied at least once.
  //if the id we're interested in is found at least once in the second array it returns true (found).
  //this id is not what we need though so it is filtered out.
  //hence we only keep objects with ids that only exist in one array and not the other.
  //run twice in case first array has less objects than second
  //example: first array only has one object. This will be filtered out (as filter is applied on first array only) leaving an empty filtered array
  //https://bobbyhadz.com/blog/javascript-get-difference-between-two-arrays-of-objects
  function getDifference(array1, array2) {
    return array1.filter(object1 => { //(filter keeps whatever the function inside it tell it to keep)
      return !array2.some(object2 => {
        return object1._id === object2._id;
      });
    });
  }

  const fetchData = async () => {

    try {
      const profile = await api.get('/getusers/profile');
      const pathIndex = parseInt(location.search.substring(location.search.indexOf("?") + 1))
      setGroupInfo(profile.data.groups);
      //When a tag is created, fetchData runs again updating the groupTags, feeding them into the available options for the user.
      //the line below solves the problem where a user has already chosen a tag and decides to create a new one. By filtering the tag
      //that has already been chosen (the one in the "downTags array") we prohibit it from appearing in the available options (so avoid showing it twice)
      //const difference = [...getDifference(profile.data.groups[activeIndex].groupTags, expenseTags), ...getDifference(expenseTags, profile.data.groups[activeIndex].groupTags)]
     // setGroupTags(difference)

      if (isNaN(pathIndex)) {//will get in here when there is no link on top
        //const pulledtransactions = await api.get(`/groups/${response.data.groups[0]._id}`) //gets don't have body so need to send data like this
        if (activeIndex == 0) {
          setGroupID(profile.data.groups[0]._id)
          setGroupName(profile.data.groups[0].title) //by keeping track of the path Index variable we can preserve a group after a refresh of the page
          setActiveIndex(0)
          const txhistory = [...profile.data.groups[0].expenses, ...profile.data.groups[0].transfers]
          setPersonalTransactions(profile.data.groups[0].pendingTransactions.filter(filterIDforPersonalTransactions))
          setAllTransactions(profile.data.groups[0].pendingTransactions);
          setTransactionHistory(txhistory)
          //console.log(txhistory.map(x=>x.receiver==undefined))
          setMembers(profile.data.groups[0].members.filter(filterIDfromMembers))

         // if (splitAmongMembersCheck) { setTrackIndexAndIDmulti(profile.data.groups[0].members.filter(filterIDfromMembers).map((option, index) => ({ _id: option._id, index: index }))) }

          //console.log(pulledtransactions.data.members)
        } else {
          history.push(`/main/${profile.data.groups[activeIndex]._id}?${activeIndex}`)//reroutes to the first group on first render and then keeps track of the active index from global context
        }

      } else {//it will get in here when there is a link to look at (hence pathIndex is not null)
        setGroupID(profile.data.groups[pathIndex]._id)
        setGroupName(profile.data.groups[pathIndex].title) //by keeping track of the path Index variable we can preserve a group after a refresh of the page
        setActiveIndex(pathIndex)//set active index in order to preserve highlighted option
        //const pulledtransactions = await api.get(`/groups/${response.data.groups[pathIndex]._id}`)
        const txhistory = [...profile.data.groups[pathIndex].expenses, ...profile.data.groups[pathIndex].transfers]
        setPersonalTransactions(profile.data.groups[pathIndex].pendingTransactions.filter(filterIDforPersonalTransactions))
        setAllTransactions(profile.data.groups[pathIndex].pendingTransactions);
        setTransactionHistory(txhistory);
        setMembers(profile.data.groups[pathIndex].members.filter(filterIDfromMembers));
        //if (splitAmongMembersCheck) { setTrackIndexAndIDmulti(profile.data.groups[0].members.filter(filterIDfromMembers).map((option, index) => ({ _id: option._id, index: index }))) }
      }
      // window.addEventListener("keydown", (e) => handleKeyDown(e, profile.data.groups[activeIndex].groupTags));
    } catch (err) {
      console.dir(err);
    }
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
  const colors = [
    "var(--yellow)",
    "var(--pink)",
    "var(--purple)",
    "var(--orange)",
    "var(--green)",
    "var(--lightblue)",
    "var(--lightorange)",
    "var(--color1)",
    "var(--color2)",
    "var(--color3)"]


  const membersComponent = () => {
    return (
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
                <i className={transaction.receiver === undefined ? `las la-coins el` : `long arrow alternate right icon el`}></i>
              </div>
              <span className="text-item-content">
                {transaction.receiver !== undefined ?
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

 


  const recordTx = async () => {
    //console.log("ID",utilities.tobeRetrievedOption[0]._id)
    if (trackIndexAndIDsingle[0] == null) return null; //do not proceed to recording tx if no user has been selected
    if (txAmount == null) return null; //do not proceed to recording tx if no amount has been given
    if (txDescription == null) return null; //do not proceed to recording tx if no description has been given
    try {
      const res = await api.post(`/expense/addtransfer`,
        {
          groupId: groupID, //does it feed at first render? Need to check
          sender: sessionData.userId,
          receiver: trackIndexAndIDsingle[0]._id,
          amount: txAmount,
          description: txDescription
        }
      )
      setTxAmount('')
      setTxDescription('')
      console.log(res)
    }
    catch (error) {
      console.log(error)
    }
  }

  const handleSelectGroups = (index) => {
    setActiveIndex(index);
  }
  //////////////////////////////////////////////////////////////
  //Tags handlers START ///////////////////////////////////////
  ////////////////////////////////////////////////////////////

  
  //////////////////////////////////////////////////////////////
  //Tags handlers END /////////////////////////////////////////
  /////////////////////////////////////////////////////////////

  return (
    <div className="main-page">
      <div className='box1'>
        <div className='homewidget'>
          <div className='widget-header'>

            <div className='group-selection-button'>
              <button type="button" className="selection-button group-name-button " onClick={() => setShowSelectGroups(true)}>
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
              {showSelectGroups &&
                <SelectBox headline="Groups" rightHeadline={"total"} close={() => setShowSelectGroups(false)}>
                  {groupInfo.map((group, index) => (
                    <Link key={index} className='aTag' to={`/main/${group._id}?${index}`}>
                      <SelectBox.GroupButton
                        key={group._id}
                        text={group.title}
                        rightText={group.totalSpent}
                        index={index}
                        activeIndex={activeIndex}
                        // iconColor={item.iconColor}
                        onClick={() => handleSelectGroups(index)}>
                      </SelectBox.GroupButton>
                    </Link>
                  ))}
                </SelectBox>}
              {/* <ModalFrame
            onClose={() => setShow(false)}
            content={SelectGroup({ refreshGroupList, activeIndex, setActiveIndex, setShow })}
            show={show}
            header="Groups" /> */}
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
          {/* {showExp &&
            <Form headline="Add Expense" close={() => setShowExp(false)} >
              <Form.InputField
                value={inputAmount}
                allowTags={false}
                placeholder={"Amount"}
                // maxLength={20}
                // required={true}
                onChange={e => setInputAmount(e.target.value)}
                clear={e => setInputAmount('')} //this is for the X button? How does the automatic clearing works on submit?
              />

              <Form.MembersTags
                optionsArray={members} />

              <Form.InputField
                value={inputDescription}
                allowTags={true}
                setExpenseTags={setExpenseTags}
                setGroupTags={setGroupTags}
                expenseTags={expenseTags}
                placeholder={"Description"}
                // maxLength={100}
                // required={false}
                onChange={e => setInputDescription(e.target.value)}
                clear={e => setInputDescription('')}
              />


              <Form.MultiSelect
                setTrackIndexAndID={setTrackIndexAndIDmulti}
                value={trackIndexAndIDmulti}
                optionsArray={members}
                label="split expense between you and all members"
                splitAmongMembersCheck={splitAmongMembersCheck}
                setSplitAmongMembersCheck={setSplitAmongMembersCheck}
                allowMultiSelections={true} />



              <Form.ExpenseTags
                groupTags={groupTags}
                setGroupTags={setGroupTags}
                expenseTags={expenseTags}
                setExpenseTags={setExpenseTags}
                tagText={tagText}
                setTagText={setTagText}
                maxLength={12}
                onChange={onChangeTagName}
                handleKeyDown={handleKeyDown}
                handleBlur={handleBlur}
                handleGroupTagsDelete={handleGroupTagsDelete}
                newtagRef={newtagRef}
                colors={colors}
              />

            </Form>
          } */}
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
                onChange={e => setTxDescription(e.target.value)}
                clear={e => setTxDescription('')}
              />
              <Form.MultiSelect
                setTrackIndexAndID={setTrackIndexAndIDsingle}
                value={trackIndexAndIDsingle}
                optionsArray={members}
                label="label"
                allowMultiSelections={false} />
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
          userInfoID={sessionData.userId}
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