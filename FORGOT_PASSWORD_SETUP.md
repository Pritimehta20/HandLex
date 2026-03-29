# Forgot Password Feature - Setup Guide

This document explains how to set up and configure the Forgot Password with OTP authentication feature.

## Feature Overview

The forgot password feature includes:
1. **Step 1**: User enters email address
2. **Step 2**: System sends a 6-digit OTP to the user's email
3. **Step 3**: User verifies the OTP
4. **Step 4**: User creates a new password and it's updated in the database

## Backend Setup

### 1. Install Nodemailer
The nodemailer package is already installed. If not, run:
```bash
cd Backend
npm install nodemailer
```

### 2. Configure Environment Variables

Create a `.env` file in the `Backend` folder (use `.env.example` as a template):

```properties
# Email Configuration
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-app-specific-password
```

#### For Gmail Users:
1. Enable 2-Step Verification on your Gmail account: https://myaccount.google.com/security
2. Generate an App Password: https://myaccount.google.com/apppasswords
3. Copy the 16-character password and use it as `EMAIL_PASSWORD` in your `.env` file


```

Or use custom SMTP settings:
```javascript


### 3. Database Changes

The User model has been updated with two new fields:
- `resetOTP`: Stores the 6-digit OTP
- `resetOTPExpires`: Stores the OTP expiration time (10 minutes from generation)

These fields are automatically handled by the backend.

## Backend Endpoints

```
**Response**:
```json

## Frontend Setup

### 1. Router Configuration
The ForgotPassword page has been added to the router with the path `/forgot-password`

### 2. UI Components

#### Login Page Changes
- Added "Forgot Password?" link below the password input field
- Clicking it navigates to the Forgot Password page
- Users can click "Back to Login" to return

#### ForgotPassword Page
A new page with 3 steps:
1. **Step 1 - Email**: User enters their email address
2. **Step 2 - OTP Verification**: User enters the 6-digit OTP received via email
3. **Step 3 - New Password**: User creates a new password with confirmation

Features:
- Step indicator showing progress
- Email validation
- OTP input (6 digits only)
- Password validation (minimum 6 characters)
- Password confirmation matching
- Success and error messages
- Responsive design for mobile device

## Testing the Feature

1. **Start the Backend Server**:
   ```bash
   cd Backend
   npm run dev
   ```

2. **Start the Frontend Development Server**:
   ```bash
   cd frontend
   npm run dev
   ```

3. **Test the Flow**:
   - Navigate to the Login page
   - Click "Forgot Password?"
   - Enter a registered email
   - Check your email for the OTP (6-digit code)
   - Enter the OTP on the next screen
   - Create a new password
   - The password is updated in the database
   - You can now log in with your new password

## Security Features

1. **OTP Expiration**: OTPs expire after 10 minutes
2. **Password Hashing**: New passwords are hashed using bcryptjs before saving
3. **Email Masking**: Email addresses are masked in responses for security
4. **Input Validation**: All inputs are validated on both frontend and backend

## Troubleshooting

### Emails Not Being Sent
1. Check that `EMAIL_USER` and `EMAIL_PASSWORD` are correctly set in `.env`
2. For Gmail, ensure you're using an App Password (not your regular password)
3. Check the backend console for error messages
4. Ensure that the email service allows less secure apps (if applicable)

### OTP Not Matching
1. Make sure to enter the exact OTP from the email
2. Check that the OTP hasn't expired (valid for 10 minutes)
3. OTPs are case-sensitive

### Database Issues
1. Ensure MongoDB is running
2. Check the database connection string in `.env`
3. Verify that the User model migrations are applied

## Files Modified/Created




## Future Enhancements

Possible improvements:
1. Add rate limiting to prevent OTP request spam
2. Add email verification status tracking
3. Add OTP resend limit counter
4. Add password reset history logging
5. Add two-factor authentication (2FA)
6. Send reset success notification email
7. Add SMS OTP option
