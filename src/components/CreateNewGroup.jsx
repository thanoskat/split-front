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
  const [newMode, setNewMode] = useState(false)
  const [labelName, setLabelName] = useState("")
  const [newLabel, setNewLabel] = useState([])


  const createGroup = async () => {
    console.log("ran")
    setLoading(true)
    try {
      const group = await api.post("/groups/creategroup", {
        creatorID: sessionData.userId,
        title: groupName,
        groupTags: newLabel
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

  const cancelNewMode = () => {
    setNewLabel([...newLabel])
    setLabelName("")
    setNewMode(false)
  }


  const createNewLabel = () => {
    const existingNames = (newLabel?.map(label => label.name))
    if (existingNames?.includes(labelName)) return
    const defaultColors = [
      'label-color-0',
      'label-color-1',
      'label-color-2',
      'label-color-3',
      'label-color-4',
      'label-color-5',
      'label-color-6',
      'label-color-7',
    ]
    const defaultColorsUsed = newLabel?.map(label => label.color)
    const firstAvailableColor = defaultColors.filter(color => !defaultColorsUsed.includes(color))[0]
    setNewLabel([...newLabel, { name: labelName, color: firstAvailableColor }])
    setLabelName("")
  }

  const deleteLabel = (label) => {
    setNewLabel(newLabel.filter(newlabel => newlabel.name !== label.name))
  }

  const LabelItem = ({ label }) => {
    return (
      <div className='flex row justcont-spacebetween alignitems-center' style={{ height: 'fit-content' }}>
        <div className={`pill filled t5 shadow test `}
          style={{ '--pill-color': `var(--${label.color})` }}
        >{label.name}</div>
        <div className='flex row gap10'>
        </div>
        <div style={{ fontSize: "25px", cursor: "pointer" }} onClick={() => deleteLabel(label)}>
          <i className='icon delete' ></i>
        </div>

      </div>
    )
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
        <div className="flex column" style={{ marginTop: "15px" }}>
          <div className="whiteSpace-initial" style={{ margin: "0px 0px 15px 0px", fontSize: "20px" }}>Select currency</div>
          <div style={{ backgroundColor: "#121214", padding: "0.8rem" , borderRadius:"4px", width:"5rem", cursor:"pointer" }}>
            <div className='currency-ticker-section' style={{ position: "relative", justifyContent: "flex-start", left: "0px" }}>
              <i className='angle down icon'></i>
              <div className='currency-ticker'>EUR </div>
            </div>
          </div>
        </div>
        <div style={{ marginTop: "10px", fontSize: "20px" }}>
          Create labels
        </div>
        <div className="whiteSpace-initial" style={{ margin: "0px 0px 15px 0px" }}>
          Labels can help you group, filter and organise your expenses.
        </div>

        {newLabel?.map((label) => (
          <LabelItem label={label} />
        ))}

        {!newMode &&
          <div style={{ color: "var(--light-color)", borderColor: "var(--label-color-6)", backgroundColor: "var(--label-color-6)", alignSelf:"auto" }} 
          className='pill t5 empty pointer shadow' onClick={() => setNewMode(true)}>Create new label</div>}
        {newMode &&
          <div className='flex row justcont-spacebetween'>
            <input
              type='text'
              value={labelName}
              className='pill empty editable t5 shadow'
              style={{ width: '100px', '--pill-color': `white` }}
              autoFocus
              onChange={(e) => setLabelName(e.target.value)}
            />
            <div className='flex row gap10 pointer'>
              <div className='pill t5' onClick={cancelNewMode}>Cancel</div>
              <div className='pill t5' onClick={() => createNewLabel()}>
                Create
              </div>
            </div>
          </div>
        }


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