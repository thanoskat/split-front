import axios from 'axios'
import { useState, useEffect, useContext } from 'react'
import { Container, Button, SelectBox, Form } from '.'
import "../style/MainTest.css"
import useAxios from '../utility/useAxios'
import { AuthenticationContext } from '../contexts/AuthenticationContext'

function MainTest() {

  const [showSelect, setShowSelect] = useState(false)
  const [showNewGroupForm, setShowNewGroupForm] = useState(false)
  const [option, setOption] = useState(0)
  const [members, setMembers] = useState([])
  const [isRight, setIsRight] = useState(true)
  const { sessionData } = useContext(AuthenticationContext)
  const api = useAxios()
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
    console.log(optionIndex)
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

  useEffect( () => {
    fetch()
  }, [])

  const fetch = async ()=>{
    const pulledtransactions = await api.get("/groups/619c30bcdd17753583bbe290")
    console.log(pulledtransactions.data.members)
    setMembers(pulledtransactions.data.members)
  }

  const cloner = () => { //replaced Users with members
    let clone = []
    for (let i = 0; i < members.length; i++) {
      if (members[i]._id === sessionData.userId) { continue } //do not feed own ID in users to be added to group
      clone.push(Object.assign({}, members[i]))
    }
    return clone;
  }

  const utilities = {
    tobeRemovedOption: cloner(),
    tobeRetrievedOption: [],
  }


  return (
    <div className='main-test'>
      <Button text={option} onClick={() => setShowSelect(true)} />
      <Button text={option} onClick={() => setShowNewGroupForm(true)} />
      {showSelect &&
        <SelectBox headline="Your groups" close={() => setShowSelect(false)}>
          {array1.map((item) => (
            <SelectBox.Button
              key={item.text}
              text={item.text}
              icon={item.icon}
              iconColor={item.iconColor}
              onClick={() => setOption(item.text)} />
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
          <Form.DropDownField
            utilities={utilities} />
        </Form>
      }
      <div>Created group name: {createdGroup.name}</div>
      <div>Created group description: {createdGroup.description}</div>
      <div>Members: {members.length>0? members[0].nickname:""}</div>
    </div>
  );
}

export default MainTest;
