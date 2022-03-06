import axios from 'axios'
import { useState, useEffect } from 'react'
import "../style/SelectBox.css"

// TODO out animation before close

function SelectBox({ headline, rightHeadline, close, children }) {
  return (
    <div onAnimationEnd={() => console.log("ANIMATION END")}>
      <div onClick={close} className='select-gray-box'/>
      <div className={'select-box'}>
        <div className='select-headline-section'>
          <div className='select-headline'>{headline}</div>
          {rightHeadline && <div className='select-right-headline'>{rightHeadline}</div>}
        </div>
        <div className='select-button-section'>
          {children}
        </div>
      </div>
    </div>
  );
}

function Button({ text, icon, iconColor, rightText, onClick }) {
  return (
    <div className="select-button" onClick={onClick}>
      {icon && <i className={`select-button-icon icon ${icon} select-button-icon-${iconColor}`}></i>}
      <div className='select-button-text'>{text}</div>
      {rightText && <div className='select-button-right-text'>{rightText}</div>}
    </div>
  );
}

SelectBox.Button = Button
export default SelectBox
