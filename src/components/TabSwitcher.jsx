import { NavLink, useParams } from 'react-router-dom'

const TabSwitcher = () => {

  const params = useParams()
  const TabButton = ({ to, text }) => {
    return(
      <NavLink to={to} className={({isActive}) => (isActive ? 'tab-button-active' : 'tab-button-inactive')}>
        {text}
      </NavLink>
    )
  }

  return(
    <div className='tab-switcher t4 flex row alignitems-center'>
      <TabButton text='Expenses' to='expenses'/>
      <TabButton text='Members' to='members'/>
      <TabButton text='Settle Up' to='settleup'/>
    </div>
  )
}

export default TabSwitcher;
