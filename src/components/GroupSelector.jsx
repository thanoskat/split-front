import { useState, useEffect, useRef, useContext } from 'react'
import { SlidingBox } from './'
import { SlidingBoxContext } from '../contexts/SlidingBoxContext'
import useAxios from '../utility/useAxios'
import IonIcon from '@reacticons/ionicons';

const GroupSelector = ({ close, groupList, setDisplayedGroup }) => {

  const api = useAxios()
  const [isLoading, setLoading] = useState(false)
  const [clickedIndex, setClickedIndex] = useState()
  const [highlightedIndex, setHighlightedIndex] = useState()
  const { closeBox } = useContext(SlidingBoxContext)

  const abortControllerRef = useRef(null)

  useEffect(() => {
    abortControllerRef.current = new AbortController;
    return () => {
      abortControllerRef.current.abort()
    }
  },[])

  const setDisplayedGroupAndClose = async (index) => {
    setClickedIndex(index)
    setLoading(true)
    try {
      const res = await api.post('/groups/getgroup', { groupid: groupList[index]._id }, { signal: abortControllerRef.current.signal })
      setDisplayedGroup(res.data)
      setLoading(false)
      closeBox()
    }
    catch(error) {
      console.log('setDisplayedGroupAndClose', error)
    }
    finally {
    }
  }

  return (
    <SlidingBox close={close} className='group-selector top-radius'>
      <div className='flex row t1 justcont-center alignitems-center padding4'>Group</div>
      <div className='separator-0'/>
      <div className='flex column gap4 padding4'>
        {groupList?.map((group, index) => (
            <div
            key={index}
            className='medium flex row overflow-hidden justcont-spacebetween alignitems-center t3 button-11 padding1812 pointer shadow'
            onClick={() => setDisplayedGroupAndClose(index)}>
              <div>{group.title}</div>
              {isLoading && clickedIndex == index && <IonIcon name='sync' className='t3 spin'/>}
              {clickedIndex !== index &&
              <div className='regular flex row t3 gap6 alignitems-center'>
                <IonIcon name='people-sharp'/>
                <div>{group.members.length}</div>
              </div>
              }
            </div>
        ))}
      </div>
    </SlidingBox>
  );
}

export default GroupSelector
