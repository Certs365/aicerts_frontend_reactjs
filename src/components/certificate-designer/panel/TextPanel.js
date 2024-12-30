import React from 'react'

const TextPanel = ({ onAddTextBox }) => {
  return (
    <div style={{ padding: '20px', width: '100%' }}>
    <button
    
        style={{ width: '100%', backgroundColor: "#CFA935", color: '#fff', padding: '10px', borderRadius: '5px', border:"none",  }}
        onClick={() => onAddTextBox('New Text', 'normal')}
    >
        Add a text box
    </button>
    <div className='add-text-button' style={{ marginTop: '20px' }}>
        <h4>Default text styles</h4>
        <button 
            className='heading'
            onClick={() => onAddTextBox('Heading Text', 'heading')}
        >
            Add a heading
        </button>
        <button 
            className='sub-heading'
            onClick={() => onAddTextBox('Subheading Text', 'subheading')}
        >
            Add a subheading
        </button>
        <button 
            className='body-text'
            onClick={() => onAddTextBox('Body Text', 'body')}
        >
            Add a little bit of body text
        </button>
    </div>
</div>
  )
}

export default TextPanel