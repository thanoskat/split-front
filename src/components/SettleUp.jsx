import IonIcon from '@reacticons/ionicons'

function SettleUp({ setSearchParams,name, amount }) {
  return (
    <div className='bottom-menu top-radius padding4' style={{ zIndex: '2' }}>
      <div className='flex row justcont-spacebetween t05 padding4'>
        <div style={{ color: "var(--light-color)", fontSize: "25px" }}>
          Settle Up
        </div>
        <div onClick={() => setSearchParams({})}>
          <IonIcon name='close-outline' />
        </div>
      </div>
      <div className='flex column gap10 padding6'>
        <div className="whiteSpace-initial" style={{ color: "var(--light-color)" ,textAlign:"left"}}>
          You are about to settle a debt of ${amount} with {name}
        </div>
        <div>
          Settle debt
        </div>
        <div>
          Cancel 
        </div>
      </div>
    </div>
  )
}

export default SettleUp