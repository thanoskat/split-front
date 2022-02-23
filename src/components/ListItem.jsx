import '../style/ListItem.css'
import { Link } from 'react-router-dom'

const ListItem = ({ to, title, description, className }) => {

  return(
    <Link to={to} className={`list-item-component ${className}`}>
      <div className='list-item-title'>{title}</div>
      <div className='list-item-description'>{description}</div>
    </Link>
  )
}

export default ListItem
