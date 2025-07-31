"use client";
import { useState, useEffect } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { toast } from 'react-toastify';
import Navbar from '../components/Navbar';
import { HiPencil } from "react-icons/hi";
import { FaUser } from "react-icons/fa";
import profileService from '../services/profile';

const profileSchema = Yup.object().shape({
  name: Yup.string().required('Name is required'),
  email: Yup.string().email('Invalid email').required('Email is required'),
});

const passwordSchema = Yup.object().shape({
  currentPassword: Yup.string().required('Current password is required'),
  newPassword: Yup.string().min(6, 'Password must be at least 6 characters').required('New password is required'),
  confirmNewPassword: Yup.string()
    .oneOf([Yup.ref('newPassword'), null], 'Passwords must match')
    .required('Confirm password is required'),
});

const ProfilePage = () => {
  const [loading, setLoading] = useState(true);
  const [userData, setUserData] = useState(null);
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);


  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const response = await profileService.getProfile();
      setUserData(response.user);
    } catch (error) {
      console.error('Error fetching profile:', error);
      toast.error('Failed to load profile.');
    } finally {
      setLoading(false);
    }
  };

  const handleProfileSubmit = async (values, { setSubmitting }) => {
    try {
      const response = await profileService.updateProfile(values);
      setUserData(response.user);
      toast.success('Profile updated successfully!');
      setIsEditingProfile(false);
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error(error.message || 'Failed to update profile.');
    } finally {
      setSubmitting(false);
    }
  };

  const handlePasswordSubmit = async (values, { resetForm, setSubmitting }) => {
    try {
      await profileService.updatePassword({
        currentPassword: values.currentPassword,
        newPassword: values.newPassword
      });
      toast.success('Password changed successfully!');
      resetForm();
    } catch (error) {
      console.error('Error changing password:', error);
      toast.error(error.message || 'Failed to change password.');
    } finally {
      setSubmitting(false);
    }
  };


  const handleDeleteAccount = async () => {
    if (!window.confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
      return;
    }

    try {
      setIsDeleting(true);
      await profileService.deleteProfile();
      toast.success('Account deleted successfully');
      // Redirect to login or home page after deletion
      window.location.href = '/';
    } catch (error) {
      console.error('Error deleting account:', error);
      toast.error(error.message || 'Failed to delete account.');
    } finally {
      setIsDeleting(false);
    }
  };

  const [isUploading, setIsUploading] = useState(false);
  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return toast.error('No file selected.');

    setIsUploading(true);
    const formData = new FormData();
    formData.append('profilePicture', file);
    try {
      const response = await profileService.updateProfile(formData, true);     // Pass true to indicate this is an image upload
      setUserData(prev => ({ ...prev, profilePicture: response.user.profilePicture || prev.profilePicture }));
      toast.success('Profile picture updated successfully!');
    } catch (error) {
      console.error('Error uploading profile picture:', error);
      toast.error(error.message || 'Failed to upload profile picture.');
    } finally {
      setIsUploading(false);
      await fetchProfile();  // Refresh profile data after image upload
    }
  };

  if (loading || !userData) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-indigo-500 mb-4"></div>
        <p className="text-lg">Loading profile...</p>
      </div>
    );
  }

  console.log('User Data:', userData);

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-100 p-8 pt-20">
        <div className="max-w-3xl mx-auto bg-white p-6 rounded-lg shadow-md">
          {/* Profile Picture */}
          <div className="flex items-center justify-center mb-8">
            <div className="relative group">
              <img
                src={userData?.profilePicture}
                alt="Profile"
                className="rounded-full h-32 w-32 object-cover border-4 border-indigo-500"
              />
              <label className="absolute inset-0 bg-black bg-opacity-50 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 cursor-pointer transition-opacity duration-200">
                {
                  isUploading ? (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-white">
                        <span className="sr-only">Loading...</span>
                      </div>
                    </div>)
                    :
                    (<>
                        <HiPencil className="text-white text-xl" />
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleImageChange}
                          className="hidden"
                        />
                    </>)
                }
              </label>
            </div>
          </div>

          {/* Profile Information */}
          <div className="mb-8 p-6 border border-gray-200 rounded-lg shadow-sm">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-semibold text-gray-800">Profile Information</h2>
              {!isEditingProfile && (
                <button
                  onClick={() => setIsEditingProfile(true)}
                  className="text-indigo-600 hover:text-indigo-800 flex items-center space-x-1"
                >
                  <HiPencil className="text-xl" />
                  <span>Edit</span>
                </button>
              )}
            </div>

            <Formik
              initialValues={{
                name: userData.name,
                email: userData.email
              }}
              validationSchema={profileSchema}
              onSubmit={handleProfileSubmit}
              enableReinitialize
            >
              {({ isSubmitting, resetForm }) => (
                <Form className="space-y-4">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700">Name</label>
                    <Field
                      name="name"
                      type="text"
                      disabled={!isEditingProfile}
                      className={`mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm ${!isEditingProfile ? 'bg-gray-50 cursor-not-allowed' : 'bg-white'
                        }`}
                    />
                    <ErrorMessage name="name" component="div" className="text-red-500 text-sm mt-1" />
                  </div>

                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
                    <Field
                      name="email"
                      type="email"
                      disabled={!isEditingProfile}
                      className={`mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm ${!isEditingProfile ? 'bg-gray-50 cursor-not-allowed' : 'bg-white'
                        }`}
                    />
                    <ErrorMessage name="email" component="div" className="text-red-500 text-sm mt-1" />
                  </div>

                  {isEditingProfile && (
                    <div className="flex justify-end space-x-3 pt-4">
                      <button
                        type="button"
                        onClick={() => {
                          resetForm();
                          setIsEditingProfile(false);
                        }}
                        className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50"
                      >
                        {isSubmitting ? 'Saving...' : 'Save Changes'}
                      </button>
                    </div>
                  )}
                </Form>
              )}
            </Formik>
          </div>

          {/* Change Password */}
          <div className="mb-8 p-6 border border-gray-200 rounded-lg shadow-sm">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">Change Password</h2>
            <Formik
              initialValues={{
                currentPassword: '',
                newPassword: '',
                confirmNewPassword: ''
              }}
              validationSchema={passwordSchema}
              onSubmit={handlePasswordSubmit}
            >
              {({ isSubmitting }) => (
                <Form className="space-y-4">
                  <div>
                    <label htmlFor="currentPassword" className="block text-sm font-medium text-gray-700">
                      Current Password
                    </label>
                    <Field
                      name="currentPassword"
                      type="password"
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    />
                    <ErrorMessage name="currentPassword" component="div" className="text-red-500 text-sm mt-1" />
                  </div>

                  <div>
                    <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700">
                      New Password
                    </label>
                    <Field
                      name="newPassword"
                      type="password"
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    />
                    <ErrorMessage name="newPassword" component="div" className="text-red-500 text-sm mt-1" />
                  </div>

                  <div>
                    <label htmlFor="confirmNewPassword" className="block text-sm font-medium text-gray-700">
                      Confirm New Password
                    </label>
                    <Field
                      name="confirmNewPassword"
                      type="password"
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    />
                    <ErrorMessage name="confirmNewPassword" component="div" className="text-red-500 text-sm mt-1" />
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
                  >
                    {isSubmitting ? 'Changing...' : 'Change Password'}
                  </button>
                </Form>
              )}
            </Formik>
          </div>

          {/* Delete Account */}
          <div className="p-6 border border-red-200 rounded-lg shadow-sm bg-red-50">
            <h2 className="text-2xl font-semibold text-red-800 mb-2">Delete Account</h2>
            <p className="text-red-600 mb-4">This action cannot be undone. All your data will be permanently deleted.</p>
            <button
              onClick={handleDeleteAccount}
              disabled={isDeleting}
              className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50"
            >
              {isDeleting ? 'Deleting...' : 'Delete My Account'}
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default ProfilePage;