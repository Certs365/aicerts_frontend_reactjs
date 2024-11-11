import React, { useState } from 'react';
import Poc from '../components/poc';
import PocCertificates from '../components/pocCertificates';
import SelectLocation from '../components/selectLocation';

const DynamicPoc = () => {
  const [page, setPage] = useState(0);
  const [certificates, setCertificates] = useState({});

  const handleTabClick = (tabIndex) => {
    setPage(tabIndex);
  };

  return (
    <div style={{ marginTop: "75px" }} className="page-bg">
  

      {page === 0 && <SelectLocation page={page} setPage={setPage} />}
      {page === 1 && <Poc page={page} setPage={setPage} setCertificates={setCertificates} certificates={certificates} />}
      {page === 2 && <PocCertificates page={page} setPage={setPage} setCertificates={setCertificates} certificateData={certificates} />}
    </div>
  );
};

export default DynamicPoc;
