import {Icon, Label, Menu, Header,Grid,Segment,Popup, Button} from 'semantic-ui-react'
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
     return( 
        <div>
         <Segment >{`Request to join ${groupToJoin} ${action}`}
          <Button.Group>
            <Button primary>Accept</Button>
            <Button secondary>Decline</Button>
          </Button.Group>
         </Segment>
         
        </div>
   )
 }

    return(
        <div>
            {/* <h1>{request.map(req=><h3>{req._id}</h3>)}</h1>  */}
     {/* <Grid columns={3} centered container>
         <Grid.Row >      
                <Popup  trigger= { <Menu compact>
                    <Menu.Item as="a" onClick={()=> setOpen(!open)}>
                    <Icon name='bell'  /> ...
                    {pendingRequestsNo?(<Label color='red' floating >
                    {pendingRequestsNo}
                    </Label>):("")}
                    </Menu.Item>
                </Menu>}
                content='Your Group Requests'
                on='hover'
                />                   
      </Grid.Row>
      {open && pendingRequestsNo? (
      <Grid.Row >
          <Grid.Column>
            {request.map((n) => 
                <Segment.Group raised>
                {displayNotification(n)}
                </Segment.Group>)}   
        </Grid.Column>     
      </Grid.Row>
      ):("")
      }
    </Grid> */}
    
    <Popup  trigger= { <Menu compact>
                        <Menu.Item as="a" onClick={()=> setOpen(!open)}>
                          <Icon name='bell'  />
                          {pendingRequestsNo?(
                          <Label color='red' floating >
                            {pendingRequestsNo}
                         </Label>):("")}
                        </Menu.Item>
                     </Menu>}
                     on='click'
                    >
                   <Grid>
                      <Grid.Column>
                          <Popup                
                              trigger={pendingRequestsNo? (
                                <Grid.Row >
                                    <Grid.Column>
                                      {request.map((n) => 
                                          <Segment.Group raised >
                                            {displayNotification(n)}
                                          </Segment.Group>)}   
                                  </Grid.Column>     
                                </Grid.Row>
                                ):("")
                                }
                              disabled
                              position='top center'
                              size='tiny'
                              inverted
                            />
                      </Grid.Column>
                   </Grid>
      </Popup>
      </div>
      
    )
}

export default NotficationLabel