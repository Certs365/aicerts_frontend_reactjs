import Image from 'next/image';
import React, { useState } from 'react';
import loginBackground from "../../../public/new_assets/backgrounds/loginBackground.svg";
import FormElement from '@/common/form/inputElement';
import PrimaryButton from '@/common/button/primaryButton';
import SecondaryButton from '@/common/button/secondaryButton';
import { toast } from 'react-toastify';
import RadioButton from '@/common/form/radioButton';
import arrowIcon from "../../../public/new_assets/icons/arrow-icon.svg";
import arrowIconBack from "../../../public/new_assets/icons/arrow-icon-back.svg";

// Step 1: Tell us about yourself
const Step1: React.FC<{ formData: any, handleChange: Function, error: string }> = ({ formData, handleChange, error }) => {
    return (
        <div>

            <h3 className='fs-36-24 mb-3 fw-700'>Tell us about yourself</h3>
            <p className='fs-12-8'>Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.</p>
            <FormElement
                type='text'
                title='Full Name'
                placeholder='Enter Your Full Name'
                required
                value={formData?.fullName}
                onChange={(value) => handleChange('fullName', value)}
            />
            <FormElement
                type='text'
                title='Organization Name'
                placeholder='Enter Your Organization Name'
                required
                value={formData?.organizationName}
                onChange={(value) => handleChange('organizationName', value)}
            />
            <FormElement
                type='text'
                title='Designation (Optional)'
                placeholder='Enter Your Designation'
                value={formData?.designation}
                onChange={(value) => handleChange('designation', value)}
            />
        </div>
    );
};

// Step 2: Type of business
const Step2: React.FC<{ formData: any, handleChange: Function, error: string }> = ({ formData, handleChange, error }) => {
    const businessTypes = [
        { label: 'Small Business', value: 'smallBusiness' },
        { label: 'Medium Business', value: 'mediumBusiness' },
        { label: 'Enterprise', value: 'enterprise' },
        { label: 'Educational Institute', value: 'educationalInstitute' },
        { label: 'Government', value: 'government' },
        { label: 'Association', value: 'association' },
        { label: 'Non-Profit/NGO', value: 'nonProfitNgo' },
        { label: 'Other', value: 'other' }
    ];

    return (
        <div>
            <h3 className='fs-36-24 mb-3 fw-700'>Type of business?</h3>
            <p className='fs-12-8 mb-4'>Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.</p>
            <div className='d-flex flex-row flex-wrap'>
                {businessTypes.map((option) => (
                    <RadioButton
                        key={option.value}
                        state={formData.businessType === option.value}
                        label={option.label}
                        isBordered={true}
                        onChange={() => handleChange('businessType', option.value)} // Store the value without space
                    />
                ))}
            </div>
        </div>
    );
};

// Step 3: What will you use CERTs365 for?
const Step3: React.FC<{ formData: any, handleChange: Function, error: string }> = ({ formData, handleChange, error }) => {
    const useCaseTypes = [
        { label: 'Webinar', value: 'webinar' },
        { label: 'Online Event', value: 'onlineEvent' },
        { label: 'Offline Event', value: 'offlineEvent' },
        { label: 'Graduation', value: 'graduation' },
        { label: 'Online Course', value: 'onlineCourse' },
        { label: 'Test or Survey', value: 'testOrSurvey' },
        { label: 'Membership', value: 'membership' },
        { label: 'Achievement', value: 'achievement' },
        { label: 'School Exams', value: 'schoolExams' },
        { label: 'Corporate Training', value: 'corporateTraining' },
        { label: 'Other', value: 'other' }
    ];


    return (
        <div>

            <h3 className='fs-36-24 mb-3 fw-700'>What will you use CERTs365 for?</h3>
            <p className='fs-12-8 mb-4'>Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.</p>

            <div className='d-flex flex-row flex-wrap'>
                {useCaseTypes.map((option) => (
                    <RadioButton
                        key={option.value}
                        state={formData.businessType === option.value}
                        label={option.label}
                        isBordered={true}
                        onChange={() => handleChange('businessType', option.value)} // Store the value without space
                    />
                ))}
            </div>
            {error && <p className="error-message text-danger">{error}</p>}
        </div>
    );
};

