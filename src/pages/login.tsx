import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import loginBackground from "../../public/new_assets/backgrounds/loginBackground.svg";
import FormElement from '@/common/form/inputElement';
import messageIcon from '../../public/new_assets/icons/message.svg';
import lockIcon from '../../public/new_assets/icons/lock.svg';
import PrimaryButton from '@/common/button/primaryButton';
import Switch from '@/common/form/switch';
import { toast } from 'react-toastify';
import { loginApi, verifyOtpApi } from "../services/auth";
import { useRouter } from 'next/router';
import Link from 'next/link';
import OTPInput from '@/common/form/otpInput';
import { commonApi } from '@/services/common';
import { TWO_FACTOR_AUTH } from '@/utils/Constants';

const Login: React.FC = () => {
    const [formData, setFormData] = useState({ email: '', password: '' });
    const [otp, setOtp] = useState('');
    const [isChecked, setIsChecked] = useState(false);
    const [user, setUser] = useState({});
    const [loading, setLoading] = useState(false);
    const [showVerify, setShowVerify] = useState(false);
    const [timer, setTimer] = useState(60); // Countdown timer in seconds
    const [canResend, setCanResend] = useState(false);
    const router = useRouter();


    useEffect(() => {
        if (timer > 0) {
            const interval = setInterval(() => {
                setTimer((prev) => prev - 1);
            }, 1000);

            return () => clearInterval(interval);
        } else {
            setCanResend(true);
        }
    }, [timer]);

    useEffect(() => {
        const savedEmail = localStorage.getItem('rememberedEmail');
        if (savedEmail) {
            setFormData((prev) => ({ ...prev, email: savedEmail }));
            setIsChecked(true);
        }
    }, []);

    const handleChange = (field: string, value: string) => {
        setFormData({ ...formData, [field]: value });
    };

    const handleSwitchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setIsChecked(event.target.checked);
    };

    const handleLoginSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.email || !formData.password) {
            toast.error('Both email and password are required.');
            return;
        }

        try {

            await loginApi(formData, { setLoading, setUser, setShowVerify, setTimer });
            // Save email to localStorage if Remember Me is checked
            if (isChecked) {
                localStorage.setItem('rememberedEmail', formData.email);
            } else {
                localStorage.removeItem('rememberedEmail');
            }
        } catch (err) {
            toast.error('Login failed. Please try again.');
        }
    };

    const handleOtpSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!otp) {
            toast.error('Please enter the OTP.');
            return;
        }
        try {
            await verifyOtpApi({ email: formData.email, code: otp }, { user }, { setLoading }, router);
        } catch (err) {
            toast.error('Invalid OTP. Please try again.');
        }
    };


    const handleResendOtp = async () => {
        if (canResend) {
            await commonApi(TWO_FACTOR_AUTH, { email: formData?.email }, 'post');
            toast.success("OTP send successfully on registered Email")
            setCanResend(false);
            setTimer(60);
        }
    };

    return (
        <div className='login_wrapper d-flex flex-row'>
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
                {!showVerify ? (
                    <>
                        <h2 className='text-signin fw-700'>Sign In</h2>
                        <form onSubmit={handleLoginSubmit}>
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
                            <div className='d-flex flex-row justify-content-between'>
                                <Switch label="Remember Me" onChange={handleSwitchChange} />
                                <Link href="/forgot-passwords">
                                    <p className='fs-16-14 golden pointer underline'>Forgot Password?</p>
                                </Link>
                            </div>

                            {/* Submit Button */}
                            <PrimaryButton loadingText='Logging In...' loading={loading} label='Sign In' type='submit' width='100%' />
                        </form>
                    </>
                ) : (
                    <>
                        <h2 className='text-signin fw-700'>Verify OTP</h2>
                        <form onSubmit={handleOtpSubmit}>
                            {/* OTP Field */}
                            <OTPInput
                                icon={lockIcon.src}
                                title='OTP'
                                numInputs={6}
                                onChange={(value) => setOtp(value)}
                                inputType="text"
                            />

                            {/* Submit Button */}
                            <PrimaryButton loadingText='Verifying...' loading={loading} label='Verify' type='submit' width='100%' />
                            <div className="d-flex flex-column text-center mt-4">
                                {!canResend ? (
                                    <p className="fs-18-12 grey-light">
                                        Resend in {Math.floor(timer / 60)}:
                                        {String(timer % 60).padStart(2, "0")}
                                    </p>
                                ) : (
                                    <p
                                        className="fs-18-12 grey-light resend-otp-text"
                                        onClick={handleResendOtp}
                                        style={{ cursor: "pointer", color: "blue" }}
                                    >
                                        Resend OTP
                                    </p>
                                )}
                            </div>
                        </form>
                    </>
                )}
            </div>
        </div>
    );
};

export default Login;
