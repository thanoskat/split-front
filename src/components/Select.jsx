import axios from 'axios'
import { useState, useEffect } from 'react'
import { Container, Button } from '.'
import "../style/Select.css"

function Select({ headline, rightHeadline, optionsArray, setOption, close }) {
  return (
    <div onAnimationEnd={() => console.log("ANIMATION END")}>
      <div onClick={close} className='select-gray-box'/>
      <div className={'select'}>
        <div className='select-headline-section'>
          <div className='select-headline'>{headline}</div>
          {rightHeadline && <div className='select-right-headline'>{rightHeadline}</div>}
        </div>
        <div className='select-button-section'>
          {optionsArray.map((option, index) => (
            <div key={index} className="select-button" onClick={() => setOption(index)}>
              {option.icon && <i className={`select-button-icon icon ${option.icon} select-button-icon-${option.iconColor}`}></i>}
              <div className='select-button-text'>{option.text}</div>
              {option.rightText && <div className='select-button-right-text'>{option.rightText}</div>}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Select;