// Main Onboarding Component
const OnBoardingDetails: React.FC = () => {
    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState({
        fullName: '',
        organizationName: '',
        designation: '',
        businessType: '',
        useCase: '',
    });

    const [error, setError] = useState('');
    const [isFormComplete, setIsFormComplete] = useState(false);

    const handleChange = (field: string, value: string) => {
        setFormData({ ...formData, [field]: value });
    };

    const handleNext = () => {
        if (step === 1) {
            if (!formData.fullName || !formData.organizationName) {
                toast.error('Full Name and Organization Name are required.');
                return;
            }
        } else if (step === 2) {
            if (!formData.businessType) {
                toast.error('Please select your business type.');
                return;
            }
        } else if (step === 3) {
            if (!formData.useCase) {
                toast.error('Please select your use case.');
                return;
            }
        }
        setStep(step + 1);
    };

    const handleBack = () => {
        setStep(step - 1);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        // Send form data to API
        try {
            const response = await fetch('/api/onboarding', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });

            if (response.ok) {
                const data = await response.json();
                console.log('Onboarding successful:', data);
                setIsFormComplete(true);
            } else {
                const errorData = await response.json();
                setError(errorData.message || 'Onboarding failed. Please try again.');
            }
        } catch (err) {
            console.error('Error onboarding:', err);
            setError('An unexpected error occurred. Please try again later.');
        }
    };

    return (
        <div className='onboarding_wrapper d-flex flex-row'>
            {/* Banner Section */}
            <div className='onboarding_banner_wrapper'>
                <Image width={800} height={510} src={loginBackground} alt='background Image' />
                <div className='banner_text_wrapper'>
                    <h3 className='fs-24-12 fw-600 mb-4'>Generate up to 2000 certificates at once</h3>
                    <p className='fs-18-12 grey-light'>Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>
                </div>
            </div>

            {/* Form Section */}
            <div className='onboarding_form_wrapper'>
                <h2 className='fx-16 mb-1 fw-500 grey-ECE'>
                    Steps
                    <span className='fx-18 fw-700 ms-2 '>{`${step}/`}</span>3
                </h2>
                <div className='d-flex flex-row mb-4'>
                    <RadioButton inputClasses='golden-radio' state={step == 1 || step == 2 || step == 3} onChange={() => { }} />
                    <RadioButton inputClasses='golden-radio' disabled={step == 1} state={step == 2 || step == 3} onChange={() => { }} />
                    <RadioButton inputClasses='golden-radio' disabled={step == 1 || step == 2} state={step == 3} onChange={() => { }} />
                </div>

                <form onSubmit={handleSubmit}>
                    {/* Step Components */}
                    {step === 1 && <Step1 formData={formData} handleChange={handleChange} error={error} />}
                    {step === 2 && <Step2 formData={formData} handleChange={handleChange} error={error} />}
                    {step === 3 && <Step3 formData={formData} handleChange={handleChange} error={error} />}

                    {/* Navigation Buttons */}
                    <div className="d-flex mt-4 flex-row justify-content-between navigation-buttons">
                        {step > 1 && <SecondaryButton icon={<Image height={24} width={24} src={arrowIconBack} alt="LinkedIn Icon" />} label="Back" type="button" onClick={handleBack} />}
                        {step < 3 && <PrimaryButton iconPosition='back' icon={<Image height={24} width={24} src={arrowIcon} alt="LinkedIn Icon" />} classes='padding-2-3' label="Next" type="button" onClick={handleNext} />}
                        {step === 3 && (
                            <PrimaryButton onClick={() => { }} label="Complete" type="submit" />
                        )}
                    </div>
                </form>
            </div>
        </div>
    );
};

export default OnBoardingDetails;
