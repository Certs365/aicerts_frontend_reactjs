import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faExclamationTriangle, faCheckCircle } from '@fortawesome/free-solid-svg-icons';

/**
 * Display a message with an icon based on the message type.
 * @param {Object} props - Component properties.
 * @param {string} props.type - Type of the message (success, error, or default).
 * @param {string} props.message - The message to be displayed.
 * @returns {JSX.Element} - React component for displaying messages.
 */
const ShowMessage = ({ type, message }) => {
  /**
   * Determine the appropriate icon and color based on the message type.
   * @returns {Object} - Object containing the icon and color properties.
   */
  const getIconAndColor = () => {
    switch (type) {
      case 'success':
        return { icon: faCheckCircle, color: 'green' };
      case 'error':
        return { icon: faExclamationTriangle, color: '#ff5500' };
      default:
        return { icon: faExclamationTriangle, color: 'black' };
    }
  };

  // Get icon and color based on the message type
  const { icon, color } = getIconAndColor();

  // Render the message component
  return (
    <div className={`${type}-container`} style={{ display: 'flex', marginTop: '10px' }}>
    {/* <FontAwesomeIcon size='sm' icon={icon} className={`${type}-icon`} style={{ paddingRight: '10px', color: color, fontSize: '12px' }} /> */}
    <p style={{ color }} className={`${type}-message`}>
      {message}
    </p>
  </div>
  
  
  );
};

export default ShowMessage;
