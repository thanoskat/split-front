import React from 'react'
import './mainpage.css'
import './importedCSS.css'
import { NavigationBar } from '.'
import {Modal} from '.'

function MainPage() {
    const groupname = "group name"
    return (


        <div className="main-page">
            <div className='box1'>
                box1
                <div className='homewidget'>
                    home widget
                    <div className='widget-header'>

                        <div className='group-selection-button'>
                            <button type="button" class="selection-button group-name-button  ">
                                <span class="group-title">
                                    {groupname}
                                </span>
                                <span class="button-position">
                                    <div class="button-layout">
                                        button
                                    </div>
                                </span>
                            </button>

                        </div>
                        <div className='option-buttons'>
                            <button className='option-button'>
                            <i class='user plus icon'></i>
                                 Invite user
                                 </button>
                            <button className='option-button'> 
                            <i class='user times icon'></i>
                            Leave group
                            </button>
                            <button className='option-button'>
                            <span className="summary"></span>
                                 Summary
                                 </button>
                        </div>
                    </div>

                    <div className='widget-subheader'>
                        <span class="transactions-header">
                            Transactions
                        </span>
                    </div>
                    <div className='transaction-block'>
                        <button class="transaction-button">
                            <div className='image'>
                                <div class="image-background">
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
                    <i class='plus circle icon'>
                        
                    </i>
                    <div>
                        <Modal/>
                    </div>
                </div>
            </div>
            <div class="box2">
                box2
            </div>
            <div class="box3">
                box3
            </div>
            <div class="box4">
                box4
            </div>
            <div class="box5">
                box5
            </div>
        </div>

    )
}

export default MainPage;