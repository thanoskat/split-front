import './App.css';
import { useState, useEffect, useDebugValue } from 'react'
import { Link } from 'react-router-dom'
import useAxios from './utility/useAxios'
import {Grid,Segment,List,Input} from "semantic-ui-react"

function MyGroups() {

  const [groups, setGroups] = useState([])
  const [ownedGroups, setOwnedGroups]=useState([{}])
  const [groupID, setGroupID]=useState("")
  const api = useAxios()

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try{
      const response = await api.get('/groups/mygroups')
      const ownedGroups = await api.get("/groups/groupsbycreator")
      setOwnedGroups(ownedGroups.data)
      setGroups(response.data)
     

    }
    catch(error){
      console.dir("GETUSERSERROR: ", error)
    }
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
  <Grid columns={2} divided>
      <Row>
          <Column >
            <Segment>
              <Header as='h1'>Groups I am member of:</Header> 
                {groups.map(group => (
                  <h3>
                   <Link to={`/group/${group._id}`}>{group.title}</Link>
                   </h3>))}
            </Segment>
          </Column>
        
        
      <Column>
      <Segment>
        <Header as='h1'>Groups I have created:</Header>
            {ownedGroups.map(group=>(
                <h3>{group.title}<br></br><Input 
                action={{ icon: 'add' }} 
                placeholder='Add User by ID' 
                onChange={(event)=>setGroupID(event.target.value)}/>
                </h3>
                ))}
       </Segment>
      </Column>
      
    </Row>

    <Row>
      <Column>
        
      </Column>
      <Column>
        Actions (add user etc)
      </Column>
     
    </Row>
  </Grid>
    </div>
  );
}

export default MyGroups;
