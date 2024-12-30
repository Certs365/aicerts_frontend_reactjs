// Importing necessary dependencies and functions for testing
import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react';
import CardSelector from '../src/pages/certificate/index'; // Adjust the import path based on your directory structure
// Mocking the useRouter hook since it's being used in the component
jest.mock('next/router', () => ({
  useRouter: () => ({
    push: jest.fn(),
  }),
}));

// Mocking CertificateContext since it's being used in the component
jest.mock('../../utils/CertificateContext', () => ({
  useContext: jest.fn(() => ({
    setCertificateUrl: jest.fn(),
    certificateUrl: '',
    badgeUrl: '',
    setBadgeUrl: jest.fn(),
    logoUrl: '',
    setLogoUrl: jest.fn(),
    signatureUrl: '',
    setSignatureUrl: jest.fn(),
  })),
}));

describe('CardSelector component', () => {
  test('renders correctly', () => {
    const { getByText, getByLabelText } = render(<CardSelector />);
    
    // Ensure that certain elements are rendered
    expect(getByText('Batch Issuance')).toBeInTheDocument();
    expect(getByText('Select a Template')).toBeInTheDocument();
    expect(getByLabelText('Upload Badge')).toBeInTheDocument();
    expect(getByLabelText('Upload Logo')).toBeInTheDocument();
    expect(getByLabelText('Upload Signature')).toBeInTheDocument();
  });

  test('selects a template card correctly', async () => {
    const { getByTestId } = render(<CardSelector />);
    
    // Mocking image selection
    const templateCard = getByTestId('template-card-1'); // Adjust the test ID based on your component implementation
    fireEvent.click(templateCard);
    
    // Wait for the template to be selected
    await waitFor(() => {
      expect(templateCard).toHaveClass('selected'); // Assuming you're applying a 'selected' class to the selected template card
    });
  });

  test('handles file uploads correctly', async () => {
    const { getByLabelText, getByText } = render(<CardSelector />);
    
    // Mocking file upload
    const fileInput = getByLabelText('Upload Badge'); // Adjust the label text based on your component implementation
    const testFile = new File(['test'], 'test.jpg', { type: 'image/jpeg' });
    Object.defineProperty(fileInput, 'files', {
      value: [testFile],
    });
    fireEvent.change(fileInput);

    // Wait for the file upload process
    await waitFor(() => {
      expect(getByText('Badge uploaded successfully')).toBeInTheDocument();
    });
  });

  test('handles template selection and redirects correctly', async () => {
    const { getByTestId, getByText } = render(<CardSelector />);
    
    // Mocking template selection
    const templateCard = getByTestId('template-card-1'); // Adjust the test ID based on your component implementation
    fireEvent.click(templateCard);

    // Mocking file uploads
    const uploadButton = getByText('Select this template'); // Adjust the button label based on your component implementation
    fireEvent.click(uploadButton);

    // Wait for the redirection process
    await waitFor(() => {
      expect(templateCard).toHaveClass('selected'); // Assuming you're applying a 'selected' class to the selected template card
      expect(uploadButton).toBeDisabled(); // Assuming you're disabling the button after template selection
      expect(window.location.href).toContain('/certificate/0'); // Assuming the selected card index is '0'
    });
  });
});
