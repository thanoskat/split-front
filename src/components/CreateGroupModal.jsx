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

    const api = useAxios()

    const onSubmitFunction = async (e) => {
        const groupObj = {
            title: groupName
        }
        await api.post('/groups/creategroup', groupObj)
        e.target.reset()
    }

//keep an eye on the onClose and the show names as they
//can have conficts with the ModalFrame names.
    return (
        <div className='CreateGroup'>
            <Modal
                className="Create-Group-Modal"
                onClose={() => setShowCreate(false)}
                show={showCreate}
                handleOnClick={onSubmitFunction}
                ActionButtonMessage={"Create"}>
                <div>
                    <input
                        onChange={(event) => setGroupName(event.target.value)}
                        placeholder='Name of Group' />
                </div>
            </Modal>
        </div>
    )
}
