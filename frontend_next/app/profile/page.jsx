// app/profile/page.jsx
"use client"; // This component uses useState, useEffect, Formik, and toastify

import { useState, useEffect } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { toast } from 'react-toastify';
import Navbar from '../components/Navbar'; // Import Navbar for this page

// Yup validation schema for updating basic profile info
const profileSchema = Yup.object().shape({
  name: Yup.string().required('Name is required'),
  email: Yup.string().email('Invalid email address').required('Email is required'),
});

// Yup validation schema for changing password
const passwordSchema = Yup.object().shape({
  currentPassword: Yup.string().required('Current password is required'),
  newPassword: Yup.string()
    .min(6, 'New password must be at least 6 characters')
    .required('New password is required'),
  confirmNewPassword: Yup.string()
    .oneOf([Yup.ref('newPassword'), null], 'Passwords must match')
    .required('Confirm new password is required'),
});

const ProfilePage = () => {
  const [loading, setLoading] = useState(true);
  const [userData, setUserData] = useState({
    name: '',
    email: '',
    // Add other profile fields here if you suggest them later
  });

  // Simulate fetching user data on component mount
  useEffect(() => {
    // In a real application, you would fetch this from your backend
    // For now, we'll use dummy data
    setTimeout(() => {
      setUserData({
        name: 'John Doe',
        email: 'john.doe@example.com',
      });
      setLoading(false);
    }, 1500);
  }, []);

  const handleProfileSubmit = (values, { setSubmitting, resetForm }) => {
    console.log('Updating profile:', values);
    toast.success('Profile updated successfully!');
    setTimeout(() => {
      setSubmitting(false);
      resetForm({ values: values }); // Keep the updated values in the form
    }, 1000);
  };

  const handlePasswordSubmit = (values, { setSubmitting, resetForm }) => {
    console.log('Changing password:', values);
    // In a real app, you would send currentPassword, newPassword to backend
    toast.success('Password changed successfully!');
    setTimeout(() => {
      setSubmitting(false);
      resetForm(); // Clear the password fields after submission
    }, 1000);
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 text-gray-800">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-indigo-500 mb-4"></div>
        <p className="text-lg">Loading profile...</p>
      </div>
    );
  }

  return (
    <>
      <Navbar /> {/* Display Navbar on the profile page */}
      <div className="min-h-screen bg-gray-100 text-gray-800 p-8 pt-20"> {/* Added pt-20 for Navbar spacing */}
        <div className="max-w-3xl mx-auto bg-white p-6 rounded-lg shadow-md">
          <h1 className="text-4xl font-bold text-gray-900 mb-6 text-center">Your Profile</h1>

          {/* Profile Information Section */}
          <div className="mb-8 p-6 border border-gray-200 rounded-lg shadow-sm">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">Update Profile Information</h2>
            <Formik
              initialValues={userData}
              validationSchema={profileSchema}
              onSubmit={handleProfileSubmit}
              enableReinitialize={true} // Important to re-initialize form when userData changes
            >
              {({ isSubmitting }) => (
                <Form className="space-y-4">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700">Name</label>
                    <Field
                      id="name"
                      name="name"
                      type="text"
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    />
                    <ErrorMessage name="name" component="div" className="text-red-500 text-sm mt-1" />
                  </div>
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email address</label>
                    <Field
                      id="email"
                      name="email"
                      type="email"
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    />
                    <ErrorMessage name="email" component="div" className="text-red-500 text-sm mt-1" />
                  </div>
                  {/* Add more profile fields here (e.g., phone, address, bio) */}
                  {/* Example:
                  <div>
                    <label htmlFor="bio" className="block text-sm font-medium text-gray-700">Bio</label>
                    <Field
                      id="bio"
                      name="bio"
                      as="textarea" // Use 'as' prop for textarea
                      rows="3"
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                      placeholder="Tell us about yourself..."
                    />
                  </div>
                  */}
                  <div>
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
                    >
                      {isSubmitting ? 'Updating...' : 'Update Profile'}
                    </button>
                  </div>
                </Form>
              )}
            </Formik>
          </div>

          {/* Change Password Section */}
          <div className="p-6 border border-gray-200 rounded-lg shadow-sm">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">Change Password</h2>
            <Formik
              initialValues={{ currentPassword: '', newPassword: '', confirmNewPassword: '' }}
              validationSchema={passwordSchema}
              onSubmit={handlePasswordSubmit}
            >
              {({ isSubmitting }) => (
                <Form className="space-y-4">
                  <div>
                    <label htmlFor="currentPassword" className="block text-sm font-medium text-gray-700">Current Password</label>
                    <Field
                      id="currentPassword"
                      name="currentPassword"
                      type="password"
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    />
                    <ErrorMessage name="currentPassword" component="div" className="text-red-500 text-sm mt-1" />
                  </div>
                  <div>
                    <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700">New Password</label>
                    <Field
                      id="newPassword"
                      name="newPassword"
                      type="password"
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    />
                    <ErrorMessage name="newPassword" component="div" className="text-red-500 text-sm mt-1" />
                  </div>
                  <div>
                    <label htmlFor="confirmNewPassword" className="block text-sm font-medium text-gray-700">Confirm New Password</label>
                    <Field
                      id="confirmNewPassword"
                      name="confirmNewPassword"
                      type="password"
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    />
                    <ErrorMessage name="confirmNewPassword" component="div" className="text-red-500 text-sm mt-1" />
                  </div>
                  <div>
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
                    >
                      {isSubmitting ? 'Changing...' : 'Change Password'}
                    </button>
                  </div>
                </Form>
              )}
            </Formik>
          </div>
        </div>
      </div>
    </>
  );
};

export default ProfilePage;
