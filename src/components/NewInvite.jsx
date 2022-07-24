import IonIcon from '@reacticons/ionicons'



export default function NewInvite({ setSearchParams }) {


  return (
    <div className='bottom-menu-new top-radius' style={{ zIndex: '2' }}>
      <div className='flex row justcont-spacebetween t05 'style={{padding:"10px"}}>
        <div style={{ color: "var(--light-color)", fontSize: "22px" }}>
          Invite
        </div>
        <div className='pointer' onClick={() => setSearchParams({})}>
          <IonIcon name='close-outline' />
        </div>
      </div>
      <div className='flex column gap10 padding1010'>

      <div  className='flex row alignitems-center gap10' style={{marginBottom:"10px"}} onClick={() => setSearchParams({ menu: 'friend' })}>
          <div className='encircle-item' >
          <svg style={{ color: "#ffffff", fontSize: "18px" }}xmlns="http://www.w3.org/2000/svg" aria-hidden="true" role="img" width="1.25em" height="1em" preserveAspectRatio="xMidYMid meet" viewBox="0 0 640 512"><path fill="currentColor" d="M192 256c61.9 0 112-50.1 112-112S253.9 32 192 32S80 82.1 80 144s50.1 112 112 112zm76.8 32h-8.3c-20.8 10-43.9 16-68.5 16s-47.6-6-68.5-16h-8.3C51.6 288 0 339.6 0 403.2V432c0 26.5 21.5 48 48 48h288c26.5 0 48-21.5 48-48v-28.8c0-63.6-51.6-115.2-115.2-115.2zM480 256c53 0 96-43 96-96s-43-96-96-96s-96 43-96 96s43 96 96 96zm48 32h-3.8c-13.9 4.8-28.6 8-44.2 8s-30.3-3.2-44.2-8H432c-20.4 0-39.2 5.9-55.7 15.4c24.4 26.3 39.7 61.2 39.7 99.8v38.4c0 2.2-.5 4.3-.6 6.4H592c26.5 0 48-21.5 48-48c0-61.9-50.1-112-112-112z"/></svg>
            {/* <i className='exchange icon' style={{ color: "var(--light-color)",fontSize:"15px"}}/> */}
          </div>
          <div className='pointer' style={{ color: "var(--light-color)" }}>
            Friend
          </div>
        </div>

        <div className='flex row alignitems-center gap10' style={{marginBottom:"10px"}} onClick={() => setSearchParams({ menu: 'guest' })}>
          <div className='encircle-item'>
            <IonIcon name='person-outline' style={{ color: "#ffffff", fontSize: "20px" }} />
            {/* <i className='exchange icon' style={{ color: "var(--light-color)",fontSize:"15px"}}/> */}
          </div>
          <div className='pointer' style={{ color: "var(--light-color)" }}>
            Guest
          </div>
        </div>

      </div>
    </div>
  )
}