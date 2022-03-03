import axios from 'axios'
import { useState, useEffect } from 'react'
import { Container, Button } from '.'
import "../style/Select.css"

function Select({ optionsArray, setOption, children, className, closeFunc }) {
  return (
    <div onAnimationEnd={() => console.log("ANIMATION END")}>
      <div onClick={closeFunc} className='select-gray-box'/>
      <div className={'select'}>
        <div className='select-headline'>Are you sure??</div>
        {optionsArray.map((option, index) => (
          <div key={index} className="select-button" onClick={() => setOption(index)}>
            {option.icon && <i className={`select-button-icon icon ${option.icon} select-button-icon-${option.iconColor}`}></i>}
            <div className='select-button-text'>{option.text}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Select;
