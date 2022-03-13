// import axios from 'axios'
import useAxios from '../utility/useAxios'
import axios from 'axios'
import { useState, useEffect, useRef } from 'react'
import { Container, Button, SelectBox, Form } from '.'
import "../style/MainTest.css"

function MainTest() {

  const api = useAxios()
  const baseURL = 'http://localhost:4000'

  const [showSelect, setShowSelect] = useState(false)
  const [showNewGroupForm, setShowNewGroupForm] = useState(false)
  const [option, setOption] = useState(0)
  const [isRight, setIsRight] = useState(true)
  const [groups, setGroups] = useState()
  const [testResponse, setTestResponse] = useState('')

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
    setNewGroup({...newGroup})
  }


  const setOptionAndClose = (optionIndex) => {
    console.log(optionIndex)
    setOption(optionIndex)
    setShowSelect(false)
  }

  const createNewGroup = () => {
    setCreatedGroup({...newGroup})
    setNewGroup({
      name: '',
      description: '',
    })
  }

  // const [abortController, setAbortController] = useState(new AbortController())
  const abortControllerRef = useRef(new AbortController())
  const [reqPending, setReqPending] = useState(false)

  console.log("Rerender!")

  const getData = async (abortController) => {
    const axiosInstance = axios.create({
      baseURL: 'http://localhost:4000'
    })

    try {
      setReqPending(true)
      setTestResponse('Waiting for response...')
      const res = await axiosInstance.get('/test', { signal: abortController.signal })
      setReqPending(false)
      setTestResponse(res.data)
    }
    catch(error) {
      console.log('/test get error')
      console.log(error)
    }
  }

  const getGroups = async () => {
    try {
      setGroups([{title: 'Loading'}])
      const myGroups = await api.get('/groups/mygroups', { signal: abortControllerRef.current.signal });
      console.log(myGroups.data)
      setGroups(myGroups.data)
    }
    catch(error) {
      console.log('/test get error')
      console.log(error)
    }
  }

  // useEffect(() => {
  //   getData(abortController)

  //   return () => {
  //     console.log("Unmount")
  //     abortController.abort()
  //   }

  // },[])

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
  //   setTestResponse('Waiting for response...')
  //   getData(abortController)
  }

  const cancelTest = () => {
  //   console.log(typeof(abortController.signal.aborted))
  //   if(reqPending) {
  //     setTestResponse('Request canceled')
  //     abortController.abort()
  //   }
  //   console.log(abortController)
  }

  return (
    <div className='main-test'>
      <Button text={option} onClick={() => setShowSelect(true)}/>
      <Button text={option} onClick={() => setShowNewGroupForm(true)}/>
      {showSelect &&
        <SelectBox headline="Your groups" close={() => setShowSelect(false)}>
          {groups.map((group) => (
            <SelectBox.Button
              key={group._id}
              text={group.title}
              // iconColor={item.iconColor}
              onClick={() => setOption(group._id)}/>
          ))}
        </SelectBox>
      }
      {showNewGroupForm &&
        <Form headline="Create a group" submit={createNewGroup} close={() => setShowNewGroupForm(false)}>
          <Form.InputField
            value={newGroup.name}
            label="Group name"
            maxLength={20}
            required={true}
            onChange={e => changeNewGroup('name', e.target.value)}
            clear={e => changeNewGroup('name', '')}
          />
          <Form.InputField
            value={newGroup.description}
            label="Description"
            maxLength={100}
            required={false}
            onChange={e => changeNewGroup('description', e.target.value)}
            clear={e => changeNewGroup('description', '')}
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
