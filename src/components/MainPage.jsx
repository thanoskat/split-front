import '../style/MainPage.css'
import '../style/summary.css'
import useAxios from '../utility/useAxios'
import { ModalFrame, LeaveGroupModal, AddExpenseModal, CreateGroupModal } from '.'
import { useState, useEffect, useContext, useDebugValue } from "react";
import { useLocation } from "react-router-dom";
import { AuthenticationContext } from '../contexts/AuthenticationContext'


function MainPage() {

  const [show, setShow] = useState(false);
  const [showLeaveGroup, setShowLeaveGroup] = useState(false);
  const [showExp, setShowExp] = useState(false);
  const [showCreate, setShowCreate] = useState(false);
  const [groupName, setGroupName] = useState("");
  const [groupInfo, setGroupInfo] = useState([]);
  const [groupID, setGroupID] = useState("");
  const [userInfo, setUserInfo] = useState({});
  const [activeIndex, setActiveIndex] = useState(0);
  const [Users, setUsers] = useState([]);
  const { sessionData } = useContext(AuthenticationContext)
  const [refreshGroupList, setRefresh] = useState(false);
  const [refreshExpense, setRefreshExpense] = useState(false);
  const [transactions, setTransactions]=useState()

  const api = useAxios()
  const location = useLocation()


  //https://javascript.info/object-copy
  //https://stackoverflow.com/questions/45373742/detect-route-change-with-react-router

  useEffect(async () => {

    try {
      const response = await api.get('/getusers/profile');
      const users = await api.get('/getusers')
      const pathIndex = parseInt(location.search.substring(location.search.indexOf("?") + 1))
      // console.log("pathIndex", pathIndex)
      // console.log("activeIndex", activeIndex)
      //console.log(response.data.groups[0]._id)
      setUsers(users.data);
      //setGroupInfo(response.data.groups);
      setUserInfo(response.data);

      if (isNaN(pathIndex)) {
        setGroupName(response.data.groups[0].title)//this is to show the first group in the screen on first render instead of empty.
        setGroupID(response.data.groups[0]._id);//this is to fill the first groupID with the default first option when nothing else has been chosen

      } else {
        setGroupName(response.data.groups[pathIndex].title) //by keeping track of the path Index variable we can preserve a group after a refresh of the page
        setActiveIndex(pathIndex) //highlight selected option
      }

      // console.log('handle route change here', location)
    } catch (err) {
      console.dir(err);
    }

  }, [location])

  //this useEffect updates the list of groups when a new group is created.
  useEffect(async () => {
    try {
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

  useEffect(() => {
    transactionCalc()
  }, [location])

  //{debtor: '619fbbb7f62bf0d97607bee3', owned: '619a5327949ad8e993b0531e', amount: 65}
  // const isDebtorOrOwned=(value)=>{
  //   if (value.debtor===sessionData.userId || value.owned===sessionData.userId ){
  //     return value;
  //   } 
  // }

  const transactionCalc = async () => {
    if (!groupID) { //if no groupID just get the first one on the list. This will usually be the case on the first render. After change this will be filled (see row 136 in Modal) and we can use from state itseldf
      const response = await api.get('/getusers/profile');
      const temporaryID = (response.data.groups[0]._id)
      try {
        const transactions = await api.get(`/expense/getgroupexpenses/${temporaryID}`) //gets don't have body so need to send data like this
        console.log(transactions)
        // setTransactions(filteredTransaction)
      } catch (err) {
        console.dir("transaction calc error", err)
      }
    } else {
      try {
        const transactions = await api.get(`/expense/getgroupexpenses/${groupID}`)
        console.log(transactions)
       
      } catch (err) {
        console.dir("transaction calc error", err)
      }
    }

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
                  {groupName}
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
                groupInfo={groupInfo}
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
            <button className="transaction-button">
              <div className='image'>
                <div className="image-background">
                </div>
              </div>
              <span className='item-content'>
                <span className="text-item-content">
                  To Kristi
                </span>
              </span>
              <span className='amount'>
                10$
              </span>
            </button>
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