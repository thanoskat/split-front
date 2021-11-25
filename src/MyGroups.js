import './App.css';
import { useState, useEffect, useDebugValue } from 'react'
import { Link } from 'react-router-dom'
import useAxios from './utility/useAxios'
import {Grid,Segment,List,Input} from "semantic-ui-react"
import { continueStatement } from '@babel/types';

function MyGroups() {

  const [groups, setGroups] = useState([])
  const [ownedGroups, setOwnedGroups]=useState([{}])
  const [groupIDrequestReceiver, setGroupIDrequestReceiver]=useState("")
  const [GroupIDtoJoin, setGroupIDtoJoin]=useState("")
  const api = useAxios()

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try{
      const response = await api.get('/groups/mygroups')
      const ownedGroups = await api.get("/groups/groupsbycreator")
     setOwnedGroups(ownedGroups.data) //ownedGroups._id
      console.log(ownedGroups.data)
      setGroups(response.data)
    }
    catch(error){
      console.dir("GETUSERSERROR: ", error)
    }
  }

  const onSubmitRequest= async (e)=>{
    e.preventDefault()
   
    const GroupRequestObj={
       recipient:groupIDrequestReceiver,
       groupToJoin:GroupIDtoJoin
    }
    e.target.reset()
    console.log(GroupIDtoJoin)
    await api.post('groups/creategrouprequest',GroupRequestObj)
    
    // console.log(groupIDrequestReceiver)
    // console.log(GroupIDtoJoin)
    
    }

  const { Row, Column } = Grid
  const { Item, Content, Header, Description, Icon } = List
  
  // {groups.map(group => (
  //   // Warning: Each child in a list should have a unique "key" prop
  //   <h1 key={group._id}>
  //     <Link to={`/group/${group._id}`}>{group.title}</Link>
  //   </h1>
  // ))}

  return (
    
<div>
      <Grid columns={2} divided >
          <Row>
              <Column>
                <Segment>
                  <Header as='h1' >Groups I am member of:</Header> 
                    {groups.map(group => (
                      <h3>
                      <Link to={`/group/${group._id}`} key={group._id}>{group.title}</Link>
                      </h3>))}
                </Segment>
              </Column>
          <Column>
          <form onSubmit={e=>onSubmitRequest(e)}>
            <Segment >
             <Header as='h1'>Groups I have created:</Header>
                {ownedGroups.map(group=>(
                    <h3  key={group._id} >{group.title}
                    <br></br>
                    <Input 
                    action={{ icon: 'add' }} 
                    placeholder='Add User by ID' 
                    size ="small"
                    onChange={(event)=>{setGroupIDrequestReceiver(event.target.value); setGroupIDtoJoin(group._id)}}/>
                    </h3>
                    ))}
            </Segment>
          </form>
         </Column>   
        </Row>
      </Grid>
    </div>);
    }

export default MyGroups;
