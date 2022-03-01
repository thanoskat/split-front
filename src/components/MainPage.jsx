import '../style/MainPage.css'
import '../style/summary.css'
import useAxios from '../utility/useAxios'
import { ModalFrame, LeaveGroupModal, AddExpenseModal, CreateGroupModal,Button,SelectGroup } from '.'
import { useState, useEffect, useContext } from "react";
import { useLocation, useHistory, Link } from "react-router-dom";
import { AuthenticationContext } from '../contexts/AuthenticationContext'
import { GlobalStateContext } from '../contexts/GlobalStateContext'


function MainPage() {

  const [show, setShow] = useState(false);
  const [showLeaveGroup, setShowLeaveGroup] = useState(false);
  const [showExp, setShowExp] = useState(false);
  const [showCreate, setShowCreate] = useState(false);
  const [groupName, setGroupName] = useState("");
  const [groupInfo, setGroupInfo] = useState([]);
  const [groupID, setGroupID] = useState("");
  const [userInfo, setUserInfo] = useState({});
  // const [activeIndex, setActiveIndex] = useState(0);
  const [Users, setUsers] = useState([]);
  const { sessionData } = useContext(AuthenticationContext)
  const [refreshGroupList, setRefresh] = useState(false);
  const [refreshExpense, setRefreshExpense] = useState(false);
  const [transactions, setTransactions] = useState()
  const { activeIndex, setActiveIndex } = useContext(GlobalStateContext)

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
      // console.log("pathIndex,activeIndex", pathIndex, activeIndex)
      // console.log("history", history)

      if (isNaN(pathIndex)) {//will get in here when there is no link on top
        const pulledtransactions = await api.get(`/groups/${response.data.groups[0]._id}`) //gets don't have body so need to send data like this
        //console.log(await api.get(`/expense/getgroupexpenses/${response.data.groups[0]._id}`))
        console.log(pulledtransactions.data.pendingTransactions.filter(filterID))
        setTransactions(pulledtransactions.data.pendingTransactions.filter(filterID))
        history.push(`/main/${response.data.groups[activeIndex]._id}?${activeIndex}`)//reroutes to the first group on first render and then keeps track of the active index from global context
      } else {//it will get in here when there is a link to look at (hence pathIndex is not null)
        setGroupID(response.data.groups[pathIndex]._id)
        setGroupName(response.data.groups[pathIndex].title) //by keeping track of the path Index variable we can preserve a group after a refresh of the page
        setActiveIndex(pathIndex)//set active index in order to preserve highlighted option
        const pulledtransactions = await api.get(`/groups/${response.data.groups[pathIndex]._id}`)
       // console.log(await api.get(`/expense/getgroupexpenses/${response.data.groups[pathIndex]._id}`))
       console.log(pulledtransactions.data.pendingTransactions.filter(filterID))
        setTransactions(pulledtransactions.data.pendingTransactions.filter(filterID))
      }
    } catch (err) {
      console.dir(err);
    }

  }, [location])//This useEffect might be running twice (once at first render, then again because of changes in location)

  const cloner = () => {
    let clone = []
    for (let i = 0; i < Users.length; i++) {
      if (Users[i]._id === sessionData.userId) { continue } //do not feed own ID in users to be added to group
      clone.push(Object.assign({}, Users[i]))
    }
    return clone;
  }

  const utilities = {
    tobeRemovedOption: cloner(),
    tobeRetrievedOption: [],
  }

  const filterID = (value) => {
    if (String(value.sender._id) === sessionData.userId || String(value.receiver._id) === sessionData.userId) {
      return value;
    }
  }

 const newContent=()=>{
   return(
     <div>
       <Button>Hello world</Button>
       <Button>Hi bish</Button>
     </div>
   )
 }

  return (
    <div className="main-page">
      <div className='box1'>
        box1
        <div className='homewidget'>
          home widget
          <div className='widget-header'>
            <div className='group-selection-button'>
              <button type="button" className="selection-button group-name-button " onClick={() => setShow(true)}>
                <span className="group-title">
                  <strong>{groupName}</strong>
                </span>
                <span className="button-position">
                  <div className="button-layout">
                    <i className='sort down icon'>  </i>
                  </div>
                </span>
              </button>
              <ModalFrame
                onClose={() => setShow(false)}
                content={SelectGroup({refreshGroupList,activeIndex,setActiveIndex,setShow})}
                show={show}
                header="8eios"
              />
            </div>
            <div className='option-buttons'>
              <button className='option-button' onClick={() => setShowExp(true)}>
                <i className='money icon y'></i>
                Add expense
              </button>
              <button className='option-button' onClick={() => setShowLeaveGroup(true)}>
                <i className='user times icon y '></i>
                Leave group
              </button>

              <button className='option-button' onClick={() => setShowCreate(true)}>
                <i className="group icon y"></i>
                Create New Group
              </button>
            </div>
          </div>
          <div className='widget-subheader'>
            <span className="transactions-header">
              Transactions
            </span>
          </div>
          <div className='transaction-block'>
            {transactions?.map((transaction, index) => (
              <button className="transaction-button" key={index}>
                <div className='image'>
                  <div className="image-background">
                    <i className={transaction.sender._id === sessionData.userId ? `arrow right icon l` : `arrow left icon l`}></i>
                  </div>
                </div>
                <span className='item-content'>
                  <span className="text-item-content">
                    {transaction.sender._id === sessionData.userId ? `To ${transaction.receiver.nickname}` : `from ${transaction.sender.nickname}`}
                  </span>
                </span>
                <span className='amount'>
                  {transaction.amount} $
                </span>
              </button>))}
          </div>
          <AddExpenseModal
            showExp={showExp}
            onCloseExp={() => setShowExp(false)}
            userInfoID={userInfo._id}
            activeIndex={activeIndex}
            setRefreshExpense={setRefreshExpense}
          />
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