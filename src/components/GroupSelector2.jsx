import { useState, useEffect, useRef } from 'react'
import store from '../redux/store'
import { useDispatch } from 'react-redux'
import { setSelectedGroup } from '../redux/mainSlice'
import useAxios from '../utility/useAxios'
import populateLabels from '../utility/populateLabels'
import IonIcon from '@reacticons/ionicons'
import { useSearchParams } from 'react-router-dom'

const GroupSelector2 = () => {

  const dispatch = useDispatch()
  const api = useAxios()
  const abortControllerRef = useRef(null)

  const selectedGroup = store.getState().mainReducer.selectedGroup

  const [isLoading, setLoading] = useState(false)
  const [clickedIndex, setClickedIndex] = useState()
  const [searchParams, setSearchParams] = useSearchParams()
  const [groupList, setGroupList] = useState()

  const getGroups = async () => {
    try {
      const response = await api.get('/groups/mygroups', { signal: abortControllerRef.current.signal });
      console.log("/groups/mygroups", response.data)
      setGroupList(response.data)
    }
    catch (error) {
      console.log(error.message)
    }
  }

  useEffect(() => {
    abortControllerRef.current = new AbortController()
    getGroups()
    return () => {
      abortControllerRef.current.abort()
    }
  },[])

  const setDisplayedGroupAndClose = async (index) => {
    if(!isLoading) {
      setClickedIndex(index)
      setLoading(true)
      try {
        const res = await api.post('/groups/getgroup', { groupid: groupList[index]._id }, { signal: abortControllerRef.current.signal })
        const group = populateLabels(window.structuredClone(res.data))
        setLoading(false)
        dispatch(setSelectedGroup(group))
        setSearchParams({})
      }
      catch(error) {
        console.log('setDisplayedGroupAndClose', error)
      }
    }
  }

  return (
    <div className='group-selector top-radius' style={{zIndex: '2'}}>
      <div className='flex row t05 justcont-center alignitems-center padding4'>Group</div>
      {/* <div className='separator-0'/> */}
      <div className='flex column gap4 padding4'>
        {groupList?.map((group, index) => (
            <div
            key={index}
            className={`${group._id === selectedGroup?._id ? 'highlighted-group' : ''} group-selector-button medium flex row overflow-hidden justcont-spacebetween alignitems-center t3 padding1812 pointer shadow`}
            onClick={() => setDisplayedGroupAndClose(index)}>
              <div>{group.title}</div>
              {isLoading && clickedIndex === index && <IonIcon name='sync' className='t3 spin'/>}
              {clickedIndex !== index &&
              <div className='regular flex row t3 gap6 alignitems-center'>
                <IonIcon name='people-sharp' />
                <div>{group.members.length}</div>
              </div>
              }
            </div>
        ))}
      </div>
    </div>
  );
}

export default GroupSelector2
