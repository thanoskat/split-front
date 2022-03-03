import React from 'react'
import "../style/Button.css"

function Button({ text, icon, iconColor, key, onClick }) {
  return (
    <div key={key} className="individual-button" onClick={onClick}>
      {icon && <i className={`individual-button-icon icon ${icon} ${iconColor}-icon`}></i>}
      <div className='individual-button-text'>{text}</div>
    </div>
  )
}

export default Button;
