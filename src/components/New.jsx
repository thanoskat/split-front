import IonIcon from '@reacticons/ionicons'



export default function New({ setSearchParams }) {


  return (
    <div className='bottom-menu top-radius padding4' style={{ zIndex: '2' }}>
      <div className='flex row justcont-spacebetween t05 padding4'>
        <div style={{ color: "var(--light-color)", fontSize: "25px" }}>
          New
        </div>
        <div onClick={() => setSearchParams({})}>
          <IonIcon name='close-outline' />
        </div>
      </div>
      <div className='flex column gap10 padding6'>

        <div className='flex row alignitems-center gap10' onClick={() => setSearchParams({ menu: 'newexpense' })}>
          <div className='encircle-item'>
            <IonIcon name='document-text-outline' style={{ color: "#ffffff", fontSize: "20px" }} />
            {/* <i className='file alternate outline icon' style={{ color: "var(--light-color)",fontSize:"15px", fontWeight:"lighter"}}/> */}
          </div>
          <div style={{ color: "var(--light-color)" }}>
            Add Expense
          </div>
        </div>

        <div className='flex row alignitems-center gap10' onClick={() => setSearchParams({ menu: 'recordtransfer' })}>
          <div className='encircle-item'>
            <IonIcon name='swap-horizontal-outline' style={{ color: "#ffffff", fontSize: "20px" }} />
            {/* <i className='exchange icon' style={{ color: "var(--light-color)",fontSize:"15px"}}/> */}
          </div>
          <div style={{ color: "var(--light-color)" }}>
            Record Transfer
          </div>
        </div>
      </div>
    </div>
  )
}