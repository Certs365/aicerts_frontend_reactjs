import React from 'react'
import IssuePdfQr from '../pages/issue-pdf-qr'

const SelectLocation = ({page, setPage}) => {
  return (
    <div>
      <IssuePdfQr type={"poc"} page={page} setPage={setPage}/>
    </div>
  )
}

export default SelectLocation
