import {Icon, Label, Menu, Header,Grid,Segment,Popup, Button} from 'semantic-ui-react'
import { useState, useEffect } from 'react'
import useAxios from './utility/useAxios'

const NotficationLabel=()=>{

const [pendingRequestsNo, setPendingRequestsNo] = useState()
const [request, setRequest]=useState([{}])
const api = useAxios()

 useEffect(()=>{
     fetchRequests()
 },[])

 const fetchRequests = async ()=>{
     try{
        const requests = await api.get('groups/getgrouprequests')
        // setgroupRequestInfo(requests.data)
       const pendingStatusCounter = requests.data.requests.filter(obj => obj.status===0).length
       setPendingRequestsNo(pendingStatusCounter)
       setRequest(requests.data.requests)
       console.log(requests.data.requests)
     }
        catch(error){
        console.dir("REQUESTERROR: ", error)
        }
    }
//  const handleRead = () => {
//     setPendingRequestsNo();
//   };

  const OnClickAccept =async (_id,groupToJoin)=>{
    try{
       const info={status:1,_id,groupID:groupToJoin }
       await api.post('groups/addUserToGroup2',info)
       console.log(_id)
    }catch(err){
       console.dir("ClickAcceptError: ",err)
    }
    
  }

  const OnClickDecline = async (_id,groupToJoin)=>{
    try{
      const info={status:2,_id}
      await api.post('groups/updatestatus',info)
      console.log(_id)
   }catch(err){
      console.dir("ClickAcceptError: ",err)
   }
  }



 const displayNotification=({_id,status,groupToJoin})=>{
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
           <Grid>
              <Grid.Column width={7}>
                  <Button primary onClick={()=>OnClickAccept(_id,groupToJoin)}>Accept</Button> 
              </Grid.Column>
            <Grid.Column width={7}>
                <Button secondary onClick={()=>OnClickDecline(_id,groupToJoin)}>Decline</Button>
            </Grid.Column>
           </Grid>
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
                        <Menu.Item as="a">
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