import '../style/MainPage.css'
import '../style/summary.css'
import useAxios from '../utility/useAxios'
import { ModalFrame, LeaveGroupModal, AddExpenseModal, CreateGroupModal } from '.'
import { useState, useEffect, useContext} from "react";
import { useLocation,useHistory } from "react-router-dom";
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
      if (isNaN(pathIndex)) {
        const pulledtransactions = await api.get(`/expense/getgroupexpenses/${response.data.groups[0]._id}`) //gets don't have body so need to send data like this
        setTransactions(pulledtransactions.data)
        history.push(`/main/${response.data.groups[activeIndex]._id}?${activeIndex}`)//reroutes to the first group on first render and then keeps track of the active index from global context
      } else {
        setGroupName(response.data.groups[pathIndex].title) //by keeping track of the path Index variable we can preserve a group after a refresh of the page
        const pulledtransactions = await api.get(`/expense/getgroupexpenses/${response.data.groups[pathIndex]._id}`)
        setTransactions(pulledtransactions.data)
      }
    } catch (err) {
      console.dir(err);
    }

  }, [location])


  //this useEffect updates the list of groups when a new group is created.
  useEffect(async () => {
    try {
      //This is specific to the Users schema when 
      //feeding info for groupname and total
      //although they are sourced from
      //the group Schema with populate.
      const response = await api.get('/getusers/profile');
      setGroupInfo(response.data.groups)
    } catch (err) {
      console.dir("group info error", err);
    }

  }, [refreshGroupList])

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
                show={show}
                setGroupName={setGroupName}
                list={groupInfo}
                setGroupID={setGroupID}
                activeIndex={activeIndex}
                setActiveIndex={setActiveIndex}
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
                    <i className={transaction.debtorID === sessionData.userId ? `arrow right icon l` : `arrow left icon l`}></i>
                  </div>
                </div>
                <span className='item-content'>
                  <span className="text-item-content">
                    {transaction.debtorID === sessionData.userId ? `To ${transaction.ownedName}` : `from ${transaction.debtorName}`}
                  </span>
                </span>
                <span className='amount'>
                  {Math.round(transaction.amount * 100) / 100} $
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