import { SlidingBox } from './'
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
  return (
    <div className="select-button" onClick={onClick}>
      {icon && <i className={`select-button-icon icon ${icon} select-button-icon-${iconColor}`}></i>}
      <div className='select-button-text'>{text}</div>
      {rightText && <div className='select-button-right-text'>{rightText}</div>}
    </div>
  );
}

SelectBox.Button = Button
export default SelectBox
