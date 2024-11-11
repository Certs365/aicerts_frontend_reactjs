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
    <div style={{ marginTop: '20px' }}>
        <h4>Default text styles</h4>
        <button 
            style={{ width: '100%', padding: '10px', marginTop: '10px', textAlign: 'left', fontSize:"24px", fontWeight:"bold", background:"none" , border:"1px dashed gray"  }} 
            onClick={() => onAddTextBox('Heading Text', 'heading')}
        >
            Add a heading
        </button>
        <button 
            style={{ width: '100%', padding: '10px', marginTop: '10px', textAlign: 'left',fontSize:"18px" , fontWeight:"bold", background:"none",border:"1px dashed gray" }} 
            onClick={() => onAddTextBox('Subheading Text', 'subheading')}
        >
            Add a subheading
        </button>
        <button 
            style={{ width: '100%', padding: '10px', marginTop: '10px', textAlign: 'left',fontSize:"14px", border:"1px dashed gray" , background:"none"}} 
            onClick={() => onAddTextBox('Body Text', 'body')}
        >
            Add a little bit of body text
        </button>
    </div>
</div>
  )
}

export default TextPanel