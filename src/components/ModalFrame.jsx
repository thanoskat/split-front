import React from 'react'
import "../style/ModalFrame.css"
// import { useState, useEffect } from "react";
// import { Link} from 'react-router-dom';



export default function ModalFrame({ show, onClose, content,header}) {

  //modal is the whole thing (with grey area in the background)
  //so it stops propagating only inside the content
  //and only executes in other areas left (which is the outside)
  //https://stackoverflow.com/questions/28314368/how-to-maintain-state-after-a-page-refresh-in-react-js
  return (
   
        <div>
          <div className={`modal ${show ? "show" : ""}`} onClick={onClose}>
            <div role="dialog" aria-modal="true" aria-labelledby="header-label-20" aria-describedby="header-desc-20" className="main" onClick={e => e.stopPropagation()}>
              <div className="box-widget">
                <div className="header">
                  <div className="header-content">
                    <strong>{header}</strong>
                  </div>
                </div>
                <div className="divider">
                </div>
                <div className="total">
                  <strong>Total</strong>
                </div>
                <div className="groups-content">
                  <div className="content-box">
                    <div className="individual-button-content">
                      {content}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
  )
}
