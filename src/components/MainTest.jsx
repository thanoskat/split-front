import axios from 'axios'
import { useState, useEffect } from 'react'
import { Container, Button, SelectBox, Form } from '.'
import "../style/MainTest.css"

function MainTest() {

  const [showSelect, setShowSelect] = useState(false)
  const [showNewGroupForm, setShowNewGroupForm] = useState(false)
  const [option, setOption] = useState(0)
  const [isRight, setIsRight] = useState(true)

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

  return (
    <div className='main-test'>
      <Button text={option} onClick={() => setShowSelect(true)}/>
      <Button text={option} onClick={() => setShowNewGroupForm(true)}/>
      {showSelect &&
        <SelectBox headline="Your groups" close={() => setShowSelect(false)}>
          {array1.map((item) => (
            <SelectBox.Button
              key={item.text}
              text={item.text}
              icon={item.icon}
              iconColor={item.iconColor}
              onClick={() => setOption(item.text)}/>
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
    </div>
  );
}

export default MainTest;
