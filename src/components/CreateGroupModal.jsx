import React from 'react'
import '../style/CreateGroupModal.css'
import { Modal } from "."
import { useState, useEffect } from 'react'
import useAxios from '../utility/useAxios'

{/* <Modal
className="summary"
showModal={showModalxyz}
onCloseModal={() => setShowModalxyz(false)}
handleOnClick={actions}
ActionButtonMessage={"Hello"}
HeaderMessage={"Header"}>

</Modal> */}

export default function CreateGroupModal({ showCreate, setShowCreate }) {

    const [groupName, setGroupName] = useState("")
    const [Users, setUsers] = useState([]);

    const api = useAxios()


    useEffect(() => {
        fetchUsers();
    }, [])

    const onSubmitFunction = async (e) => {
        const groupObj = {
            title: groupName
        }
        await api.post('/groups/creategroup', groupObj)
        e.target.reset()
    }

    const fetchUsers = async () => {
        try {
            const users = await api.get('/getusers')
            setUsers(users.data);
        } catch (err) {
            console.dir("Create Group Fetch Users error", err)
        }
    }

    //!!!!!!!!!!keep an eye on the onClose and the show names as they
    //!!!!!!!!!!can have conficts with the ModalFrame names.
    //https://www.youtube.com/watch?v=mZvKPtH9Fzo
    return (
        <div className='CreateGroup'>
            <Modal
                className="Create-Group-Modal"
                onClose={() => setShowCreate(false)}
                show={showCreate}
                handleOnClick={onSubmitFunction}
                ActionButtonMessage={"Create"}
                HeaderMessage={"Create New Group"}>

                <div className='Create-Input-Section'>
                    <input className='Create-Input-Field' required type="text"
                        onChange={(event) => setGroupName(event.target.value)} />
                    <span className='floating-label'>Group name</span>
                </div>
                <div className='Add-Friend-Section'>
                    <input className='Add-Input-Field' required type="text" />
                    <span className='floating-label'>Invite friends</span>
                </div>
                <div>
                   {Users.map((index,key)=>{
                       return(
                           <div className='user' key={key}>{index.nickname}</div>
                       )

                   })}
                </div>
            </Modal>
        </div>
    )
}
