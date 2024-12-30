import React from 'react';
import { render } from '@testing-library/react';
import { useRouter } from 'next/router';
import CertificatePage from '../src/pages/certificate/[id]';

// Mocking useRouter hook since it's being used in the component
jest.mock('next/router', () => ({
  useRouter: jest.fn(),
}));

describe('CertificatePage component', () => {
  test('renders error message when certificate ID is not provided', () => {
    // Mocking useRouter to return an empty query object
    useRouter.mockReturnValueOnce({
      query: {},
    });

    const { getByText } = render(<CertificatePage />);
    expect(getByText('Error: Certificate ID not provided')).toBeInTheDocument();
  });

  test('renders error message when certificate ID is invalid', () => {
    // Mocking useRouter to return an invalid certificate ID
    useRouter.mockReturnValueOnce({
      query: { id: [] },
    });

    const { getByText } = render(<CertificatePage />);
    expect(getByText('Error: Invalid Certificate ID')).toBeInTheDocument();
  });

  test('renders CertificateDisplayPage component with valid certificate ID', () => {
    // Mocking useRouter to return a valid certificate ID
    useRouter.mockReturnValueOnce({
      query: { id: '123' },
    });

    const { getByTestId } = render(<CertificatePage />);
    expect(getByTestId('certificate-display-page')).toBeInTheDocument();
  });

  // Additional tests can be added for other scenarios as needed
});
