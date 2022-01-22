import '../style/MainPage.css'
import '../style/summary.css'
import useAxios from '../utility/useAxios'
import { ModalFrame, LeaveGroupModal, AddExpenseModal, CreateGroupModal } from '.'
import { useState, useEffect, useContext } from "react";
import { useHistory, useLocation } from "react-router-dom";
import { AuthenticationContext } from '../contexts/AuthenticationContext'


function MainPage() {

 
  const [show, setShow] = useState(false);
  const [showLeaveGroup, setShowLeaveGroup] = useState(false);
  const [showExp, setShowExp] = useState(false);
  const [showCreate, setShowCreate] = useState(false);
  const [groupName, setGroupName] = useState("");
  const [groupInfo, setGroupInfo] = useState([]);
  const [groupID, setGroupID] = useState("");
  const [userInfo, setUserInfo] = useState({});//not being used atm
  // const [refreshIndex, setRefreshIndex] = useState(0);
  const [activeIndex, setActiveIndex] = useState(null);
  const [Users, setUsers] = useState([]);
  const { sessionData } = useContext(AuthenticationContext)



  const api = useAxios()
  const history = useHistory();
  const location = useLocation()

  //https://javascript.info/object-copy
  //https://stackoverflow.com/questions/45373742/detect-route-change-with-react-router

  useEffect(async () => {

    try {
      const response = await api.get('/getusers/profile');
      const users = await api.get('/getusers')
      const pathIndex=parseInt(location.search.substring(location.search.indexOf("?") + 1))
      //console.log(response.data.groups[0].title)
      setUsers(users.data);
      setGroupInfo(response.data.groups);
      setUserInfo(response.data);
      if(isNaN(pathIndex)){
        setGroupName(response.data.groups[0].title)//this is to show the first group in the screen on first render instead of empty.
      }else{
        setGroupName(response.data.groups[pathIndex].title) //by keeping track of the path Index variable we can preserve a group after a refresh of the page
      }
      setActiveIndex(pathIndex)
      // console.log('handle route change here', location)
     console.log("pathIndex",parseInt(location.search.substring(location.search.indexOf("?") + 1)))
    } catch (err) {
      console.dir(err);
    }

  }, [location])

 
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

  //this function fetches data about the user from back-end
  

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