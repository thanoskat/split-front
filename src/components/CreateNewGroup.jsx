import React from 'react'
import { useState, useRef } from 'react'
import IonIcon from '@reacticons/ionicons'
import useAxios from '../utility/useAxios'
import store from '../redux/store'
import { useNavigate } from 'react-router-dom'

export default function CreateNewGroup({ setSearchParams }) {

  const [groupName, setGroupName] = useState('')
  const [loading, setLoading] = useState(false);
  const api = useAxios()
  const sessionData = store.getState().authReducer.sessionData
  const navigate = useNavigate()

  const createGroup = async () => {
    console.log("ran")
    setLoading(true)
    try {
      const group = await api.post("/groups/creategroup", {
        creatorID: sessionData.userId,
        title: groupName,
        groupTags: [{ name: "sdad", color: "sdafsdf" }]
      })
      console.log(group)
      setLoading(false)
      setSearchParams({})
      navigate(`${group.data}/expenses`)
    } catch (err) {
      setLoading(false)
      console.dir(err)
    }
  }

  return (
    <div className='createnewgroupBox flex column fixed ' style={{ left: "0px" }}>
      <div className='createnewgroupHeader flex row t1  padding1010 gap10'>
        <div className='cancelIcon alignself-center' onClick={() => setSearchParams({})}>
          <i className='arrow left icon t3'></i>
        </div>
        <div>
          Create New Group
        </div>
        <div className='separator-0' />
      </div>
      <div className='inputsAndOptions-container flex column gap10 padding1010'>
        <input
          className='styledInput t3'
          placeholder='Group Name'
          value={groupName}
          onChange={e => setGroupName(e.target.value)}
          spellCheck='false'
        />
        <div>
          Group currency
        </div>
        <div>
          create labels
        </div>

      </div>






      <div className='submit-button-container flex padding1010'>
        <button
          className={`shadow submit-button ${groupName !== "" ? "active" : null} h-flex justcont-spacearound `}
          onClick={createGroup}
          disabled={groupName !== "" ? false : true}>
          {loading ? <IonIcon name='sync' className='t3 spin' /> : "Create Group"}
        </button>
      </div>
    </div>
  )
}
