import Image from 'next/legacy/image';
import Link from 'next/link';
import React, { useEffect } from 'react';
import { useRouter } from 'next/router';
import { Navbar } from 'react-bootstrap';
import { getAuth } from 'firebase/auth';
import Button from '../../shared/button/button';
import ThemeSwitcher from '@/components/ThemeSwitcher';
import ThemedImage from '@/components/ThemedImage';

const NavigationLogin = () => {
  const router = useRouter();
  const logoSrc = router.pathname === '/register' || router.pathname === '/forgot-passwords' || router.pathname === '/passwords-confirm'
    ? 'https://images.netcomlearning.com/ai-certs/Certs365-logo.svg'
    : 'https://images.netcomlearning.com/ai-certs/Certs365-white-logo.svg';


  const auth = getAuth()

  const handleClick = () => {
    window.location.href = '/register';
  };

  useEffect(() => {
    // Remove user from localStorage
    localStorage.removeItem('user');
    sessionStorage.removeItem('badgeUrl');
    sessionStorage.removeItem('logoUrl');
    sessionStorage.removeItem('signatureUrl');
    sessionStorage.removeItem('issuerName');
    sessionStorage.removeItem('issuerDesignation');
    auth.signOut().then(() => {
      //  ("signout Successfully")
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <nav className="global-header navbar navbar-expand-lg navbar-light bg-light">
      <div className="container-fluid">
        <div className='nav-logo'>
          <Link className="navbar-brand" href="/">
            <ThemedImage
              imageLight={logoSrc}
              imageDark="/images/Certs365-white-logo.svg"
              layout='fill'
              objectFit="contain"
              alt='AI Certs logo'
            />
          </Link>
        </div>
        {router.pathname !== '/register' && (
          <>
            <div className="collapse navbar-collapse">
              <Navbar.Collapse className="justify-content-end">
                <Navbar.Text>
                  <span className='nav-text text-decoration-none'>Don&apos;t have an account?</span>
                </Navbar.Text>
                <Navbar.Text>
                  <Button label="Apply for Account" onClick={handleClick} className="golden" />
                </Navbar.Text>
              </Navbar.Collapse>
            </div>
          </>
        )}
        <div className='ms-3'>
          <ThemeSwitcher />
        </div>
      </div>
    </nav>
  );
};

export default NavigationLogin;
