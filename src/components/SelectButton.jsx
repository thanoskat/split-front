import axios from 'axios'
import { useState, useEffect } from 'react'
// import { Container, Button } from '.'
import "../style/Select.css"

function SelectButton({ text, icon, iconColor, rightText, onClick }) {
  return (
    <div className="select-button" onClick={onClick}>
      {icon && <i className={`select-button-icon icon ${icon} select-button-icon-${iconColor}`}></i>}
      <div className='select-button-text'>{text}</div>
      {rightText && <div className='select-button-right-text'>{rightText}</div>}
    </div>
  );
}

export default SelectButton;
