import { NavLink, useSearchParams } from 'react-router-dom'
import IonIcon from '@reacticons/ionicons'

const NavBar = () => {

  const [searchParams, setSearchParams] = useSearchParams()

  const TabButton = ({ icon, to, children }) => {
    return(
      <NavLink
        to={to}
        className='flex row larger-click-area'
        style={({isActive}) => (isActive ? { color: 'white' } : { color: 'gray' })}
      >
        {/* <IonIcon name={icon}/> */}
        {children}
      </NavLink>
    )
  }

  return(
    <div id='navbar' className='bubble flex row alignitems-center justcont-spacebetween'>
      <TabButton icon='home' to='/'>
        <IonIcon name={'home-sharp'}/>
      </TabButton>
      <TabButton icon='card' to='expenses'>
        {/* <svg xmlns="http://www.w3.org/2000/svg" aria-hidden="true" role="img" width="1em" height="1em" preserveAspectRatio="xMidYMid meet" viewBox="0 0 512 512"><path fill="currentColor" d="M32 376a56 56 0 0 0 56 56h336a56 56 0 0 0 56-56V222H32Zm66-76a30 30 0 0 1 30-30h48a30 30 0 0 1 30 30v20a30 30 0 0 1-30 30h-48a30 30 0 0 1-30-30ZM424 80H88a56 56 0 0 0-56 56v26h448v-26a56 56 0 0 0-56-56Z"/></svg> */}
        <svg xmlns="http://www.w3.org/2000/svg" aria-hidden="true" role="img" width="1em" height="1em" preserveAspectRatio="xMidYMid meet" viewBox="0 0 16 16"><path fill="currentColor" d="M0 4a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v1H0V4zm0 3v5a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7H0zm3 2h1a1 1 0 0 1 1 1v1a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1v-1a1 1 0 0 1 1-1z"/></svg>
      </TabButton>
      <TabButton icon='people-sharp' to='members'>
        <IonIcon name='people-sharp'/>
      </TabButton>
      {/* <div
        onClick={() => setSearchParams({ menu: 'newexpense2' })}
        className='pointer flex row alignitems-center larger-click-area'
        style={{ color: 'var(--label-color-6)' }}>
        <svg xmlns="http://www.w3.org/2000/svg" aria-hidden="true" role="img" width="1em" height="1em" preserveAspectRatio="xMidYMid meet" viewBox="0 0 12 12"><path fill="currentColor" d="M6.5 1.75a.75.75 0 0 0-1.5 0V5H1.75a.75.75 0 0 0 0 1.5H5v3.25a.75.75 0 0 0 1.5 0V6.5h3.25a.75.75 0 0 0 0-1.5H6.5V1.75Z"/></svg>
      </div> */}
      <div
        onClick={() => setSearchParams({ menu: 'new' })}
        className='pointer flex row alignitems-center larger-click-area'
        style={{ color: 'var(--label-color-6)' }}
      >
        <svg xmlns="http://www.w3.org/2000/svg" aria-hidden="true" role="img" width="1em" height="1em" preserveAspectRatio="xMidYMid meet" viewBox="0 0 12 12"><path fill="currentColor" d="M6.5 1.75a.75.75 0 0 0-1.5 0V5H1.75a.75.75 0 0 0 0 1.5H5v3.25a.75.75 0 0 0 1.5 0V6.5h3.25a.75.75 0 0 0 0-1.5H6.5V1.75Z"/></svg>
      </div>
    </div>
  )
}

export default NavBar
