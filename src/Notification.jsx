import {Icon, Label, Menu} from 'semantic-ui-react'
import { useState, useEffect } from 'react'
import useAxios from './utility/useAxios'

const NotficationLabel=()=>{

const [pendingRequestsNo, setPendingRequestsNo] = useState()
 const api = useAxios()

 useEffect(()=>{
     fetchRequests()
 },[])
 
 const fetchRequests = async ()=>{
    const requests = await api.get('groups/getgrouprequests')
    // setgroupRequestInfo(requests.data)
   const pendingStatusCounter = requests.data.requests.filter(obj => obj.status==0).length
   setPendingRequestsNo(pendingStatusCounter)
   console.log(pendingStatusCounter)
 }
    return(
        <Menu compact >
            <Menu.Item as='a'>
            <Icon name='bell' /> Group requests
            {pendingRequestsNo?(<Label color='red' floating >
               {pendingRequestsNo}
            </Label>):("")}
            
            </Menu.Item>
      </Menu>
    )
}

//{groupRequestInfo.pending?(do something):(do something else)}
export default NotficationLabel