import axios from 'axios'
import { useState, useEffect } from 'react'
import { Container, Select, Input, Button } from '.'
import "../style/MainTest.css"

function MainTest() {

  const [showSelect, setShowSelect] = useState(false)
  const [showInput, setShowInput] = useState(false)
  const [option, setOption] = useState(0)

  const toggleSelect = () => {
    setShowSelect(!showSelect)
  }

  const toggleInput = () => {
    setShowInput(!showInput)
  }

  const setOptionAndClose = (optionIndex) => {
    setOption(optionIndex)
    setShowSelect(false)
  }

  const submitInputsAndClose = (inputs) => {
    console.log(inputs)
    setShowInput(false)
  }

  const array2 = [
    {
      text:'Enaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa',
      rightText: '1000$',
      icon:'exchange'
    },
    {
      text:'Tria',
      rightText: '1$',
      icon: 'file'
    },
    {
      text:'Tria',
      rightText: '10$',
      icon:'exchange'
    },
    {
      text:'TRIAAAAAAAAAAAAAAAAAA',
      rightText: '1000000$',
      icon:'exchange'
    },
    {
      text:'Pente',
      rightText: '10$',
      icon:'exchange'
    },
    {
      text:'Eksi',
      rightText: '10$',
      icon:'exchange'
    },
    {
      text:'Efta',
      rightText: '10$',
      icon:'exchange'
    },
    {
      text:'Oktw',
      rightText: '10$',
      icon:'exchange'
    },
    {
      text:'Ennia',
      rightText: '10$',
      icon:'exchange'
    },
    {
      text:'Deka',
      rightText: '10$',
      icon:'exchange'
    },
  ]

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

  const inputArray = [
    {
      label: 'Group name',
      required: true,
      maxLength: 20,
      userInput: ''
    },
    {
      label: 'Description',
      required: false,
      maxLength: 120,
      userInput: ''
    }
  ]


  return (
    <div className='main-test'>
      <Button text={option} onClick={toggleSelect}/>
      <Button text={option} onClick={toggleInput}/>
      {showSelect && <Select headline="Your groups" optionsArray={array2} setOption={setOptionAndClose} close={toggleSelect}/>}
      {showInput && <Input headline="Create a group" inputArray={inputArray} submit={submitInputsAndClose} close={toggleInput}/>}
    </div>
  );
}

export default MainTest;
