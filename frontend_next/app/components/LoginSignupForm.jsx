// app/components/AuthForm.jsx
"use client";

import { useState, useEffect } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { toast } from 'react-toastify'; // Ensure you have react-toastify installed and configured in your app

// Define the Yup validation schemas for both login and signup
const loginSchema = Yup.object().shape({
  email: Yup.string().email('Invalid email address').required('Email is required'),
  password: Yup.string().required('Password is required').min(6, 'Password have to be at least 6 characters'),
});

const signupSchema = Yup.object().shape({
  name: Yup.string().required('Name is required'),
  email: Yup.string().email('Invalid email address').required('Email is required'),
  password: Yup.string()
    .min(6, 'Password must be at least 6 characters')
    .required('Password is required'),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref('password'), null], 'Passwords must match')
    .required('Confirm Password is required'),
});

const AuthForm = ({ initialMode = 'login' }) => {
  const [isLoginMode, setIsLoginMode] = useState(initialMode === 'login');

  // We are using a single initial values object that contains ALL possible fields.
  const initialValues = {
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  };

  const handleSubmit = (values, { setSubmitting, resetForm }) => {
    // Simulate API call based on the current mode
    if (isLoginMode) {
      console.log('Logging in with:', values);
      toast.success("Login successful! Redirecting...");
      setTimeout(() => {
        window.location.href = "/dashboard";
      }, 1000);
    } else {
      console.log('Signing up with:', values);
      toast.success("Account created successfully!");
    }

    setTimeout(() => {
      setSubmitting(false);
      resetForm(); // Reset form after successful submission
    }, 500);
  };

  // Handler for video errors
  const handleVideoError = (e) => {
    console.error("Video playback error:", e.target.error);
    if (e.target.error) {
      switch (e.target.error.code) {
        case e.target.error.MEDIA_ERR_ABORTED:
          console.error("Video playback aborted.");
          break;
        case e.target.error.MEDIA_ERR_NETWORK:
          console.error("A network error caused the video download to fail.");
          break;
        case e.target.error.MEDIA_ERR_DECODE:
          console.error("The video playback was aborted due to a corruption problem or because the video used features your browser does not support.");
          break;
        case e.target.error.MEDIA_ERR_SRC_NOT_SUPPORTED:
          console.error("The video could not be loaded, either because the server or network failed or because the format is not supported.");
          break;
        default:
          console.error("An unknown video error occurred.");
          break;
      }
    }
  };

  return (
    <div className="relative flex items-center justify-center min-h-screen overflow-hidden">
      <video
        autoPlay
        loop
        muted
        className="fixed inset-0 object-cover w-full h-full z-0"
        onError={handleVideoError} // Error handler for video loading issues
      >
        <source src="/animes/loginsignupbg.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video>
      <div className="fixed inset-0 bg-black opacity-50 z-10"></div>
      <div className="relative z-20 w-full max-w-md p-8 space-y-8 bg-white rounded-xl shadow-lg bg-opacity-90">
        <div className="text-center">
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
            {isLoginMode ? 'Login to your account' : 'Create a new account'}
          </h2>
        </div>

        <Formik
          initialValues={initialValues}
          validationSchema={isLoginMode ? loginSchema : signupSchema}
          onSubmit={handleSubmit}
          enableReinitialize={true}
        >
          {({ isSubmitting, resetForm }) => {
            useEffect(() => {
              resetForm();
            }, [isLoginMode, resetForm]);

            return (
              <Form className="space-y-6">
                {!isLoginMode && (
                  <div>
                    <label htmlFor="name" className="sr-only">Name</label>
                    <Field
                      id="name"
                      name="name"
                      type="text"
                      className="relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                      placeholder="Name"
                    />
                    <ErrorMessage name="name" component="div" className="text-red-500 text-sm mt-1" />
                  </div>
                )}

                <div>
                  <label htmlFor="email" className="sr-only">Email address</label>
                  <Field
                    id="email"
                    name="email"
                    type="email"
                    className="relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                    placeholder="Email address"
                  />
                  <ErrorMessage name="email" component="div" className="text-red-500 text-sm mt-1" />
                </div>

                <div>
                  <label htmlFor="password" className="sr-only">Password</label>
                  <Field
                    id="password"
                    name="password"
                    type="password"
                    className="relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                    placeholder="Password"
                  />
                  <ErrorMessage name="password" component="div" className="text-red-500 text-sm mt-1" />
                </div>

                {!isLoginMode && (
                  <div>
                    <label htmlFor="confirmPassword" className="sr-only">Confirm Password</label>
                    <Field
                      id="confirmPassword"
                      name="confirmPassword"
                      type="password"
                      className="relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                      placeholder="Confirm Password"
                    />
                    <ErrorMessage name="confirmPassword" component="div" className="text-red-500 text-sm mt-1" />
                  </div>
                )}

                <div>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
                  >
                    {isSubmitting ? (isLoginMode ? 'Logging in...' : 'Creating account...') : (isLoginMode ? 'Login' : 'Create Account')}
                  </button>
                </div>
              </Form>
            );
          }}
        </Formik>

        <div className="text-center mt-4">
          <p className="text-sm text-gray-600">
            {isLoginMode ? "Don't have an account?" : "Already have an account?"}{' '}
            <button
              type="button"
              onClick={() => setIsLoginMode(prevMode => !prevMode)}
              className="font-medium text-indigo-600 hover:text-indigo-500 focus:outline-none"
            >
              {isLoginMode ? 'Sign Up' : 'Login'}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default AuthForm;
