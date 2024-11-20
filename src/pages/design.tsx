import React from 'react';
import { useRouter } from 'next/router';

const Design = () => {
  const router = useRouter();

  const handleNavigate = (path: string) => {
    router.push(path);
  };

  return (
    <div style={{ display: 'flex', height:"80vh", justifyContent: 'center', alignItems:"center",gap: '20px', marginTop: '20px' }}>
      {/* Card for Certificate Designer */}
      <div
        style={{
          width: '300px',
          height: '450px',
          backgroundColor: '#f0f0f0',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          borderRadius: '8px',
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
          cursor: 'pointer',
        }}
        onClick={() => handleNavigate('/designer')}
      >
        <h3>Certificate Designer</h3>
      </div>

      <div
        style={{
          width: '300px',
          height: '450px',
          backgroundColor: '#f0f0f0',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          borderRadius: '8px',
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
          cursor: 'pointer',
        }}
        onClick={() => handleNavigate('/badge/badge-dashboard')}
      >
        <h3>Badge Designer</h3>
      </div>
    </div>
  );
};

export default Design;
