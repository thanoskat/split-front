import {Icon, Label, Menu, Header,Grid} from 'semantic-ui-react'
import { useState, useEffect } from 'react'
import useAxios from './utility/useAxios'

const NotficationLabel=()=>{

const [pendingRequestsNo, setPendingRequestsNo] = useState()
const [request, setRequest]=useState([{}])
const [open, setOpen] = useState(false);
const api = useAxios()

 useEffect(()=>{
     fetchRequests()
 },[])

 const fetchRequests = async ()=>{
     try{
        const requests = await api.get('groups/getgrouprequests')
        // setgroupRequestInfo(requests.data)
       const pendingStatusCounter = requests.data.requests.filter(obj => obj.status==0).length
       setPendingRequestsNo(pendingStatusCounter)
       setRequest(requests.data.requests)
       console.log(requests.data.requests)
     }
        catch(error){
        console.dir("REQUESTERROR: ", error)
    }
    }
 const handleRead = () => {
    setOpen(false);
    setPendingRequestsNo();
  };

 const displayNotification=({status, groupToJoin})=>{
        let action;
    if (status === 0) {
        action = "pending";
      }else if (status === 1) {
        action = "approved";
      } else {
        action = "declined";
      }
     return( <Menu vertical>
        <Menu.Item >
        <Header as='h4'>Requests</Header>
        <p>{`${groupToJoin} is ${action}`}</p>
        </Menu.Item>

    </Menu>)
 }

    return(
        <div>
            <h1>{request.map(req=><h3>{req._id}</h3>)}</h1> 
     <Grid columns={1} centered>
         <Grid.Row >
            
                <Menu compact >
                    <Menu.Item as='a' onClick={()=> setOpen(!open)}>
                        
                    <Icon name='bell' /> Group requests
                    
                    {pendingRequestsNo?(<Label color='red' floating >
                    {pendingRequestsNo}
                    </Label>):("")}
                    
                    </Menu.Item>
                </Menu>
      </Grid.Row>
      {open &&(
      <Grid.Row >
        {request.map((n) => displayNotification(n))}        
      </Grid.Row>
      )}
    </Grid>
      
      </div>
    )
}

export default NotficationLabel