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

  const array = ['ena', 'duo', 'tria', 'tessera']

  return (
    <div className='main-test'>
      <Button onClick={toggleMenu}>
        {option}
      </Button>
      <Button onClick={toggleMenu}>
        A Button!
      </Button>
      {showMenu && <SlidingMenu optionsArray={array} closeFunc={toggleMenu} setOption={setOptionAndClose}/>}
    </div>
  );
}

export default MainTest;
