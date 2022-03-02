import '../style/MainPage.css'
import '../style/summary.css'
import useAxios from '../utility/useAxios'
import { ModalFrame, LeaveGroupModal, AddExpenseModal, CreateGroupModal, Button, SelectGroup, Container } from '.'
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
  const [pendingtransactions, setPendingTransactions] = useState();
  const [transactionHistory, setTransactionHistory] = useState();
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
      if (isNaN(pathIndex)) {//will get in here when there is no link on top
        const pulledtransactions = await api.get(`/groups/${response.data.groups[0]._id}`) //gets don't have body so need to send data like this
        console.log("pending txs", pulledtransactions.data.pendingTransactions.filter(filterID))
        setPendingTransactions(pulledtransactions.data.pendingTransactions.filter(filterID))
        setTransactionHistory(pulledtransactions.data.transactions)
        history.push(`/main/${response.data.groups[activeIndex]._id}?${activeIndex}`)//reroutes to the first group on first render and then keeps track of the active index from global context
      } else {//it will get in here when there is a link to look at (hence pathIndex is not null)
        setGroupID(response.data.groups[pathIndex]._id)
        setGroupName(response.data.groups[pathIndex].title) //by keeping track of the path Index variable we can preserve a group after a refresh of the page
        setActiveIndex(pathIndex)//set active index in order to preserve highlighted option
        const pulledtransactions = await api.get(`/groups/${response.data.groups[pathIndex]._id}`)
        console.log("pending txs", pulledtransactions.data.pendingTransactions.filter(filterID))
        setPendingTransactions(pulledtransactions.data.pendingTransactions.filter(filterID))
        setTransactionHistory(pulledtransactions.data.transactions)

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

  const transactHistory = () => {
    return (
      transactionHistory?.map(
        (transaction, index) => (
          <button className="transaction-button pending" key={index}>
            <div className='image'>
              <div className="image-background">
                <i className={transaction.receiver === null ? `file alternate outline icon l` : `paper plane outline icon l`}></i>
              </div>
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
      )
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
                content={SelectGroup({ refreshGroupList, activeIndex, setActiveIndex, setShow })}
                show={show}
                header="8eios"
              />
            </div>
            <div className='option-buttons'>
              <button className='option-button' onClick={() => setShowExp(true)}>
                <i className='money icon y'></i>
                <strong>Add expense</strong>
              </button>
              <button className='option-button' onClick={() => setShowLeaveGroup(true)}>
                <i className='user times icon y '></i>
                <strong> Leave group</strong>
              </button>

              <button className='option-button' onClick={() => setShowCreate(true)}>
                <i className="group icon y"></i>
                <strong>Create New Group</strong>
              </button>
            </div>
          </div>
          <div className='widget-subheader'>
            {pendingtransactions.length?
              <span className="transactions-header">
                Pending Transactions
              </span> : <span>
                No Pending Transactions
              </span>}

          </div>
          <div className='transaction-block'>
            {pendingtransactions?.map((transaction, index) => (
              <button className="transaction-button" key={index}>
                <div className='image'>
                  <div className="image-background">
                    <i className={transaction.sender._id === sessionData.userId ? `arrow right icon l` : `arrow left icon l`}></i>
                  </div>
                </div>
                <span className='item-content'>
                  <span className="text-item-content">
                    {transaction.sender._id === sessionData.userId ?
                      <span>To <strong>{transaction.receiver.nickname}</strong>
                      </span> :
                      <span>From <strong>{transaction.receiver.nickname}</strong>
                      </span>}
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

        <div className='transaction-history'>
          <Container className="transaction-history-container">{transactHistory()}</Container>
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