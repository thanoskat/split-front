import '../style/Notifications.css'
import { Container } from './'
import { useEffect, useState } from 'react'
import useAxios from '../utility/useAxios'

const Notifications = () => {

  const [requests, setRequests] = useState([])
  const [refresh, setRefresh] = useState(false)
  const [milisecs, setMilisecs] = useState()
  const api = useAxios()


  const getRequests = async () => {
    try {
      const requests = await api.get('groups/getgrouprequests')

      // requests.data.map(x => new Date(x.date).getTime()) //time requests were built in milisecs
      console.log(requests)
      // console.log("date", milisecs)
      //setMilisecs(requests.data);
      setRequests(requests.data)
      //console.log(milisecs)
      console.log(getTimeSince(requests))
      console.log(requests)
    }
    catch (error) {
      console.dir("REQUESTERROR: ", error)
    }
  }

  const getTimeSince = (arr) => {
    const currDate = new Date()
    const currDatems = currDate.getTime()
    //const arrms = arr.data.map(x => new Date(x.date).getTime())
    //const arrms = arr.map(x =>x.data.map(x=>new Date(x.date).getTime()))
    //const res = arrms.map(milisec => (currDatems - milisec) / 1000 / 60 / 60)
    arr.data.map(x => new Date(x.date).getTime())
    return arr /// 1000 / 60 / 60 / 24
  }

  useEffect(() => {
    console.log('useEffect() ran')
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
              8 seconds ago
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
