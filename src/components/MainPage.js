import './mainpage.css'
import "./importedCSS.css"
import { ModalFrame } from '.'
import { useState } from "react";

function MainPage() {

    const [show, setShow] = useState(false);
    const [groupName, setGroupName] = useState("");

    return (
        <div className="main-page">
            <div className='box1'>
                box1
                <div className='homewidget'>
                    home widget
                    <div className='widget-header'>

                        <div className='group-selection-button'>
                            <button type="button" className="selection-button group-name-button  ">
                                <span className="group-title">
                                    {groupName}
                                </span>
                                <span className="button-position">
                                    <div className="button-layout">
                                        button
                                    </div>
                                </span>
                            </button>

                        </div>
                        <div className='option-buttons'>
                            <button className='option-button'>
                                <i className='user plus icon'></i>
                                Invite user
                            </button>
                            <button className='option-button'>
                                <i className='user times icon'></i>
                                Leave group
                            </button>
                            <button className='option-button'>
                                <span className="summary"></span>
                                Summary
                            </button>
                        </div>
                    </div>

                    <div className='widget-subheader'>
                        <span className="transactions-header">
                            Transactions
                        </span>
                    </div>
                    <div className='transaction-block'>
                        <button className="transaction-button">
                            <div className='image'>
                                <div className="image-background">
                                </div>
                            </div>
                            <span className='item-content'>
                                <span className="text-item-content">
                                    To Kristi
                                </span>
                            </span>
                            <span className='amount'>
                                10$
                            </span>
                        </button>

                    </div>
                    <div>


                        <button className='Xmple' onClick={() => setShow(true)}>
                            Open Modal
                            <i className='plus circle icon'>
                            </i>
                        </button>
                        <ModalFrame onClose={() => setShow(false)} show={show} setGroupName={setGroupName} />
                    </div>
                    <div>

                    </div>
                </div>
            </div>
            <div className="box2">
                box2
            </div>
            <div className="box3">
                box3
            </div>
            <div className="box4">
                box4
            </div>
            <div className="box5">
                box5
            </div>
        </div>

    )
}

export default MainPage;