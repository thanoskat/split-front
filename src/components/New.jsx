// import IonIcon from '@reacticons/ionicons'
export default function New({ openMenu }) {

  return (
    <div className='bottom-menu top-radius flex column' style={{ zIndex: '2', gap: '14px', padding: '14px' }}>
      <div className='flex row' style={{ fontSize: '26px' }}>
        New
      </div>
      <div
        onClick={() => openMenu('newExpense')}
        className='group-selector-button medium flex row overflow-hidden justcont-center alignitems-center t3 pointer shadow'
        style={{ padding: '14px', width: '100%', gap: '14px' }}
      >
        <svg style={{ color: '#ffffff', fontSize: '20px', justifySelf: 'start' }} xmlns='http://www.w3.org/2000/svg' aria-hidden='true' role='img' width='1em' height='1em' preserveAspectRatio='xMidYMid meet' viewBox='0 0 16 16'><path fill='currentColor' d='M0 4a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v1H0V4zm0 3v5a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7H0zm3 2h1a1 1 0 0 1 1 1v1a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1v-1a1 1 0 0 1 1-1z'/></svg>
        <div>Expense</div>
      </div>
      <div
        onClick={() => openMenu('newTransfer')}
        className='group-selector-button medium flex row overflow-hidden justcont-center alignitems-center t3 pointer shadow'
        style={{ padding: '14px', width: '100%', gap: '14px' }}
      >
        <svg style={{ color: '#ffffff', fontSize: '20px', justifySelf: 'start' }} xmlns="http://www.w3.org/2000/svg" aria-hidden="true" role="img" width="1em" height="1em" preserveAspectRatio="xMidYMid meet" viewBox="0 0 256 256"><path fill="currentColor" d="m216.5 184.5l-32 32a12.1 12.1 0 0 1-17 0a12 12 0 0 1 0-17L179 188H48a12 12 0 0 1 0-24h131l-11.5-11.5a12 12 0 0 1 17-17l32 32a12 12 0 0 1 0 17Zm-145-64a12.1 12.1 0 0 0 17 0a12 12 0 0 0 0-17L77 92h131a12 12 0 0 0 0-24H77l11.5-11.5a12 12 0 0 0-17-17l-32 32a12 12 0 0 0 0 17Z"/></svg>
        <div>Money transfer</div>
      </div>
    </div>
  )

  // return (
  //   <div className='bottom-menu top-radius' style={{ zIndex: '2' }}>
  //     <div className='flex row justcont-spacebetween t05 'style={{ padding: '14px' }}>
  //       <div style={{ color: 'var(--light-color)', fontSize: '22px' }}>
  //         New
  //       </div>
  //       <div className='pointer' onClick={() => setMenu(null)}>
  //         <IonIcon name='close-outline' />
  //       </div>
  //     </div>
  //     <div className='flex column gap10 padding1010'>
  //       <div className='flex row alignitems-center gap10' style={{ marginBottom: '10px' }} onClick={() => setMenu('newExpense')}>
  //         <div className='encircle-item'>
  //           {/* <IonIcon name='document-text-outline' style={{ color: '#ffffff', fontSize: '20px' }} /> */}
  //           <svg style={{ color: '#ffffff', fontSize: '20px' }} xmlns='http://www.w3.org/2000/svg' aria-hidden='true' role='img' width='1em' height='1em' preserveAspectRatio='xMidYMid meet' viewBox='0 0 16 16'><path fill='currentColor' d='M0 4a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v1H0V4zm0 3v5a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7H0zm3 2h1a1 1 0 0 1 1 1v1a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1v-1a1 1 0 0 1 1-1z'/></svg>
  //           {/* <i className='file alternate outline icon' style={{ color: 'var(--light-color)',fontSize:'15px', fontWeight:'lighter'}}/> */}
  //         </div>
  //         <div className='pointer' style={{ color: 'var(--light-color)' }}>
  //           New Expense
  //         </div>
  //       </div>
  //       <div className='flex row alignitems-center gap10' style={{ marginBottom: '10px' }} onClick={() => setMenu('newTransfer')}>
  //         <div className='encircle-item'>
  //           <IonIcon name='swap-horizontal-outline' style={{ color: '#ffffff', fontSize: '20px' }} />
  //           {/* <i className='exchange icon' style={{ color: 'var(--light-color)',fontSize:'15px'}}/> */}
  //         </div>
  //         <div className='pointer' style={{ color: 'var(--light-color)' }}>
  //           Record Transfer
  //         </div>
  //       </div>
  //     </div>
  //   </div>
  // )
}