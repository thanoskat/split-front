import axios from 'axios'
import { useState, useEffect } from 'react'
import { Container, Button } from '.'
import "../style/Select.css"

function Select({ headline, rightHeadline, optionsArray, setOption, close, mapOn}) {
  return (
    <div onAnimationEnd={() => console.log("ANIMATION END")}>
      <div onClick={close} className='select-gray-box'/>
      <div className='select select-animation-bottomslide'>
        <div className='select-headline-section'>
          <div className='select-headline'>{headline}</div>
          {rightHeadline && <div className='select-right-headline'>{rightHeadline}</div>}
        </div>
        <div className='select-button-section'>
          {optionsArray.map((option, index) => (
            <div key={index} className="select-button" onClick={() => setOption(index)}>
              {option[mapOn.icon] && <i className={`select-button-icon icon ${option[mapOn.icon]} select-button-icon-${option[mapOn.iconColor]}`}></i>}
              <div className='select-button-text'>{option[mapOn.text]}</div>
              {option[mapOn.rightText] && <div className='select-button-right-text'>{option[mapOn.rightText]}</div>}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Select;
