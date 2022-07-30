// import IonIcon from '@reacticons/ionicons'
export default function GroupOptions({ openMenu }) {

  return (
    <div className='bottom-menu top-radius flex column' style={{ zIndex: '2', gap: '14px', padding: '14px' }}>
      <div className='flex row' style={{ fontSize: '26px' }}>
        Group options
      </div>
      <div
        onClick={() => openMenu('labelEditor')}
        className='group-selector-button medium flex row overflow-hidden justcont-center alignitems-center t3 pointer shadow'
        style={{ padding: '14px', width: '100%', gap: '14px' }}
      >
        {/* <svg style={{ color: '#ffffff', fontSize: '20px', justifySelf: 'start' }} xmlns='http://www.w3.org/2000/svg' aria-hidden='true' role='img' width='1em' height='1em' preserveAspectRatio='xMidYMid meet' viewBox='0 0 16 16'><path fill='currentColor' d='M0 4a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v1H0V4zm0 3v5a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7H0zm3 2h1a1 1 0 0 1 1 1v1a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1v-1a1 1 0 0 1 1-1z'/></svg> */}
        <div>Edit labels</div>
      </div>
      <div
        onClick={() => openMenu('deleteGroup')}
        className='group-selector-button medium flex row overflow-hidden justcont-center alignitems-center t3 pointer shadow'
        style={{ padding: '14px', width: '100%', gap: '14px' }}
      >
        {/* <svg style={{ color: '#ffffff', fontSize: '20px', justifySelf: 'start' }} xmlns="http://www.w3.org/2000/svg" aria-hidden="true" role="img" width="1em" height="1em" preserveAspectRatio="xMidYMid meet" viewBox="0 0 256 256"><path fill="currentColor" d="m216.5 184.5l-32 32a12.1 12.1 0 0 1-17 0a12 12 0 0 1 0-17L179 188H48a12 12 0 0 1 0-24h131l-11.5-11.5a12 12 0 0 1 17-17l32 32a12 12 0 0 1 0 17Zm-145-64a12.1 12.1 0 0 0 17 0a12 12 0 0 0 0-17L77 92h131a12 12 0 0 0 0-24H77l11.5-11.5a12 12 0 0 0-17-17l-32 32a12 12 0 0 0 0 17Z"/></svg> */}
        <div>Delete group</div>
      </div>
    </div>
  )
}