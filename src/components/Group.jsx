import { useState, useEffect , useContext} from 'react'
import { Container, ListItem } from './'
import useAxios from '../utility/useAxios'
// import { AuthenticationContext } from '../contexts/AuthenticationContext'
import store from '../redux/store'

const Group = ({ match }) => {
  // const [creator, setCreator] = useState('')
  // const [title, setTitle] = useState('')
  // const [members, setMembers] = useState([])
  // const [allUsers, setAllUsers] = useState([])
  // const [selectedUserId, setSelectedUserId] = useState('')
  const [group, setGroup] = useState({})
  const [inputSender, setInputSender] = useState('')
  const [inputReceiver, setInputReceiver] = useState('')
  const [inputAmount, setInputAmount] = useState('')
  const [inputDescription, setInputDescription] = useState('')
  const [message, setMessage] = useState('click submit')
  // const { sessionData } = useContext(AuthenticationContext)
  const sessionData = store.getState().authReducer.sessionData
  const api = useAxios()

  useEffect(() => {
    fetchGroupInfo()
    // eslint-disable-next-line
  }, [])

  // const fetchGroup = async () => {
  //   try {
  //     const response = await api.get(`/groups/group/${match.params.groupid}`)
  //     const group = response.data
  //     setCreator(group.creator)
  //     setTitle(group.title)
  //     setMembers(group.members)
  //   }
  //   catch (error) {
  //     console.dir(error)
  //   }
  // }

  // const fetchAllUsers = async () => {
  //   try {
  //     const response = await api.get('/getusers')
  //     const userArray = []
  //     response.data.map((user) => (userArray.push({ key: user._id, value: user._id, text: user.nickname })))
  //     setAllUsers(userArray)

  //     //// TODO Clear before append
  //     // response.data.map((user) => {
  //     //   setAllUsers((array) => [...array, { key: user._id, value: user._id, text: user.nickname }])
  //     // })
  //   }
  //   catch (error) {
  //     console.dir(error)
  //   }
  // }

  // // No dependacies = Run after every render
  // // Empty [] dependancies = Run only after first render
  // useEffect(() => {
  //   fetchGroup()
  //   fetchAllUsers()
  //   // eslint-disable-next-line
  // }, [])

  // const dropDownChange = (e, { value }) => {
  //   setSelectedUserId(value)
  // }

  const filterID = (value) => {
    if (String(value.sender) === sessionData.userId || String(value.receiver) === sessionData.userId) {
      return value;
    }
  }

  const fetchGroupInfo = async () => {
    try {
      const res = await api.get(`/groups/${match.params.groupid}`)
      // console.log(res.data)
      setGroup(res.data)
      // console.log(match.params.groupid)
    }
    catch (error) {
      console.dir("GROUP PAGE ERROR: ", error)
    }
  }

  // const addSelectedUserToGroup = async () => {
  //   try {
  //     const res = await api.post('/groups/addUserToGroup', { userID: selectedUserId, groupID: match.params.groupid })
  //     if (res.status === 200) {
  //       await fetchGroup()
  //     }
  //   }
  //   catch (error) {
  //     console.dir(error)
  //   }
  // }

  // const removeUserFromGroup = async () => {
  //   try {
  //     const res = await api.post('/groups/removeuserfromgroup', { userID: selectedUserId, groupID: match.params.groupid })
  //     if (res.status === 200) {
  //       await fetchGroup()
  //     }
  //   }
  //   catch (error) {
  //     console.dir(error)
  //   }
  // }

  // const { Row, Column } = Grid
  // const { Item, Content, Header, Description, Icon } = List

  const members = () => {
    if(group.members) {
      return(
        group.members.map(member => (
          <ListItem to={`/user/${member._id}`} key={member._id} title={member.nickname}></ListItem>
      )))
    }
    else {
      return(<></>)
    }
  }

  const transactions = () => {
    if(group.transactions) {
      return(
        group.transactions.map(transaction => (
          <ListItem key={transaction._id} title={transaction._id} description={`${transaction.amount} from ${transaction.sender} to ${transaction.receiver}`}></ListItem>
        ))
      )
    }
    else {
      return(<></>)
    }
  }

  const pendingTransactions = () => {
    if(group.pendingTransactions) {
      return(
        group.pendingTransactions.map(pendingTransaction => (
          <ListItem key={pendingTransaction._id} title={pendingTransaction._id} description={`${pendingTransaction.amount} from ${pendingTransaction.sender} to ${pendingTransaction.receiver}`}></ListItem>
        ))
      )
    }
  }

  const formSubmit = async (e) => {
    e.preventDefault()
    try {
      const res = await api.post(`/expense/addtransaction`,
        {
          groupId: group._id,
          sender: inputSender,
          receiver: inputReceiver,
          amount: inputAmount,
          description: inputDescription
        }
      )
      setMessage(res.data)
      // console.log(res)
    }
    catch(error) {
      console.log(error)
      setMessage(error.message)
    }
  }

  return (
    <Container>
      <div>ID: {group._id}</div>
      <div>Creator: {group.creator}</div>
      <div>Title: {group.title}</div>
      <div>Members:</div>
      <div>Total amount spent: {group.totalSpent}</div>
      {members()}
      <div>Transactions:</div>
      {transactions()}
      <div>Pending transactions:</div>
      {pendingTransactions()}
      <div>New Transaction:</div>
      <input placeholder="Sender" value={inputSender} onInput={e => setInputSender(e.target.value)}/>
      <input placeholder="Receiver" value={inputReceiver} onInput={e => setInputReceiver(e.target.value)}/>
      <input placeholder="Amount" value={inputAmount} onInput={e => setInputAmount(e.target.value)}/>
      <input placeholder="Description" value={inputDescription} onInput={e => setInputDescription(e.target.value)}/>
      <button type="button" onClick={formSubmit}>Submit</button>
      <div>{message}</div>

    </Container>
    // <Grid columns={2} textAlign='left'>
    //   <Row>
    //     <Column>
    //       <Segment>
    //         <Header as='h1'>Group title: {title}</Header>
    //         <Header as='h2'>creator: {creator}</Header>
    //       </Segment>
    //     </Column>
    //     <Column>
    //       <Segment>
    //         <Header as='h2'>Members:</Header>
    //         <List divided relaxed>
    //           {members.map(member => (
    //             <Item key={member._id}>
    //               <Icon name='user' size='large' verticalAlign='middle' />
    //               <Content>
    //                 <Header>{member.nickname}</Header>
    //                 <Description>id: {member._id}</Description>
    //               </Content>
    //             </Item>
    //           ))}
    //           <Item>
    //             <Grid columns={3}>
    //               <Row>
    //                 <Column>
    //                   <Button onClick={addSelectedUserToGroup}>ADD</Button>
    //                   <Button onClick={removeUserFromGroup}>REMOVE</Button>
    //                 </Column>
    //                 <Column>
    //                   <Segment>
    //                     <Dropdown onChange={dropDownChange} fluid placeholder='Select a user' options={allUsers} />
    //                   </Segment>
    //                 </Column>
    //               </Row>
    //             </Grid>
    //           </Item>
    //         </List>
    //       </Segment>
    //     </Column>
    //   </Row>
    // </Grid>
  );
}

export default Group;
