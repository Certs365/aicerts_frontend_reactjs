import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import Scrollbar from 'react-scrollbars-custom';

const FontPanel = ({ onFontChange }) => {
  const [fontOptions, setFontOptions] = useState([]);
  const [filteredFonts, setFilteredFonts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const observer = useRef(null);

  useEffect(() => {
    const apiKey = "AIzaSyAGEMGzgf6iKb1goan1IGUZ7f_yfXKedPg" // Replace with your actual API key
    axios
      .get(`https://www.googleapis.com/webfonts/v1/webfonts?key=${apiKey}&sort=popularity`)
      .then(response => {
        const fonts = response.data.items.map(font => ({ value: font.family, label: font.family }));
        setFontOptions(fonts);
        setFilteredFonts(fonts); // Initialize filteredFonts with the full list
      })
      .catch(error => console.error('Error fetching fonts:', error));
  }, []);

  const loadFont = (font) => {
    // Check if the font is already loaded
    if (!document.getElementById(`preload-${font}`)) {
      const link = document.createElement('link');
      link.id = `preload-${font}`;
      link.href = `https://fonts.googleapis.com/css2?family=${font.replace(/ /g, '+')}:wght@400&display=swap`;
      link.rel = 'stylesheet';
      document.head.appendChild(link);
    }
  };

  const handleFontClick = (font) => {
    loadFont(font); // Load the font on click
    onFontChange(font); // Notify parent component of font change
  };

  const handleSearch = (e) => {
    const term = e.target.value.toLowerCase();
    setSearchTerm(term);

    const filtered = fontOptions.filter(font => font.label.toLowerCase().includes(term));
    setFilteredFonts(filtered);
  };

  const lazyLoadFonts = (entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        loadFont(entry.target.dataset.font);
      }
    });
  };

  useEffect(() => {
    observer.current = new IntersectionObserver(lazyLoadFonts, {
      root: null,
      rootMargin: '0px',
      threshold: 0.1
    });
    const buttons = document.querySelectorAll('.font-option');
    buttons.forEach(button => observer.current.observe(button));

    return () => observer.current.disconnect();
  }, [filteredFonts]);

  return (
    <div className="font-panel" >
      
      <input
        type="text"
        placeholder="Search fonts..."
        value={searchTerm}
        onChange={handleSearch}
        style={{ marginBottom: '10px', padding: '5px', width: '100%' }}
      />
      {/* <h4>Select Font</h4> */}
      <Scrollbar
            style={{ height: "100%" }}
            
            noScrollX
            thumbYProps={{
              renderer: (props) => {
                const { elementRef, ...restProps } = props;
                return (
                  <div
                    {...restProps}
                    ref={elementRef}
                    style={{
                      backgroundColor: "#CFA935", // Thumb color
                      borderRadius: "8px", // Optional: rounded corners for the scrollbar thumb
                    }}
                  />
                );
              },
            }}
          >
             {filteredFonts.map((font) => (
        <button
          key={font.value}
          className="font-option"
          data-font={font.value}
          onClick={() => handleFontClick(font.value)}
          style={{ fontFamily: font.value, display: 'block', margin: '5px 0' }}
        >
          {font.label}
        </button>
      ))}


          </Scrollbar>
     
    </div>
  );
};

export default FontPanel;
