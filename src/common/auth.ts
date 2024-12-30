// auth.ts

export const isStrongPassword = (password: string): { isValid: boolean; errorMessage?: string } => {
    const minLength = 8;
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);
    const hasUpperCase = /[A-Z]/.test(password);
  
    if (password.length < minLength) {
      return { isValid: false, errorMessage: 'Password should be at least 8 characters long.' };
    }
  
    if (!hasSpecialChar) {
      return { isValid: false, errorMessage: 'Password should contain a special character.' };
    }
  
    if (!hasUpperCase) {
      return { isValid: false, errorMessage: 'Password should have an uppercase letter.' };
    }
  
    // If all checks pass, the password is considered strong
    return { isValid: true };
  };
  
  export const validateEmail = (email: string) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };

export const logout = () => {
  // Clear localStorage
  localStorage.removeItem("User");

  // Redirect to the login page
  window.location.href = "/"; // Update the URL as needed
};
