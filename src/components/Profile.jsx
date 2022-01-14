import { useState, useEffect } from 'react'
import useAxios from '../utility/useAxios'
import '../style/Profile.css'
import { Container, Dropdown } from "."

function Profile() {

  const [groupInfo, setGroupInfo] = useState([{}])
  const [groupName, setGroupName] = useState("")
  const [userInfo, setUserInfo] = useState({})
  const [users, setUsers] = useState([])
  const [UserIDtoBeAdded, SetUserIDtoBeAdded] = useState("")
  const [GroupIDtoAddUser, SetGroupIDtoAddUser] = useState("")
  const [value, setValue] = useState(null)

  const api = useAxios()
  // const { Group, Input } = Form;

  useEffect(() => {
    fetchUser()
    // fetchUsers()
    // eslint-disable-next-line
  }, [])

  // const fetchUsers = async () => {
  //   try {
  //     const response = await api.get('/getusers')
  //     setUsers(response.data)

  //   }
  //   catch (error) {
  //     console.dir("GETUSERSERROR: ", error)
  //   }
  // }

  const fetchUser = async () => {
    try {
      const response = await api.get('/getusers/profile');
      const response2 = await api.get('/getusers')
      setUsers(response2.data)
      //  console.log(response.data.groups)
      //  console.log(response.data)
      setGroupInfo(response.data.groups);
      setUserInfo(response.data);

    }
    catch (error) {
      console.dir("GETUSERSERROR: ", error);
    }
  }

  const onSubmitFunction = async (e) => {
    const groupObj = {
      title: groupName
    }
    await api.post('/groups/creategroup', groupObj)
    e.target.reset()
  }

  const onSubmitAddUserToGroup = async (e) => {
    const IDs = {
      userID: UserIDtoBeAdded,
      groupID: GroupIDtoAddUser
    }

    await api.post('groups/addUserToGroup', IDs)
    //e.target.reset()
  }

  return (
    <div className='profile'>
      {/* <Form
        onSubmit={e => onSubmitFunction(e)}
        style={{ paddingLeft: '100px', paddingRight: '100px', paddingTop: '10px' }}>
        <Group widths='equal'>
          <Input
            onChange={(event) => setGroupName(event.target.value)}
            fluid
            placeholder='Name of Group' />
        </Group>
        <Button primary>Create Group</Button>
      </Form> */}
      <form
        onSubmit={e => onSubmitAddUserToGroup(e)}
      >

        <input
          onChange={event => SetUserIDtoBeAdded(event.target.value)}


          placeholder='619a53ad949ad8e993b05331' />
        <input
          onChange={event => SetGroupIDtoAddUser(event.target.value)}


          placeholder='61a81c5036da66c2084099bd ' />

        <button type="submit">Add User to Group</button>
      </form>
      <div>
        {groupInfo.map((group, index) => (<h2 key={index}>group ID : {group._id} </h2>))}
        {groupInfo.map((group, index) => (<h2 key={index}>group title : {group.title} </h2>))}
        {users.map((user, index) => (<h2 key={index}>users : {user._id} </h2>))}
        <Dropdown
          options={users}
          placeholder={"select"}
          value={value}
          onChange={val => setValue(val)}
        />
      </div>
    </div>
  )
}

export default Profile;
