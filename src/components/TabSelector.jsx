import { NavLink } from 'react-router-dom'

const TabSelector = () => {

  const TabButton = ({ to, text, style }) => {
    return(
      <NavLink to={to} className={({isActive}) => (isActive ? 'tab-button-active1' : 'tab-button-inactive1')} style={style}>
        {text}
      </NavLink>
    )
  }

  return(
    <div id='tab-selector' className='t4 flex row alignitems-center'>
      <TabButton text='Expenses' to='expenses'/>
      <TabButton text='Members' to='members'/>
      <TabButton text='Settle Up' to='settleup'/>
    </div>
  )
}

export default TabSelector;
