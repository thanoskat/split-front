import React from 'react'
import "../style/Button.css"

export default function Button({index,children, onClick}) {
  return (
    <div key={index} className="individual-button" onClick={onClick}>
        <strong>{children}</strong>
    </div>
  )
}

