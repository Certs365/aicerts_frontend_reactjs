import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import Login from './login'
import NavigationLogin from '@/app/navigation-login';
import Link from 'next/link';
import ThemedImage from '@/components/ThemedImage';
import { useRouter } from 'next/router';

const LoginPage = () => {
    const router = useRouter();
    const logoSrc = router.pathname === '/' || router.pathname === '/register' || router.pathname === '/forgot-passwords' || router.pathname === '/passwords-confirm'
        ? 'https://images.netcomlearning.com/ai-certs/Certs365-logo.svg'
        : 'https://images.netcomlearning.com/ai-certs/Certs365-white-logo.svg';

    return (
        <div className='login-page1'>
            {/* <NavigationLogin /> */}
            <div className='nav-logo-login'>
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
            <div className="container1">
                <Login />
            </div>
        </div>
    );
}

export default LoginPage;
