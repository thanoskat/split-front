import { useState, useEffect } from "react";
import useAxios from '../utility/useAxios';
import '../style/SelectGroups.css'
import {Link } from "react-router-dom";


export default function SelectGroup({refreshGroupList,activeIndex,setActiveIndex,setShow}) {

const [groupInfo, setGroupInfo] = useState([]);
const api = useAxios()

  useEffect(async () => {
    try {
      //This is specific to the Users schema when
      //feeding info for groupname and total
      //although they are sourced from
      //the group Schema with populate.
      const response = await api.get('/getusers/profile');
      setGroupInfo(response.data.groups)
    } catch (err) {
      console.dir("group info error", err);
    }

  }, [refreshGroupList])

  const handleOnClick = (index, group) => {
    setActiveIndex(index);
    setShow(false)
  };

  return (
<div>
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
          <strong>{group.title}</strong>
        </span>
        <span className="group-total">
          <strong>{group.totalSpent}</strong>
        </span>
      </button>
    </Link>))}
</div>
)}
