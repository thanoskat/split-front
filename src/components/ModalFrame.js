import React from 'react'
import "./modalframe.css"
import { useState } from "react";

export default function ModalFrame() {

    const [activeIndex, setActiveIndex] = useState(0);;

    const handleOnClick = index => {
        setActiveIndex(index);
    };


    return (
        <div>
            <div role="dialog" aria-modal="true" aria-labelledby="header-label-20" aria-describedby="header-desc-20" className="main">
                <div className="box-widget">

                    <div className="header">
                        <div className="header-content">
                            Groups
                        </div>
                    </div>

                    <div className="divider">
                        divider
                    </div>
                    <div className="total">
                        Total
                    </div>
                    <div className="groups-content">
                        <div className="content-box">
                            <div className="individual-button-content">
                                <button area-pressed="true" onClick={() => handleOnClick(1)} className={activeIndex === 1 ? "active" : "group-button"}>
                                    <div className="group-avatar">
                                        <div className="image-background">
                                        </div>
                                    </div>
                                    <span className="group-header ">
                                        Group 1
                                    </span>
                                    <span className="group-total">
                                        $156
                                    </span>
                                </button>
                                <button onClick={() => handleOnClick(2)} className={activeIndex === 2 ? "active" : "group-button"}>
                                    <div className="group-avatar">
                                        <div className="image-background">
                                        </div>
                                    </div>
                                    <span className="group-header">
                                        Group 2
                                    </span>
                                    <span className="group-total">
                                        $1
                                    </span>
                                </button>
                                <button onClick={() => handleOnClick(3)} className={activeIndex === 3 ? "active" : "group-button"}>
                                    <div className="group-avatar">
                                        <div className="image-background">
                                        </div>
                                    </div>
                                    <span className="group-header">
                                        Group 3
                                    </span>
                                    <span className="group-total">
                                        $65
                                    </span>
                                </button>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    )
}
