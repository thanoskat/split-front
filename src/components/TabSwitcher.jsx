import { NavLink } from 'react-router-dom'

const TabSwitcher = () => {

  const TabButton = ({ to, text }) => {
    return(
      <NavLink to={to} className={isActive => (isActive ? 'tab-button-active' : 'tab-button-inactive')}>
        {text}
      </NavLink>
    )
  }

  return(
    <div className='tab-switcher h-flex'>
      <TabButton text='Expenses' to='/figmamain/expenses'/>
      <TabButton text='Members' to='/figmamain/members'/>
      <TabButton text='Settle Up' to='/figmamain/settleup'/>
    </div>
  )
}

export default TabSwitcher;
