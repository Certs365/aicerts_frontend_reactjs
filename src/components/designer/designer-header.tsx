import React from 'react'

const DesignerHeader = ({}) => {
  return (
   <>
   <div style={{border:"1px solid red", width:"40%"}}>
    <h4 className='design-tab-heading'>Tab Name</h4>

   </div>
   <div className='design-tab-features'>
    <div className='tab-toggle-button-container'>
      <button className='tab-toggle-button'>Certificate</button>
      <button className='tab-toggle-button'>Badge</button>

    </div>

   </div>

   
   </>
  )
}

export default DesignerHeader