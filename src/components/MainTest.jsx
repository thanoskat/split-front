import axios from 'axios'
import { useState, useEffect, useRef, useContext } from 'react'
import { Container, Button, SelectBox, Form } from '.'
import "../style/MainTest.css"
import useAxios from '../utility/useAxios'
// import { AuthenticationContext } from '../contexts/AuthenticationContext'

function MainTest() {

  const api = useAxios()
  const baseURL = 'http://localhost:4000'

  const [showSelect, setShowSelect] = useState(false)
  const [showNewGroupForm, setShowNewGroupForm] = useState(false)
  const [option, setOption] = useState(0)
  const [members, setMembers] = useState([])
  const [isRight, setIsRight] = useState(true)
  const [groups, setGroups] = useState()
  const [testResponse, setTestResponse] = useState('')
  // const { sessionData } = useContext(AuthenticationContext)
  const [createdGroup, setCreatedGroup] = useState({
    name: '',
    description: '',
  })

  const [newGroup, setNewGroup] = useState({
    name: '',
    description: '',
  })

  const changeNewGroup = (prop, value) => {
    newGroup[prop] = value
    setNewGroup({ ...newGroup })
  }


  const setOptionAndClose = (optionIndex) => {
    // console.log(optionIndex)
    setOption(optionIndex)
    setShowSelect(false)
  }

  const createNewGroup = () => {
    setCreatedGroup({ ...newGroup })
    setNewGroup({
      name: '',
      description: '',
    })
  }

  // const [abortController, setAbortController] = useState(new AbortController())
  const abortControllerRef = useRef(new AbortController())

  // console.log("Render !")

  const getData = async (abortController) => {
    const axiosInstance = axios.create({
      baseURL: 'http://localhost:4000'
    })

    abortControllerRef.current.abort()
    // const currentAbortController = new AbortController()
    abortControllerRef.current = new AbortController()

    try {
      setTestResponse('Waiting for response...')
      const res = await api.get('/test', { signal: abortControllerRef.current.signal })
      setTestResponse(res.data)
    }
    catch(error) {
      // console.log('/test get error')
      // console.log(error)
    }
  }

  const getGroups = async () => {
    try {
      setGroups([{title: 'Loading'}])
      const myGroups = await api.get('/groups/mygroups', { signal: abortControllerRef.current.signal });
      // console.log(myGroups.data)
      setGroups(myGroups.data)
    }
    catch(error) {
      // console.log('/test get error')
      // console.log(error)
    }
  }

  useEffect(() => {
    getGroups()

    return () => {
      console.log("Unmount")
      abortControllerRef.current.abort()
    }

  },[])

  const array1 = [
    {
      text: 'Yes',
      icon: 'check outline circle ',
      iconColor: 'green'
    },
    {
      text: 'No',
      icon: 'times outline circle',
      iconColor: 'red'
    },
    {
      text: 'What',
      icon: 'question outline circle',
      // iconColor: 'red'
    }
  ]

  const stats = [
    {name: 'CREATED AT', value: '23 Jan'},
    {name: 'LAST ACTIVITY', value: '3 hours ago'},
    {name: 'MEMBERS', value: '12'},
    // {name: 'CREATED BY', value: 'Wasili'},
    {name: 'TOTAL SPENT', value: '$540'},
  ]


  const requestTest = async () => {
    setTestResponse('Waiting for response...')
    getData(abortControllerRef.current)
  }

  const cancelTest = () => {
    setTestResponse('Request canceled')
    abortControllerRef.current.abort()
  }
  return (
    <div className='main-test'>
      <Button text={option} onClick={() => setShowSelect(true)} />
      <Button text={option} onClick={() => setShowNewGroupForm(true)} />
      {showSelect &&
        <SelectBox headline="Your groups" close={() => setShowSelect(false)}>
          {groups.map((group) => (
            <SelectBox.Button
              key={group._id}
              text={group.title}
              iconColor={array1.iconColor}
              onClick={() => setOption(group._id)}/>
          ))}
        </SelectBox>
      }
      {showNewGroupForm &&
        <Form headline="Create a group" submit={createNewGroup} close={() => setShowNewGroupForm(false)} >
          <Form.InputField
            value={newGroup.name}
            label="Group name"
            maxLength={20}
            required={true}
            onChange={e => changeNewGroup('name', e.target.value)}
            clear={e => changeNewGroup('name', '')}
          />
        </Form>
      }
    <div>Created group name: {createdGroup.name}</div>
    <div>Created group description: {createdGroup.description}</div>
    <div className='group-card'>
      <div className='group-name'>
        Grooopie
      </div>
      <div className='group-stats'>
        {stats.map((stat, index) => (
          <div key={index} className='group-stat'>
            <div className='group-stat-name'>
              {stat.name}
            </div>
            <div className='group-stat-value' style={{textAlign: `${index<stats.length/2 ? 'left' : 'right'}`}}>
              {stat.value}
            </div>
          </div>
        ))}
      </div>
    </div>
    <div onClick={requestTest}>SEND TEST REQUEST</div>
    <div>{testResponse}</div>
    <div onClick={cancelTest}>CANCEL TEST REQUEST</div>
    </div>
  );
}

export default MainTest;
