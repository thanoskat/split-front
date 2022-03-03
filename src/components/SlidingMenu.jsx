import axios from 'axios'
import { useState, useEffect } from 'react'
import { Container, Button } from '.'
import "../style/SlidingMenu.css"

function SlidingMenu({ optionsArray, setOption, children, className, closeFunc }) {

  return (
    <div onAnimationEnd={() => console.log("ANIMATION END")}>
      <div onClick={closeFunc} className='sliding-menu-gray-box'/>
      <div className={'sliding-menu'}>
        <div className='sliding-menu-headline'>Are you sure??</div>
        {optionsArray.map((option, index) => (
          <Button key={index} text={option.text} icon={option.icon} onClick={() => setOption(index)}/>
        ))}
      </div>
    </div>
  );
}

export default SlidingMenu;
