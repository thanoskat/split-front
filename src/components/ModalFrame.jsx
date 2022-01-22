import React from 'react'
import "../style/ModalFrame.css"
import { useState, useEffect } from "react";
import { Link} from 'react-router-dom';


export default function ModalFrame({ show, onClose, setGroupName, groupInfo, setGroupID, activeIndex, setActiveIndex}) {

  
  const [groupData, setGroupData] = useState([]);


  const handleOnClick = (index, group) => {
    setActiveIndex(index);
    setGroupData(group);
    setGroupID(group._id);
    onClose();
  };
  // No dependecies = Run after every render
  // Empty [] dependencies = Run only after first render


  useEffect(() => {
    setGroupName(groupData.title)

  }, [groupData.title])

  // useEffect(() => {
  //   setActiveIndex(refreshIndex)

  // }, [refreshIndex])

  // if(!show){
  //     return null;
  // }

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
                      {groupInfo.map((group, index) => (
                        <Link key={index} className='aTag' to={`/main/${group._id}?${index}`}>
                          <button area-pressed="true"

                            key={index}
                            onClick={() => handleOnClick(index, group)}
                            className={activeIndex === index ? "modal-button-active" : "group-button"}>

                            <div className="group-avatar">
                              <div className="image-background">
                              </div>
                            </div>
                            <span className="group-header ">
                              {group.title}

                            </span>
                            <span className="group-total">
                              $156
                            </span>
                          </button>
                        </Link>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      
    
  )
}
