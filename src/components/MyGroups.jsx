import { useState, useEffect, useContext } from 'react'
import { Link, useLocation, useHistory } from 'react-router-dom'
import { Dropdown } from "."
import useAxios from '../utility/useAxios'
import '../style/MyGroups.css';
import { GlobalStateContext } from '../contexts/GlobalStateContext'


function MyGroups() {


  // const [ownedGroups, setOwnedGroups] = useState([])
  const [value, setValue] = useState(null);
  const { activeIndex, setActiveIndex, belongtoGroups } = useContext(GlobalStateContext)

  const api = useAxios()
  const location = useLocation()
  const history = useHistory()

  useEffect(async () => {
    try {
      //const ownedGroups = await api.get("/groups/groupsbycreator")
      const pathIndex = parseInt(location.search.substring(location.search.indexOf("?") + 1))
      //setOwnedGroups(ownedGroups.data) //ownedGroups._id
      console.log(location) //!!!Investigate this and the useEffect in the GlobalContext
      console.log(activeIndex)
      console.log(pathIndex)
      if (isNaN(pathIndex)) {
        history.push(`/mygroups/${belongtoGroups[activeIndex]._id}?${activeIndex}`)
      } else {
        setActiveIndex(pathIndex)

      }
    }
    catch (error) {
      console.dir("GETUSERSERROR: ", error)
    }
  }, [location])


  const handleOnClick = (index, group) => {
    setActiveIndex(index);
  }

  // const cloner = () => {
  //   let clone = []
  //   for (let i = 0; i < belongtoGroups.length; i++) {
  //     clone.push(Object.assign({}, belongtoGroups[i]))
  //   }
  //   return clone;
  // }

  // const utilities = {
  //   tobeRemovedOption: cloner(),
  //   tobeRetrievedOption: [],
  // }
  //the reason option does not disappear from this component is because it rerenders due to SetValue (changes from dropdown)
  //If we want this to work we need to set the cloner to a component that does not render when dropdown states change and pass it from this component to the MyGroups as prop


  return (
    <div className='my-groups'>
      <div className="groups-left-menu">

        {/* <div className="groups-searchbar">
          <Dropdown
            options={utilities.tobeRemovedOption}
            setValue={setValue}
            mapTo="title"
            id="_id"
            utilities={utilities}
            placeholder={"search groups"}
            displaynamesbox={0}
            mouse={"click"}
          />

        </div> */}
        <div className="createnewgroupsection">
          <button className='createnewgroupbutton'>Create new group</button>
        </div>
        <div className="separator" role="separator">
        </div>
        <div className="groups-list">
          {belongtoGroups.map((group, index) => (
            <Link key={index} to={`/mygroups/${group._id}?${index}`}>
              <div
                key={index}
                onClick={() => handleOnClick(index, group)}
                className={activeIndex === index ? "active-individual-group" : "individual-group"}>
                <strong>{group.title}</strong>
              </div>
            </Link>
          ))}
        </div>
      </div>
      <div className="group-container">
        {activeIndex}
      </div>

    </div>
  );
}

export default MyGroups;
