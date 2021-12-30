import './mainpage.css'
import "./importedCSS.css"
import useAxios from '../utility/useAxios'
import { ModalFrame, LeaveGroupModal } from '.'
import { useState, useEffect } from "react";


function MainPage() {

    const [show, setShow] = useState(false);
    const [showLeaveGroup, setShowLeaveGroup] = useState(false);
    const [groupName, setGroupName] = useState("");
    const [groupInfo, setGroupInfo] = useState([{}]);
    const [groupID, setGroupID] = useState("");
    const [userInfo, setUserInfo] = useState({});//not being used atm

    const api = useAxios()

    useEffect(() => {
        fetchUser()

    }, [])

    useEffect(() => {
        fetchUsersInGroup()
    }, [groupID])

    useEffect(() => {

    }, [])

    //this function fetches data about the user from back-end
    const fetchUser = async () => {
        try {
            const response = await api.get('/getusers/profile');
            //console.log(response.data.groups)
            // console.log(response.data)
            setGroupInfo(response.data.groups);
            setUserInfo(response.data);
        }
        catch (error) {
            console.dir("GETUSERSERROR: ", error);
        }
    }

    

    const fetchUsersInGroup = async () => { //this is a test function
        try {
            const res = await api.get(`groups/usersingroupID/${groupID}`)
            console.log(res)
        } catch (error) {
            console.dir("GETGROUPSERROR: ", error);
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
                            <button type="button" className="selection-button group-name-button  ">
                                <span className="group-title">
                                    {groupName}
                                </span>
                                <span className="button-position">
                                    <div className="button-layout">
                                        button
                                    </div>
                                </span>
                            </button>

                        </div>
                        <div className='option-buttons'>
                            <button className='option-button'>
                                <i className='user plus icon y'></i>
                                users in group
                            </button>
                            <button className='option-button' onClick={() => setShowLeaveGroup(true)}>
                                <i className='user times icon y '></i>
                                Leave group
                            </button>

                            <button  className='option-button'>
                                <span className="summary y"></span>
                                Summary
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

                    <div>
                        <button className='Xmple' onClick={() => setShow(true)}>
                            Open Modal
                            <i className='plus circle icon'>
                            </i>
                        </button>
                        <ModalFrame
                            onClose={() => setShow(false)}
                            show={show}
                            setGroupName={setGroupName}
                            groupInfo={groupInfo}
                            setGroupID={setGroupID} />
                    </div>


                </div>
                <LeaveGroupModal
                    showLeaveGroup={showLeaveGroup}
                    onCloseLeaveGroup={()=>setShowLeaveGroup(false)}
                    userInfoID={userInfo._id}
                    groupID={groupID} />
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