import React from 'react'
import "../style/Modal.css";

export default function Modal({ children, onCloseModal, showModal, onClickFunctions }) {

    const functs = () => {
        Object.values(onClickFunctions).map(value => {
            if (typeof value === 'function') {
                value.call();
            }
        })
    };

    const handleOnClick = () => {
        functs();
        onCloseModal();
    };

    if (!showModal) {
        return null
    }

    return (
        <div className="Modal" onClick={onCloseModal}>
            <div className="Modal-content" onClick={e => e.stopPropagation()}>
                <div className="Modal-header">
                    <h4 className="Modal-title">Header</h4>
                    <button className="Modal-exit-button" onClick={onCloseModal}>
                        <i className="times icon x"></i>
                    </button>

                </div>
                <div className="Modal-body">
                    {children}
                    Modal Body where children will be rendered
                </div>
                <div className="Modal-decision-buttons">
                    <button className="Modal-decison-button" onClick={handleOnClick}>on Click action </button>
                    <button className="Modal-decison-button" onClick={onCloseModal}>Cancel</button>
                </div>
            </div>
        </div>
    )
}
