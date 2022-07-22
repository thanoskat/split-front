import IonIcon from '@reacticons/ionicons'



export default function New({ setSearchParams }) {


  return (
    <div className='bottom-menu-new top-radius' style={{ zIndex: '2' }}>
      <div className='flex row justcont-spacebetween t05 'style={{padding:"10px"}}>
        <div style={{ color: "var(--light-color)", fontSize: "25px" }}>
          New
        </div>
        <div className='pointer' onClick={() => setSearchParams({})}>
          <IonIcon name='close-outline' />
        </div>
      </div>
      <div className='flex column gap10 padding1010'>

        <div className='flex row alignitems-center gap10' onClick={() => setSearchParams({ menu: 'newexpense' })}>
          <div className='encircle-item'>
            {/* <IonIcon name='document-text-outline' style={{ color: "#ffffff", fontSize: "20px" }} /> */}
            <svg style={{ color: "#ffffff", fontSize: "20px" }} xmlns="http://www.w3.org/2000/svg" aria-hidden="true" role="img" width="1em" height="1em" preserveAspectRatio="xMidYMid meet" viewBox="0 0 16 16"><path fill="currentColor" d="M0 4a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v1H0V4zm0 3v5a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7H0zm3 2h1a1 1 0 0 1 1 1v1a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1v-1a1 1 0 0 1 1-1z"/></svg>
            {/* <i className='file alternate outline icon' style={{ color: "var(--light-color)",fontSize:"15px", fontWeight:"lighter"}}/> */}
          </div>
          <div className='pointer' style={{ color: "var(--light-color)" }}>
            New Expense
          </div>
        </div>

        <div className='flex row alignitems-center gap10' onClick={() => setSearchParams({ menu: 'recordtransfer' })}>
          <div className='encircle-item'>
            <IonIcon name='swap-horizontal-outline' style={{ color: "#ffffff", fontSize: "20px" }} />
            {/* <i className='exchange icon' style={{ color: "var(--light-color)",fontSize:"15px"}}/> */}
          </div>
          <div className='pointer' style={{ color: "var(--light-color)" }}>
            Record Transfer
          </div>
        </div>
        <div className='flex row alignitems-center gap10' onClick={() => setSearchParams({ menu: 'newguest' })}>
          <div className='encircle-item'>
            <IonIcon name='person-outline' style={{ color: "#ffffff", fontSize: "20px" }} />
            {/* <i className='exchange icon' style={{ color: "var(--light-color)",fontSize:"15px"}}/> */}
          </div>
          <div className='pointer' style={{ color: "var(--light-color)" }}>
            New Guest
          </div>
        </div>
      </div>
    </div>
  )
}