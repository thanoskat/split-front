import axios from 'axios'
import { useState, useEffect } from 'react'
import "../style/Input.css"

function Select({ optionsArray, setOption, children, className, closeFunc }) {
  return (
    <div onAnimationEnd={() => console.log("ANIMATION END")}>
      <div onClick={closeFunc} className='input-gray-box'/>
      <div className={'input'}>
        <div className='input-headline'>Create your group!!</div>
        <input className='input-field' placeholder="Group name"></input>
        <input className='input-field' placeholder="Description"></input>
      </div>
    </div>
  );
}

export default Select;
