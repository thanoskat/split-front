import '../style/Notifications.css'
import { Container } from './'
import { useEffect, useState } from 'react'
import useAxios from '../utility/useAxios'

const Notifications = () => {

  const [requests, setRequests] = useState([])
  const [refresh, setRefresh] = useState(false)
  const api = useAxios()


  const getRequests = async () => {
    try {
      const requests = await api.get('groups/getgrouprequests')
      // console.log(requests.data)
      setRequests(requests.data)
    }
    catch (error) {
      console.dir("REQUESTERROR: ", error)
    }
  }


  useEffect(() => {
    // console.log('useEffect() ran')
    getRequests()

  }, [refresh])

  const OnClickAccept = async (_id) => {
    try {
      const info = { status: 1, _id }
      await api.post('groups/requesthandler', info)
      setRefresh(prev => !prev)

    } catch (error) {
      console.dir("ClickAcceptError: ", error)
    }
  }

  const OnClickDecline = async (_id) => {
    try {
      const info = { status: 2, _id }
      await api.post('groups/requesthandler', info)
      setRefresh(prev => !prev)

    }
    catch (error) {
      console.dir("ClickDeclineError: ", error)
    }
  }

  const randomNotification = [{ _id: "abxd2446", amount: 10, groupName: "groupName" }, { _id: "dsg4564", amount: 12, groupName: "groupName" }, { _id: "dnfjutyu644446", amount: 20, groupName: "anothergroupName" }]

  return (
    <Container className="notifications-container" >
      <h1>Your Notifications</h1>
      {requests.map((request, index) => (
        <div className='request-container'>
          <div className='notification-message' key={index}>
            <div className="notification-text">
              <strong>{request.requester.nickname}</strong>&nbsp; invited you to join &nbsp;<strong>{request.groupToJoin.title}</strong>
            </div>
            <div className="notification-time">
            {request.date.timeago}&nbsp;{request.date.format}&nbsp;ago
            </div>
          </div>
          <div className='nav-button' onClick={() => OnClickAccept(request._id)}>Accept</div>
          <div className='nav-button' onClick={() => OnClickDecline(request._id)}>Decline</div>
        </div>
      ))}
    </Container>
  )
}

export default Notifications
