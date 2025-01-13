import Image from 'next/image';
import React, { useState } from 'react';
import loginBackground from "../../../public/new_assets/backgrounds/loginBackground.svg";
import FormElement from '@/common/form/inputElement';
import messageIcon from '../../../public/new_assets/icons/message.svg';
import lockIcon from '../../../public/new_assets/icons/lock.svg';
import PrimaryButton from '@/common/button/primaryButton';
import Switch from '@/common/form/switch';
import SecondaryButton from '@/common/button/secondaryButton';
import googleIcon from "../../../public/new_assets/icons/google-icon.svg";
import linkedInIcon from "../../../public/new_assets/icons/linkedin-icon.svg";

const ForgetPassword: React.FC = () => {
    const [formData, setFormData] = useState({ email: '' });
    const [error, setError] = useState('');
    const [isChecked, setIsChecked] = useState(false);


    const handleChange = (field: string, value: string) => {
        setFormData({ ...formData, [field]: value });
    };



    const handleSwitchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setIsChecked(event.target.checked);
    };


    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        // Validation
        if (!formData.email) {
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
        <div className='forgot_wrapper d-flex flex-row'>
            {/* Banner Section */}
            <div className='forgot_banner_wrapper'>
                <Image width={800} height={510} src={loginBackground} alt='background Image' />
                <div className='banner_text_wrapper'>
                    <h3 className='fs-24-12 fw-600 mb-4'>Generate up to 2000 certificates at once</h3>
                    <p className='fs-18-12 grey-light'>Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>
                </div>
            </div>

            {/* Form Section */}
            <div className='forgot_form_wrapper'>
                <h2 className='text-signin fs-36-24 fs fw-700'>Forgot Password</h2>
                <p className='fs-12-8'>Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.</p>
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


                    {/* Submit Button */}
                    <PrimaryButton label='Get OTP' type='submit' onClick={() => { }} width='100%' />

                    <div className='d-flex flex-row justify-content-center text-center mt-4'>
                        <p className='fs-14-10'>Remember Your Password? <a className='golden underline'>Sign In</a></p>
                    </div>

                </form>
            </div>
        </div>
    );
};

export default ForgetPassword;
