


const Tag = ({ text, color, onCloseClick, showClose, showTrash, onDeleteClick, onBodyClick}) => {
  console.log("Tag rendered")
  return (
    <div className='t5 expense-tag flex row shadow pointer gap6' onClick={onBodyClick} style={{ backgroundColor: `${color}` }}>
      {text}
      {showClose ?
        <div className='tag-section-option'
          onClick={onCloseClick}>
          <i className="times icon"></i>
        </div> : ""}

      {showTrash ?
      // /https://unused-css.com/blog/css-shake-animation/
      
        <div className='tag-section-option shaker'  
          onClick={onDeleteClick}>
          <i className="trash alternate icon"></i>
        </div> : ""}
    </div>

  )
}



export default Tag