import React from 'react'
import '../style/CreateGroupModal.css'
import { Modal, Dropdown } from "."
import { useState } from 'react'
import useAxios from '../utility/useAxios'

{/* <Modal
className="summary"
showModal={showModalxyz}
onCloseModal={() => setShowModalxyz(false)}
handleOnClick={actions}
ActionButtonMessage={"Hello"}
HeaderMessage={"Header"}>

</Modal> */}

//This is a component that is using the Modal component. It is not a modal itself.
export default function CreateGroupModal({ showCreate, setShowCreate, utilities, setRefresh }) {

  const [groupName, setGroupName] = useState("") //Given group name from user
  // const [Users, setUsers] = useState([]);
  const [value, setValue] = useState(null);

  // const Users=[
  //     {
  //         "expenses": [],
  //         "_id": "619a5327949ad8e993b0531e",
  //         "nickname": "kristie",
  //         "email": "chris@gmail.com",
  //         "date": "2021-11-21T14:08:57.338Z",
  //         "groups": [
  //             "619a53ad949ad8e993b05331",
  //             "619c30bcdd17753583bbe290",
  //             "61a299c48915e9cde8aba8a0",
  //             "61a57196b828c18b610f1887",
  //             "61a7b7c07dfc7207dd7dcc46",
  //             "61a7b7c37dfc7207dd7dcc4b",
  //             "61a7b7c57dfc7207dd7dcc50",
  //             "61a7b7c77dfc7207dd7dcc55",
  //             "61a7b7ca7dfc7207dd7dcc5a",
  //             "61a7b7cd7dfc7207dd7dcc5f",
  //             "61a7b7ce7dfc7207dd7dcc64",
  //             "61a7b7d17dfc7207dd7dcc69",
  //             "61a7b7d37dfc7207dd7dcc6e",
  //             "61a7b7d57dfc7207dd7dcc73",
  //             "61a81c3e36da66c2084099a9",
  //             "61a81c4236da66c2084099ae",
  //             "61a81c4636da66c2084099b3",
  //             "61a81c4d36da66c2084099b8"
  //         ],
  //         "__v": 0,
  //         "requests": [
  //             "61b7e17d41d9c366e772d681"
  //         ]
  //     },
  //     {
  //         "requests": [],
  //         "expenses": [],
  //         "_id": "619ab358aece9e435226dd0c",
  //         "nickname": "artjem",
  //         "email": "artjem@gmail.com",
  //         "date": "2021-11-21T20:01:17.622Z",
  //         "groups": [
  //             "619a53ad949ad8e993b05331"
  //         ],
  //         "__v": 0
  //     },
  //     {
  //         "expenses": [],
  //         "_id": "619ac6e9d034fabe14be1a89",
  //         "nickname": "ron wasili",
  //         "email": "wasili@gmail.com",
  //         "date": "2021-11-21T22:02:35.023Z",
  //         "groups": [
  //             "619a53ad949ad8e993b05331",
  //             "619c30bcdd17753583bbe290"
  //         ],
  //         "__v": 0,
  //         "requests": [
  //             "61a7a3597d61933ce34c7013",
  //             "61a7b0aa7dfc7207dd7dcb8a",
  //             "61a7b7e97dfc7207dd7dcc86",
  //             "61a7b7ea7dfc7207dd7dcc8b",
  //             "61a7b7eb7dfc7207dd7dcc90",
  //             "61a7b7ed7dfc7207dd7dcc95",
  //             "61a7b7ee7dfc7207dd7dcc9a",
  //             "61a7b7f07dfc7207dd7dcc9f",
  //             "61a7b7f17dfc7207dd7dcca4",
  //             "61a7b7f27dfc7207dd7dcca9",
  //             "61a7b7f47dfc7207dd7dccae",
  //             "61a7b7f57dfc7207dd7dccb3"
  //         ]
  //     },
  //     {
  //         "expenses": [],
  //         "_id": "619f9ded7c3845558406a96e",
  //         "nickname": "Vladimir",
  //         "email": "slav@gmail.com",
  //         "date": "2021-11-25T14:27:39.537Z",
  //         "groups": [],
  //         "requests": [
  //             "619f9e047c3845558406a979",
  //             "619f9e067c3845558406a97d",
  //             "619fc65dfd63357271ccb0a6"
  //         ],
  //         "__v": 0
  //     },
  //     {
  //         "expenses": [],
  //         "_id": "619fbbb7f62bf0d97607bee3",
  //         "nickname": "Dimitri",
  //         "email": "therealslav@gmail.com",
  //         "date": "2021-11-25T16:34:35.737Z",
  //         "groups": [
  //             "619c30bcdd17753583bbe290",
  //             "61a299c48915e9cde8aba8a0"
  //         ],
  //         "requests": [
  //             "619fbbcff62bf0d97607beec",
  //             "619fc533fd63357271ccb076",
  //             "619fc538fd63357271ccb07b",
  //             "61a0065270bb6752c161a7b6",
  //             "61a7a4987dfc7207dd7dcacd",
  //             "61a7adea7dfc7207dd7dcb24"
  //         ],
  //         "__v": 0
  //     },
  //     {
  //         "expenses": [],
  //         "_id": "619fbc1af62bf0d97607bef0",
  //         "nickname": "Dimitris",
  //         "email": "ellinas@gmail.com",
  //         "date": "2021-11-25T16:34:35.737Z",
  //         "groups": [
  //             "61a299c48915e9cde8aba8a0",
  //             "619a53ad949ad8e993b05331",
  //             "61a57196b828c18b610f1887",
  //             "619c30bcdd17753583bbe290",
  //             "61a7b7ca7dfc7207dd7dcc5a",
  //             "61a7b7cd7dfc7207dd7dcc5f",
  //             "61a7b7d37dfc7207dd7dcc6e",
  //             "61a81c3b36da66c2084099a4",
  //             "61a81c3e36da66c2084099a9",
  //             "61a81c4636da66c2084099b3",
  //             "61a81c5236da66c2084099c2",
  //             "61a81c4236da66c2084099ae",
  //             "61a81c4d36da66c2084099b8",
  //             "61a81c5036da66c2084099bd",
  //             "61b7e0ba41d9c366e772d65a"
  //         ],
  //         "requests": [
  //             "619fbcfc3ce86352f1a1771a",
  //             "619fbd023ce86352f1a1771e",
  //             "619fccdea04898f50f76be88",
  //             "61a566445231f501525544a8",
  //             "61a566725231f501525544b9",
  //             "61a57b7a6fc81807895034c0",
  //             "61a58261558a667e33b76c2f",
  //             "61a643c2e5f7898c19342a2b",
  //             "61a6462184c3c05184d99007",
  //             "61a646af369582077ed9df46",
  //             "61a646dedcde23b21ddf944d",
  //             "61a64724af6849cf2763ce30",
  //             "61a64c26aa38451e7a5becc1",
  //             "61a7bd01b57070691eaff2e3",
  //             "61a7be47b57070691eaff2ef",
  //             "61a7be4ab57070691eaff2f6",
  //             "61a7be4bb57070691eaff2fb",
  //             "61a7be4cb57070691eaff300",
  //             "61a7be51b57070691eaff30f",
  //             "61a7be52b57070691eaff314",
  //             "61a82296150e5a6b141e5c2d",
  //             "61a82298150e5a6b141e5c32",
  //             "61a82727eedb343da04dd59f"
  //         ],
  //         "__v": 0
  //     },
  //     {
  //         "_id": "61dc759807ca0143062f15ac",
  //         "nickname": "Mpelos",
  //         "email": "paok@gmail.com",
  //         "date": "2022-01-10T17:53:07.705Z",
  //         "groups": [],
  //         "requests": [],
  //         "expenses": [],
  //         "__v": 0
  //     }
  // ]
  const api = useAxios()

  const onSubmitFunction = async () => {
    if (groupName == "") return null; //do nothing if there is no group name
    let newGroupID;// interestingly const doesn't work here
    try {
      newGroupID = await api.post('/groups/creategroup', { title: groupName}) //creates group and returns its ID
      setShowCreate(false)
      setGroupName("")
      setRefresh(prev => !prev)


    } catch (err1) {
      console.dir("CREATE GROUP ERROR: ", err1);
    }

    if (utilities.tobeRetrievedOption.length == 0) return null; //do not proceed to sending requests if no such option from user
    const createGroupObj = {
      recipient: utilities.tobeRetrievedOption.map(x => x._id),
      groupToJoin: newGroupID.data
    }

    try {
      await api.post('groups/createmultigrouprequests', createGroupObj)

    } catch (err2) {
      console.dir("CREATE REQUEST ERROR: ", err2);
    }
    // const maper=utilities.tobeRetrievedOption.map(x=>x._id)
    //     console.log("maper",maper)
  }

  const isActive = () => {
    if (groupName == "") return false;
    if (groupName !== "") return true;
  }
  //!!!!!!!!!!keep an eye on the onClose and the show names as they
  //!!!!!!!!!!can have conficts with the ModalFrame names.
  
  return (
    <div className='CreateGroup'>
      <Modal
        className="Create-Group-Modal"
        onClose={() => setShowCreate(false)}
        show={showCreate}
        handleOnClick={onSubmitFunction}
        ActionButtonMessage={"Create"}
        HeaderMessage={"Create New Group"}
        ShowCancel={false}
        isActive={isActive()}>

        <div className='Create-Input-Section'>
          <input className='Create-Input-Field' required type="text"
            onChange={(event) => setGroupName(event.target.value)} />
          <span className='floating-label'>Group name </span>
        </div>
        <Dropdown
          placeholder={"Invite friends (optional)"}
          value={value}
          setValue={setValue}
          mapTo="nickname"
          id="_id"
          utilities={utilities}
          displaynamesbox={1}
          mouse={"mouseup"}
          />
      </Modal>
    </div>
  )
}
