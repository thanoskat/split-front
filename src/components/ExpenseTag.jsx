


const ExpenseTag = ({ text, color, onCloseClick, showClose, onDeleteClick,onBodyClick }) => {
  return (
    <div className='t5 expense-tag flex row shadow pointer gap6' onClick={onBodyClick} style={{ backgroundColor: `${color}` }}>
      {text}
      {showClose ?
        <div className='tag-section-option'
          onClick={onCloseClick}>
          <i className="times icon"></i>
        </div> :
        <div className='tag-section-option'
          onClick={onDeleteClick}>
          <i className="trash alternate icon"></i>
        </div>
      }


    </div>

  )
}

export default ExpenseTag