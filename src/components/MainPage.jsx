import '../style/MainPage.css'
import '../style/summary.css'
import useAxios from '../utility/useAxios'
import { ModalFrame, LeaveGroupModal, AddExpenseModal, CreateGroupModal } from '.'
import { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";



function MainPage() {

  const [show, setShow] = useState(false);
  const [showLeaveGroup, setShowLeaveGroup] = useState(false);
  const [showExp, setShowExp] = useState(false);
  const [showCreate, setShowCreate] = useState(false);
  const [groupName, setGroupName] = useState("");
  const [groupInfo, setGroupInfo] = useState([]);
  const [groupID, setGroupID] = useState("");
  const [userInfo, setUserInfo] = useState({});//not being used atm
  const [refreshIndex, setRefreshIndex] = useState(0);
  const [Users, setUsers] = useState([]);

  const api = useAxios()
  const history = useHistory();
  // const uniq = []
  // const utility = {
  //     uniq: () => {
  //         const uniq = Array.from(new Set(groupTable)) //loops through an array and deletes duplicate values keeping only unique
  //         console.log("uniq", uniq)
  //     }
  // }

 

//https://javascript.info/object-copy
  useEffect(() => {
    fetchUsers()

  }, [])

  const cloner = () => {
    let clone = []
    for (let i = 0; i < Users.length; i++) {
      clone.push(Object.assign({}, Users[i]))
    }
    return clone;
  }
  
  const utilities = {
    tobeRemovedOption: cloner(),
    tobeRetrievedOption: [],

  }

  // useEffect(() => {
  //     fetchUsersInGroup()
  // }, [groupID])

  //this function fetches data about the user from back-end
  const fetchUsers = async () => {

    try {
      const response = await api.get('/getusers/profile');
      const users = await api.get('/getusers')
      //console.log(response.data.groups)
      //console.log(response.data)
      setGroupInfo(response.data.groups);
      setUserInfo(response.data);
      setUsers(users.data);
      setGroupName(response.data.groups[0].title) //this is to show the first group in the screen on first render instead of empty.
      history.push(`/main/${response.data.groups[0]._id}`);//re-routes to first group when page refreshes
    }
    catch (error) {
      console.dir("GETUSERSERROR: ", error);
    }
  }

  // const fetchUsersInGroup = async () => { //this is a test function
  //     try {
  //         const res = await api.get(`groups/usersingroupID/${groupID}`)
  //         //console.log(res)
  //     } catch (error) {
  //         console.dir("GETGROUPSERROR: ", error);
  //     }
  // }

  // const onClickFunctions={
  //     f1: ()=>{
  //         console.log("frst")
  //     }
  //    ,
  //     f2: ()=>{
  //         console.log("2nd")
  //     }
  //     ,
  //     f3: ()=>{
  //         console.log("3rd")
  //     }
  // }



  // const actions= () => {
  //     setShowModalxyz(false)
  //     console.log("1")
  //     console.log("2")
  //     console.log("3")

  // };

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
                refreshIndex={refreshIndex}
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
          setRefreshIndex={setRefreshIndex}
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