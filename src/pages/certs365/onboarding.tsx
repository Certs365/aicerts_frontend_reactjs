import Image from 'next/image';
import React, { useState } from 'react';
import loginBackground from "../../../public/new_assets/backgrounds/loginBackground.svg";
import FormElement from '@/common/form/inputElement';
import messageIcon from '../../../public/new_assets/icons/message.svg';
import lockIcon from '../../../public/new_assets/icons/lock.svg';
import PrimaryButton from '@/common/button/primaryButton';
import SecondaryButton from '@/common/button/secondaryButton';
import googleIcon from "../../../public/new_assets/icons/google-icon.svg";

const OnBoarding: React.FC = () => {
    const [formData, setFormData] = useState({ email: '', password: '' });
    const [error, setError] = useState('');

    const handleChange = (field: string, value: string) => {
        setFormData({ ...formData, [field]: value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        // Validation
        if (!formData.email || !formData.password) {
            setError('Both email and password are required.');
            return;
        }

        try {
            const response = await fetch('/api/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });

            if (response.ok) {
                const data = await response.json();
                console.log('Login successful:', data);
                // Handle successful login (e.g., redirect or show success message)
            } else {
                const errorData = await response.json();
                setError(errorData.message || 'Login failed. Please try again.');
            }
        } catch (err) {
            console.error('Error logging in:', err);
            setError('An unexpected error occurred. Please try again later.');
        }
    };

    return (
        <div className='login_wrapper d-flex flex-row w100'>
            {/* Banner Section */}
            <div className='login_banner_wrapper'>
                <Image width={800} height={510} src={loginBackground} alt='background Image' />
                <div className='banner_text_wrapper'>
                    <h3 className='fs-24-12 fw-600 mb-4'>Generate up to 2000 certificates at once</h3>
                    <p className='fs-18-12 grey-light'>Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>
                </div>
            </div>

            {/* Form Section */}
            <div className='login_form_wrapper'>
                <h2 className='text-signin fw-700'>Create an account</h2>
                <form onSubmit={handleSubmit}>
                    {/* Email Field */}
                    <FormElement
                        icon={messageIcon.src}
                        title='Email'
                        placeholder='Enter Your Email Address...'
                        type='email'
                        required
                        onChange={(value) => handleChange('email', value)}
                    />

                    {/* Password Field */}
                    <FormElement
                        icon={lockIcon.src}
                        title='Password'
                        placeholder='Enter Your Password...'
                        type='password'
                        required
                        onChange={(value) => handleChange('password', value)}
                    />

                    {/* Error Message */}
                    {error && <p className="error-message text-danger">{error}</p>}

                    {/* Submit Button */}
                    <PrimaryButton label='Sign Up for Free' type='submit' onClick={() => { }} width='100%' />
                    <div className="or-container my-5">
                        <hr className="line" />
                        <p className='fs-12-8'>or</p>
                        <hr className="line" />
                    </div>
                    <div className='d-flex flex-row'>
                        <SecondaryButton icon={<Image height={24} width={24} src={googleIcon} alt="LinkedIn Icon" />} classes='mx-2' label='Sign Up with Google' type='submit' onClick={() => { }} width='100%' />
                    </div>
                    <div className='d-flex flex-row justify-content-center text-center mt-4'>
                        <p className='fs-12-8'>Already a member? <a className='golden underline'>Sign In</a></p>
                    </div>

                </form>
            </div>
        </div>
    );
};

export default OnBoarding;
