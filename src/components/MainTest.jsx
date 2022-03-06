import axios from 'axios'
import { useState, useEffect } from 'react'
import { Container, Select, Input, Button, SelectBox, SelectButton, FormBox, FormInputField } from '.'
import "../style/MainTest.css"

function MainTest() {

  const [showSelect, setShowSelect] = useState(false)
  // const [showInput, setShowInput] = useState(false)
  const [option, setOption] = useState(0)

  const [newGroup, setNewGroup] = useState({
    show: false,
    name: '',
    description: '',
  })

  const changeNewGroup = (prop, value) => {
    newGroup[prop] = value
    setNewGroup({...newGroup})
  }

  const toggleSelect = () => {
    setShowSelect(!showSelect)
  }

  // const toggleInput = () => {
  //   setShowInput(!showInput)
  // }

  const setOptionAndClose = (optionIndex) => {
    console.log(optionIndex)
    setOption(optionIndex)
    setShowSelect(false)
  }

  const createNewGroup = () => {
    console.log("New group created")
    console.log(newGroup)
    setNewGroup({
      show: false,
      name: '',
      description: '',
    })
  }

  const array1 = [
    {
      text: 'Yes',
      icon: 'check circle outline',
      iconColor: 'green'
    },
    {
      text: 'No',
      icon: 'times circle outline',
      iconColor: 'red'
    },
    {
      text: 'What',
      icon: 'question',
      // iconColor: 'red'
    }
  ]

  return (
    <div className='main-test'>
      <Button text={option} onClick={toggleSelect}/>
      <Button text={option} onClick={e => changeNewGroup('show', !newGroup.show)}/>
      {showSelect &&
        <SelectBox headline="Your groups" close={toggleSelect}>
          {array1.map((item) => (
            <SelectButton key={item.text} text={item.text} icon={item.icon} iconColor={item.iconColor} onClick={() => setOptionAndClose(item.text)}/>
          ))}
        </SelectBox>
      }
      {newGroup.show &&
        <FormBox headline="Create a group" submit={createNewGroup} close={e => changeNewGroup('show', false)}>
          <FormInputField
            value={newGroup.name}
            label="Group name"
            maxLength={20}
            required={true}
            onChange={e => changeNewGroup('name', e.target.value)}
          />
          <FormInputField
            value={newGroup.description}
            label="Description"
            maxLength={100}
            required={false}
            onChange={e => changeNewGroup('description', e.target.value)}
          />
        </FormBox>
      }
    </div>
  );
}

export default MainTest;
