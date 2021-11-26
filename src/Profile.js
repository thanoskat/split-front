import './App.css';
import { useState, useEffect } from 'react'
import useAxios from './utility/useAxios'
import {Form, Button} from 'semantic-ui-react'
import CustomCard from './CustomCard';
import NotficationLabel from './Notification';
import { appendToMemberExpression } from '@babel/types';



function Profile(){

  const [groupInfo, setGroupInfo] = useState([{}])
  const [groupName, setGroupName] = useState("")
  const [userInfo, setUserInfo] = useState({})
  const [users, setUsers] = useState([])



  const [UserIDtoBeAdded,SetUserIDtoBeAdded ]=useState("")
  const [GroupIDtoAddUser,SetGroupIDtoAddUser]=useState("")


  const api = useAxios()
  const {Group, Input}=Form;

  useEffect(() => {
    fetchUser()
    fetchUsers()
  }, [])

  const fetchUsers = async () => {
    try{
      const response = await api.get('/getusers')
      setUsers(response.data)
    
    }
    catch(error){
      console.dir("GETUSERSERROR: ", error)
    }
  }


  const fetchUser = async () => {
    try{
      const response = await api.get('/getusers/profile');
      //  console.log(response.data.groups)
      //  console.log(response.data)
      setGroupInfo(response.data.groups);
      setUserInfo(response.data);
    
    }
    catch(error){
      console.dir("GETUSERSERROR: ", error);
    }
  }

  const  onSubmitFunction = async (e)=>{
    const groupObj={
      title:groupName
    }
    await api.post('/groups/creategroup', groupObj)
    e.target.reset()
  }


  const onSubmitAddUserToGroup = async (e)=>{
    const IDs={
      userID:UserIDtoBeAdded,
      groupID:GroupIDtoAddUser
    }

    await api.post('groups/addUserToGroup', IDs)
    e.target.reset()
  }

  return(
    <div>
        <NotficationLabel/>
        <CustomCard
          nickname={userInfo.nickname}
          email = {userInfo.email}
          _id={userInfo._id}
          length={groupInfo.length}
          groupInfo={groupInfo}
          />
      <Form
        onSubmit={e=>onSubmitFunction(e)}
        style={{paddingLeft: '100px', paddingRight: '100px',paddingTop:'10px'}}>
        <Group widths='equal'>
          <Input
            onChange={(event)=>setGroupName(event.target.value)}
            fluid
            placeholder='Name of Group'/>
        </Group>
        <Button primary>Create Group</Button>
      </Form>
      <Form
        onSubmit={e=>onSubmitAddUserToGroup(e)}
        style={{paddingLeft: '100px', paddingRight: '100px',paddingTop:'10px'}}>
        <Group widths='equal'>
          <Input
            onChange={event=>SetUserIDtoBeAdded(event.target.value)}
            fluid
            placeholder='Id of User to be added'/>
          <Input
              onChange={event=>SetGroupIDtoAddUser(event.target.value)}
              fluid
              placeholder='Group user will be added to '/>
        </Group>
        <Button primary>Add User to Group</Button>
      </Form>
      <h1>
        {groupInfo.map(group=>(<h2>group ID : {group._id} </h2>))}
        {groupInfo.map(group=>(<h2>group title : {group.title} </h2>))}
        {users.map(user=>(<h2>users : {user._id} </h2>))}
      </h1>
    </div>
  )
}

export default Profile;
