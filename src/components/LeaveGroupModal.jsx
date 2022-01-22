import "../style/LeaveGroupModal.css";
import React from 'react';
import useAxios from "../utility/useAxios"
import { useHistory } from "react-router-dom";


export default function LeaveGroupModal({ showLeaveGroup, onCloseLeaveGroup, userInfoID, groupID, groupName, setGroupName, setGroupInfo}) {
    
    const api = useAxios()
    const history = useHistory();

    const leaveGroup = async () => {
        try {
            const res = await api.post('/groups/removeuserfromgroup', { userID: userInfoID, groupID: groupID })
            const res2 = await api.get('/getusers/profile');
            if (res.status === 200) {
                onCloseLeaveGroup()
                setGroupName(res2.data.groups[0].title) //update title in modal button to first group when leaving another group
                setGroupInfo(res2.data.groups)
                history.push(`/main/${res2.data.groups[0]._id}?${0}`); //redirect to first group when leaving another group
                //!!!what happens when no group is left (e.g if user leaves all groups)

            }
        }
        catch (error) {
            console.dir(error)
        }
    }

    if (!showLeaveGroup) {
        return null
    }

    return (
        <div className="leavegroupmodal" onClick={onCloseLeaveGroup}>
            <div className="leavegroup-content" onClick={e => e.stopPropagation()}>
                <div className="leavegroup-header">
                    <h4 className="leavegroup-title">Are you sure?</h4>
                    <button className="leavegroup-exit-button" onClick={onCloseLeaveGroup}>
                        <i className="times icon x"></i>
                    </button>

                </div>
                <div className="leavegroup-body">
                    You are about to Leave Group {groupName}
                </div>
                <div className="leavegroup-decision-buttons">
                    <button className="leavegroup-decison-button" onClick={leaveGroup}>Leave Group</button>
                    <button className="leavegroup-decison-button" onClick={onCloseLeaveGroup}>Cancel</button>
                </div>
            </div>
        </div>
    )
}
