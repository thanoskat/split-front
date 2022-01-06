import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import useAxios from '../utility/useAxios'
import { List, Button, Form, Input, Segment, Grid } from 'semantic-ui-react'

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

  const { Row, Column } = Grid
  const { Header } = List

  // {groups.map(group => (
  //   // Warning: Each child in a list should have a unique "key" prop
  //   <h1 key={group._id}>
  //     <Link to={`/group/${group._id}`}>{group.title}</Link>
  //   </h1>
  // ))}

  return (

    <div>
      <Grid columns={2} divided >
        <Row>
          <Column>
            <Segment>
              <Header as='h1' >Groups I am member of:</Header>
              {groups.map(group => (
                <h3>
                  <Link to={`/group/${group._id}`} key={group._id}>{group.title}</Link>
                </h3>))}
            </Segment>
          </Column>
          <Column>

            <Segment >
              <Header as='h1'>Groups I have created:</Header>
              {ownedGroups.map(group => (
                <h3 key={group._id} >{group.title}
                  <br></br>
                  <Form style={{ width: "300px" }} onSubmit={(event) => onSubmitRequest(group._id, event)}>
                    <Form.Field
                      fluid='true'
                      control={Input}
                      // label=''
                      placeholder='ID of user to be added'
                      onChange={(event) => { setGroupIDrequestReceiver(event.target.value) }}>
                    </Form.Field>
                    <Button type='submit'>Send request</Button>
                  </Form>
                </h3>
              ))}
            </Segment>

          </Column>
        </Row>
      </Grid>
    </div>);
}

export default MyGroups;
