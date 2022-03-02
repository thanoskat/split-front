import axios from 'axios'
import { useState, useEffect } from 'react'
import { Container, Button } from '.'
import "../style/SlidingMenu.css"

function SlidingMenu({ optionsArray, setOption, children, className, closeFunc }) {

  return (
    <div onAnimationEnd={() => console.log("ANIMATION END")}>
      <div onClick={closeFunc} className='gray-box'/>
      <Container className={className ? `sliding-menu ${className}` : 'sliding-menu'}>
        {optionsArray.map((option, index) => (
          <Button key={index} onClick={() => setOption(index)}>
            {option}
          </Button>
        ))}
      </Container>
    </div>
  );
}

export default SlidingMenu;
