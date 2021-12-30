import "./leavegroupmodal.css";
import "./importedCSS.css";
import React from 'react';
import useAxios from "../utility/useAxios"
import { useEffect,useState } from "react";

export default function LeaveGroupModal({showLeaveGroup, onCloseLeaveGroup, userInfoID, groupID}) {

    const api = useAxios()
    const [rerender, setRerender] = useState(false);

    
    const leaveGroup = async () => {
        try {
            const res = await api.post('/groups/removeuserfromgroup', { userID:userInfoID, groupID: groupID })
            if (res.status === 200) {
             onCloseLeaveGroup()
             setRerender(!rerender);
            }
        }
        catch (error) {
            console.dir(error)
        }
    }
    
    useEffect(() => {
        setRerender(!rerender);
    }, [rerender])

    if(!showLeaveGroup){
        return null
    }

    return (
        <div className="leavegroupmodal" onClick={onCloseLeaveGroup}>
            <div className="leavegroup-content" onClick={e=>e.stopPropagation()}>
                <div className="leavegroup-header">
                    <h4 className="leavegroup-title">Are you sure?</h4>
                    <button className="leavegroup-exit-button" onClick={onCloseLeaveGroup}>
                        <i className="times icon x"></i>
                    </button>
                    
                </div>
                <div className="leavegroup-body">
                    You are about to Leave Group ...
                </div>
                <div className="leavegroup-decision-buttons">
                    <button className="leavegroup-decison-button" onClick={leaveGroup}>Leave Group</button>
                    <button className="leavegroup-decison-button" onClick={onCloseLeaveGroup}>Cancel</button>
                </div>
            </div>
        </div>
    )
}
