import { useContext } from 'react'
import { SlidingBox } from './'
// import { SlidingBoxContext } from '../contexts/SlidingBoxContext'
import store from '../redux/store'
import { useDispatch } from 'react-redux'
import { closeSlidingBox } from '../redux/slidingSlice'
import "../style/SelectBox.css"

function SelectBox({ headline, rightHeadline, close, children }) {
  return (
    <SlidingBox close={close}>
      <div className='select-headline-section'>
        <div className='select-headline'>{headline}</div>
        {rightHeadline && <div className='select-right-headline'>{rightHeadline}</div>}
      </div>
      <div className='select-button-section'>
        {children}
      </div>
    </SlidingBox>
  );
}

function Button({ text, icon, iconColor, rightText, onClick }) {

  // const { closeBox } = useContext(SlidingBoxContext)
  const dispatch = useDispatch()

  const clickAndClose = () => {
    // closeBox()
    dispatch(closeSlidingBox())
    onClick()
  }

  return (
    <div className="select-button" onClick={clickAndClose}>
      {icon && <i className={`select-button-icon icon ${icon} select-button-icon-${iconColor}`}></i>}
      <div className='select-button-text'>{text}</div>
      {rightText && <div className='select-button-right-text'>{rightText}</div>}
    </div>
  );
}


function GroupButton({text,rightText,onClick,index,activeIndex }) {

  // const { closeBox } = useContext(SlidingBoxContext)
  const dispatch = useDispatch()

  const clickAndClose = () => {
    // closeBox()
    dispatch(closeSlidingBox())
    onClick()
  }

  return (
    <button area-pressed="true"
      onClick={clickAndClose}
      className={activeIndex === index ? "group-button-active" : "group-button"}>
      <div className="group-avatar">
        <div className="image-background">
        </div>
      </div>
      <span className="group-header ">
        <strong>{text}</strong>
      </span>
      <span className="group-total">
        <strong>{rightText}</strong>
      </span>
    </button>
  )
}

SelectBox.GroupButton=GroupButton
SelectBox.Button = Button
export default SelectBox
