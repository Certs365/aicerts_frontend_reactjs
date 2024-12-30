import React from 'react';

const CopyrightNotice = () => {
    const currentYear = new Date().getFullYear();

  return (
      <p>Copyright &copy; {currentYear} AI CERTs. All rights reserved.</p>
  );
};

export default CopyrightNotice;
