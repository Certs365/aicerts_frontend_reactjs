import React from 'react'
import ShapesPanel from './ShapePanel'
import ImagesPanel from './ImagesPanel'
import { onAddShape } from '../utils/shapeUtils'
import { setImage } from '../utils/templateUtils'

const ElementPanel = ({canvas}) => {
  return (
    <div className=' d-flex w-100 h-100 flex-column '>
        <ShapesPanel canvas={canvas}
          onAddShape={(shape) => {
            onAddShape(shape, canvas);
          }}/>
        <ImagesPanel onSelectImage={(imageUrl) => {
            setImage(imageUrl, canvas);
          }}/>
    </div>
  )
}

export default ElementPanel