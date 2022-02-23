import React from 'react'
import "../style/Modal.css";

export default function Modal({ children, onClose, show, handleOnClick, className, ActionButtonMessage, HeaderMessage,ShowCancel,isActive}) {

  
    if (!show) {
        return null
    }

    return (
        <div className={`Modal ${className}`} onClick={onClose}>
            <div className={`Modal-content ${className}`} onClick={e => e.stopPropagation()}>
                <div className={`Modal-header ${className}`}>
                    <h4 className={`Modal-title ${className}`}>{HeaderMessage}</h4>
                    <button className={`Modal-exit-button ${className}`} onClick={onClose}>
                        <i className="times icon x"></i>
                    </button>

                </div>
                <div className={`Modal-body ${className}`}>
                    {children}
                   
                </div>
                <div className={`Modal-decision-buttons ${className}`}>
                    <button className= {`Modal-decison-button ${className} ${isActive? "Active":null}`} onClick={handleOnClick}>{ActionButtonMessage} </button>
                    {ShowCancel?<button className= {`Modal-decison-button ${className}`} onClick={onClose}>Cancel</button>:<></>}
                </div>
            </div>
        </div>
    )
}
