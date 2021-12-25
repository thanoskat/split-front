import './Notifications.css'
import { Container } from './'
import { useEffect, useState } from 'react'
import useAxios from '../utility/useAxios'

const Notifications = () => {

  const [requests, setRequests] = useState([])
  const [loading, setLoading] = useState(true)
  const api = useAxios()

  const getRequests = async () => {
    try {
      const requests = await api.get('groups/getgrouprequests')
      setRequests(requests.data)
    }
    catch(error) {
      console.dir("REQUESTERROR: ", error)
    }
  }

  useEffect(() => {
    console.log('useEffect() ran')
    getRequests()
    setLoading(false)
  }, [])

  return(
    <Container>
      <h1>Your Notifications</h1>
      {requests.map((request, index) => (
        <div className='request-container'>
          <h4 key={index}>{request.requester.nickname} invited you to join {request.groupToJoin.title}</h4>
          <div className='nav-button'>Accept</div>
          <div className='nav-button'>Decline</div>
        </div>
      ))}
    </Container>
  )
}

export default Notifications
