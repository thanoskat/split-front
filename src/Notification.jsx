import {Icon, Label, Menu, Header, Grid, Segment, Popup, Button} from 'semantic-ui-react'
import { useState, useEffect } from 'react'
import useAxios from './utility/useAxios'
const { Column } = Grid

const NotficationLabel = () => {

  const [pendingRequestsNo, setPendingRequestsNo] = useState()
  const [request, setRequest]=useState([{}])
  const api = useAxios()

  useEffect(()=>{
    fetchRequests()
  },[])

  const fetchRequests = async () => {
    try{
      const requests = await api.get('groups/getgrouprequests')
      // setgroupRequestInfo(requests.data)
      const pendingStatusCounter = requests.data.requests.filter(obj => obj.status===0).length
      setPendingRequestsNo(pendingStatusCounter)
      setRequest(requests.data.requests)
      console.log(requests.data)
    }
    catch(error) {
      console.dir("REQUESTERROR: ", error)
    }
  }
  //  const handleRead = () => {
  //     setPendingRequestsNo();
  //   };

  const OnClickAccept =async (_id)=>{
    try {
      const info={status:1,_id }
      await api.post('groups/requesthandler',info)

    } catch(error) {
      console.dir("ClickAcceptError: ", error)
    }
  }

  const OnClickDecline = async (_id)=>{
    try {
      const info={status:2,_id}
      await api.post('groups/requesthandler',info)
    }
    catch(error) {
      console.dir("ClickDeclineError: ", error)
    }
  }

  const notificationRedNumber = () => {
    if(pendingRequestsNo){
      return(
        <Label color='red' floating>
          {pendingRequestsNo}
        </Label>
      )
    }
    else {
      return(<></>)
    }
  }

  const notificationSegment=({_id,status,groupToJoin})=>{
    let action;
    if (status === 0) {
      action = "pending";
    } else if (status === 1) {
      action = "approved";
    } else {
      action = "declined";
    }
    return(
      <Segment raised>
        {`Request to join ${groupToJoin} ${action}`}
        <Button.Group>
          <Grid>
            <Column width={7}>
              <Button primary onClick={()=>OnClickAccept(_id)}>Accept</Button>
            </Column>
            <Column width={7}>
              <Button secondary onClick={()=>OnClickDecline(_id)}>Decline</Button>
            </Column>
          </Grid>
        </Button.Group>
      </Segment>
    )
  }

  return(
    <Popup
      trigger=
      {
        <Menu compact>
          <Menu.Item as="a">
          <Icon name='bell'/>
            {notificationRedNumber()}
          </Menu.Item>
        </Menu>
      }
      on='click'
      disabled={pendingRequestsNo?false:true}
      position='bottom right'>
      <Grid>
        <Column style={{overflow: 'auto', maxHeight: 500 }}>
          {request.map((req) =><>{notificationSegment(req)}</>)}
        </Column>
      </Grid>
    </Popup>
  )
}

export default NotficationLabel
