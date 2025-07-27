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
})

const passwordSchema = Yup.object().shape({
  currentPassword: Yup.string().required('Required'),
  newPassword: Yup.string().min(6, 'Too short!').required('Required'),
  confirmNewPassword: Yup.string()
    .oneOf([Yup.ref('newPassword'), null], 'Passwords must match')
    .required('Required'),
});

const ProfilePage = () => {
  const [loading, setLoading] = useState(true);
  const [userData, setUserData] = useState();
  const [previewImage, setPreviewImage] = useState('./default-profile.png');
  const [isEditingProfile, setIsEditingProfile] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        const user = await profileService.getProfile();
        setUserData(user);
        setPreviewImage(user.profilePicture || './default-profile.png');
        setLoading(false);
      }
      catch (error) {
        console.error('Error fetching profile:', error);
        toast.error('Failed to load profile.');
        setLoading(false);
      }
      finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const handleProfileSubmit = async (values, { setSubmitting }) => {
    setSubmitting(true);
    toast.dismiss();       //dismiss any previous toast notifications

    try {
      const updateUser = await profileService.updateProfile({
        name: values.name,
        email: values.email
      });
      setUserData(updateUser);
      toast.success('Profile updated successfully!');
      setIsEditingProfile(false);  //Exit editing mode
    }
    catch (error) {
      console.error('Error updating profile:', error);
      toast.error('Failed to update profile.', error.message);
    }
    finally {
      setSubmitting(false);
    }
  };

  const handlePasswordSubmit = async (values, { setSubmitting, resetForm }) => {
    setSubmitting(true);
    toast.dismiss();       //dismiss any previous toast notifications

    try {
      await profileService.updatePassword({
        currentPassword: values.currentPassword,
        newPassword: values.newPassword,
        confirmNewPassword: values.confirmNewPassword
      });
      toast.success('Password changed successfully!');
      resetForm();  //Reset the form after successful submission
    }
    catch (error) {
      console.error('Error changing password:', error);
      toast.error('Failed to change password.', error.message);
    }
    finally {
      setSubmitting(false);
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result);
      };
      reader.readAsDataURL(file);

      // Upload the image to the server
      const formData = new FormData();
      formData.append('profilePicture', file);

      try {
        toast.info('Uploading profile picture...');
        const updatedProfile = profileService.updateProfile(formData);
        setUserData(updatedProfile);
        setUserData(updatedProfile);
        setPreviewImage(updatedProfile.profilePicture || reader.result);
        toast.success('Profile picture updated !');
      }
      catch (error) {
        console.error('Error uploading profile picture:', error);
        toast.error('Failed to upload profile picture.', error.message);
      }
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

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-100 p-8 pt-20">
        <div className="max-w-3xl mx-auto bg-white p-6 rounded-lg shadow-md">
          {/* Profile Picture */}
          <div className="flex items-center justify-center mb-8">
            <div className="relative group">
              {previewImage && typeof previewImage === 'string' && previewImage !== './default-profile.png' ? (
                <img
                  src={previewImage}
                  alt="Profile"
                  className="rounded-full h-32 w-32 object-cover border-4 border-indigo-500"
                  onError={(e) => {
                    e.target.src = 'https://placehold.co/200x200/cccccc/ffffff?text=Error';
                  }}
                />
              ) : (
                <div className="rounded-full h-32 w-32 bg-gray-200 flex items-center justify-center border-4 border-indigo-500">
                  <FaUser className="text-gray-500 text-6xl" />
                </div>
              )}
              <label className="absolute inset-0 bg-black bg-opacity-50 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 cursor-pointer">
                <HiPencil className="text-white text-xl" />
                <input type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
              </label>
            </div>
          </div>

          {/* Profile Information Section */}
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
              initialValues={userData}
              validationSchema={profileSchema}
              onSubmit={handleProfileSubmit}
              enableReinitialize
            >
              {({ isSubmitting, resetForm }) => (
                <Form className="space-y-4">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700">Name</label>
                    <Field
                      id="name"
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
                      id="email"
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
                          resetForm({ values: userData });
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

          {/* Change Password Section */}
          <div className="p-6 border border-gray-200 rounded-lg shadow-sm">
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
                      id="currentPassword"
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
                      id="newPassword"
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