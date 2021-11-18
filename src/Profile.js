import './App.css';
import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import useAxios from './utility/useAxios'
import {Form, Button} from 'semantic-ui-react'



function Profile(){

  const [groupInfo, setGroupInfo] = useState([{}])
  const [groupName, setGroupName] = useState("")

  const api = useAxios()
  const {Group, Input}=Form;

  useEffect(() => {
    fetchUser()
  }, [])

  const fetchUser = async () => {
    try{
      const response = await api.get('/getusers/profile')  
      console.log(response.data.groups)
      setGroupInfo(response.data.groups)
    }
    catch(error){
      console.dir("GETUSERSERROR: ", error)
    }
  }

  const  onSubmitFunction = async (e)=>{

    const groupObj={
      title:groupName
    }

    await api.post('/groups/creategroup', groupObj) 
    e.target.reset()

  }

    return(
      <div>
    <Form 
      onSubmit={e=>onSubmitFunction(e)}
      style={{paddingLeft: '100px', paddingRight: '100px',paddingTop:'10px'}}>
   <Group widths='equal'>
  <Input
      onChange={(event)=>setGroupName(event.target.value)}
      fluid
      placeholder='Name of Group'
    />
  </Group>
  <Button primary>Create Group</Button>
  
</Form>

          <h1>
           {groupInfo.map(group=>(
            <h2>group ID : {group._id} </h2>
            
          ))}
          {groupInfo.map(group=>(
            <h2>group title : {group.title} </h2>
            
          ))}
          </h1>

      </div>


    )


}

export default Profile;