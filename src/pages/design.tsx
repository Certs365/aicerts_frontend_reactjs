import React from 'react';
import { useRouter } from 'next/router';

const Design = () => {
  const router = useRouter();

  const handleNavigate = (path: string) => {
    router.push(path);
  };

  return (
    <div className="design-container">
      {/* Card for Certificate Designer */}
      <div
        className="card-badge"
        onClick={() => handleNavigate('/designer')}
      >
        <h3>Certificate Designer</h3>
      </div>

      <div
        className="card-badge"
        onClick={() => handleNavigate('/badge/badge-dashboard')}
      >
        <h3>Badge Designer</h3>
      </div>
    </div>
  );
};

export default Design;
