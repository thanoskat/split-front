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

  const array = [
    {
      text:'Ena',
      icon:'exchange'
    },
    {
      text:'Tria',
      icon: 'file'
    },
    {
      text:'Tria',
      icon:'exchange'
    },
    {
      text:'TRIA',
      icon:'exchange'
    },
    {
      text:'Pente',
      icon:'exchange'
    },
    {
      text:'Eksi',
      icon:'exchange'
    },
    {
      text:'Efta',
      icon:'exchange'
    },
    {
      text:'Oktw',
      icon:'exchange'
    },
    {
      text:'Ennia',
      icon:'exchange'
    },
    {
      text:'Deka',
      icon:'exchange'
    },
  ]

  const array2 = [
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
      <Button text={option} onClick={toggleInput}/>
      {showSelect && <Select optionsArray={array2} closeFunc={toggleSelect} setOption={setOptionAndClose}/>}
      {showInput && <Input optionsArray={array2} closeFunc={toggleInput} setOption={setOptionAndClose}/>}
    </div>
  );
}

export default MainTest;
