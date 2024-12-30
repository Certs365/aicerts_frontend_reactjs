import React from 'react';
import { useRouter } from 'next/router';
import CertificateDisplayPage from '../../components/batch-issue-certificates';

const CertificatePage = () => {
  const router = useRouter();
  const { id, b } = router.query;



  // Check if id is undefined or null
  if (!id) {
    // You can choose to render an error message or redirect to a different page
    return <p>Error: Certificate ID not provided</p>;
  }

  // Convert id to string, as it might be an array or other types
  const cardId = String(id);

  // Check if cardId is still empty or invalid after conversion
  if (!cardId.trim()) {
    // You can choose to render an error message or redirect to a different page
    return <p>Error: Invalid Certificate ID</p>;
  }

  // Check if b is undefined or null, or an array
  const badgeUrl = Array.isArray(b) || !b ? '' : String(b);

  return <CertificateDisplayPage cardId={cardId} 
  //badgeUrl={badgeUrl} 
  />;
};

export default CertificatePage;
