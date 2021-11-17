import './App.css';
import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import useAxios from './utility/useAxios'
import {Form, Button} from 'semantic-ui-react'



function Profile(){

  const [user, setUser] = useState({})
  const [groupName, setGroupName] = useState("")

  const api = useAxios()
  const {Group, Input}=Form;

  useEffect(() => {
    fetchUser()
  }, [])

  const fetchUser = async () => {
    try{
      const response = await api.get('/getusers/profile')  
      console.log(response.data)
      setUser(response.data)
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
    )


}

export default Profile;