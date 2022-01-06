import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import useAxios from '../utility/useAxios'

function MyGroups() {

  const [groups, setGroups] = useState([])
  const [ownedGroups, setOwnedGroups] = useState([{}])
  const [groupIDrequestReceiver, setGroupIDrequestReceiver] = useState("")
  const api = useAxios()

  useEffect(() => {
    fetchData()
    // eslint-disable-next-line
  }, [])

  const fetchData = async () => {
    try {
      const response = await api.get('/groups/mygroups')
      const ownedGroups = await api.get("/groups/groupsbycreator")
      setOwnedGroups(ownedGroups.data) //ownedGroups._id
      console.log(ownedGroups.data)
      setGroups(response.data)
    }
    catch (error) {
      console.dir("GETUSERSERROR: ", error)
    }
  }

  const onSubmitRequest = async (groupID, event) => {
    // e.preventDefault()

    const GroupRequestObj = {
      recipient: groupIDrequestReceiver,
      groupToJoin: groupID
    }
    // e.target.reset()
    console.log(groupID)
    await api.post('groups/creategrouprequest', GroupRequestObj)

    // console.log(groupIDrequestReceiver)
    // console.log(GroupIDtoJoin)
    event.target.reset()

  }

  // {groups.map(group => (
  //   // Warning: Each child in a list should have a unique "key" prop
  //   <h1 key={group._id}>
  //     <Link to={`/group/${group._id}`}>{group.title}</Link>
  //   </h1>
  // ))}

  return (
    <div>

    </div>
    );
}

export default MyGroups;
