import React from 'react'

export default function BreakDown({ setMenuParams }) {
  return (
    <div id='breakDown' className='fixed' style={{ right: "0px" }}>

      <div id='menu-header' className='flex row'>
        <div className='cancelIcon alignself-center pointer' onClick={() => setMenuParams({ open: false })}>
          <i className='arrow left icon'></i>
        </div>
        <div>
          
        </div>
      </div>

      <div className='flex column'>


        <div className='flex column alignitems-center' style={{marginBottom:"15px"}} >
          <div className='flex column alignitems-center'>
            <div className='flex row justcont-spacebetween'>
              <div id="expense-date"> Aug 1&nbsp;</div>
              <div id="expense-time"> 11:39</div>
            </div>
            <div id="expense-description">
              Breakfast
            </div>
          </div>

          <div className='flex row justcont-center alignitems-center gap10' style={{
            width: "400px",
            paddingTop: "5px"
          }}>
            <div className='flex row justcont-end' style={{ maxWidth: "50px" }}>
              <div className='flex column alignitems-end'>
                <div style={{ color: "#8583F2" }}><strong>paid on your behalf</strong></div>
                <div ><strong>£40.39</strong></div>
              </div>
            </div>
            <div className='vl'></div>
            <div className='right text' style={{ maxWidth: "50px" }}>
              <div className='flex column'>
                <div style={{ color: "#8583F2" }}><strong>you owed</strong></div>
                <div style={{ color: "var(--pink)" }}><strong>£40.39</strong></div>
              </div>
            </div>
          </div>
        </div>


        <div className='flex column alignitems-center' >
          <div className='flex column alignitems-center'>
            <div className='flex row justcont-spacebetween'>
              <div id="expense-date"> Aug 9&nbsp;</div>
              <div id="expense-time"> 18:39</div>
            </div>
            <div id="expense-description">
              Hotel
            </div>
          </div>

          <div className='flex row justcont-center alignitems-center gap10' style={{
            width: "400px",
            paddingTop: "5px"
          }}>
            <div className='flex row justcont-end' style={{ maxWidth: "50px" }}>
              <div className='flex column alignitems-end'>
                <div style={{ color: "#8583F2" }}><strong>You contributed</strong></div>
                <div ><strong>£10.05</strong></div>
              </div>
            </div>
            <div className='vl'></div>
            <div className='right text' style={{ maxWidth: "50px" }}>
              <div className='flex column'>
                <div style={{ color: "#8583F2" }}><strong>you owed</strong></div>
                <div style={{ color: "var(--pink)" }}><strong>£30.34</strong></div>
              </div>
            </div>
          </div>
        </div>





      </div>
    </div>

  )
}
