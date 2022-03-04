import React,{ useState,useContext,useEffect  } from 'react';
import { Dropdown } from '.'
import useAxios from '../utility/useAxios'
import { AuthenticationContext } from '../contexts/AuthenticationContext'

export default function MyGroupsCreateGroup() {

    const [value, setValue] = useState(null);
    const [Users, setUsers] = useState([]);
    const [groupName, setGroupName] = useState("")
    const { sessionData } = useContext(AuthenticationContext)
    const api = useAxios()

    useEffect(async () => {
        try {
            const users = await api.get('/getusers')
            setUsers(users.data)
        } catch (err) {
            console.dir(err);
        }
    })

    const cloner = () => {
        let clone = []
        for (let i = 0; i < Users.length; i++) {
            if (Users[i]._id === sessionData.userId) { continue } //do not feed own ID in users to be added to group
            clone.push(Object.assign({}, Users[i]))
        }
        return clone;
    }

    const utilities = {
        tobeRemovedOption: cloner(),
        tobeRetrievedOption: [],
    }
    const onSubmitFunction = async () => {
        if (groupName == "") return null; //do nothing if there is no group name
        let newGroupID;// interestingly const doesn't work here
        try {
            newGroupID = await api.post('/groups/creategroup', { title: groupName }) //creates group and returns its ID
            //setShowCreate(false)
            setGroupName("")
            //setRefresh(prev => !prev)
        } catch (err1) {
            console.dir("CREATE GROUP ERROR- GROUPS: ", err1);
        }
        if (utilities.tobeRetrievedOption.length == 0) return null; //do not proceed to sending requests if no such option from user
        const createGroupObj = {
            recipient: utilities.tobeRetrievedOption.map(x => x._id),
            groupToJoin: newGroupID.data
        }
        try {
            await api.post('groups/createmultigrouprequests', createGroupObj)

        } catch (err2) {
            console.dir("CREATE REQUEST ERROR-GROUPS: ", err2);
        }
        // const maper=utilities.tobeRetrievedOption.map(x=>x._id)
        //     console.log("maper",maper)
    }

    const isActive = () => {
        if (groupName == "") return false;
        if (groupName !== "") return true;
    }
    return (
        <div>
            <div className="groups-left-menu">
                <div className="createnewgroupoptionsbox">
                    <div className='createnewgroupoptionsbox-Input'>
                        <input className="createnewgroupoptionsbox-Input-field" required="" type="text" 
                        onChange={(event) => setGroupName(event.target.value)}/>
                        <span className='floating-label'>Group name </span>
                    </div>
                    <Dropdown
                        options={utilities.tobeRemovedOption}
                        placeholder={"Invite friends (optional)"}
                        value={value}
                        setValue={setValue}
                        mapTo="nickname"
                        id="_id"
                        utilities={utilities}
                        displaynamesbox={1}
                        mouse={"mouseup"} />
                    <div className='createnewgroupoptionsbox-decisionbuttonsection'>
                        <button className={`createnewgroupoptionsbox-decisionbutton ${isActive ? "Active" : null}`} onClick={onSubmitFunction}>Create New Group </button>
                    </div>
                </div>
            </div>
        </div>
    )
}