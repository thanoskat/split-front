import axios from 'axios'
import { useState, useEffect } from 'react'
import { Container, SlidingMenu, Button } from '.'
import "../style/MainTest.css"

function MainTest() {

  const [showMenu, setShowMenu] = useState(false)
  const [option, setOption] = useState(0)

  const toggleMenu = () => {
    setShowMenu(!showMenu)
  }

  const setOptionAndClose = (optionIndex) => {
    setOption(optionIndex)
    setShowMenu(false)
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
      icon: 'check circle outline'
    },
    {
      text: 'No',
      icon: 'times circle outline'
    }
  ]

  return (
    <div className='main-test'>
      <Button text={option} onClick={toggleMenu}/>
      <Button text={option} onClick={toggleMenu}/>
      {showMenu && <SlidingMenu optionsArray={array2} closeFunc={toggleMenu} setOption={setOptionAndClose}/>}
    </div>
  );
}

export default MainTest;
