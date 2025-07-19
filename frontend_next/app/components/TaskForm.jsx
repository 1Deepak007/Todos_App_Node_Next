"use client";

import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { toast } from 'react-toastify';

const taskSchema = Yup.object().shape({
  title: Yup.string().required('Title is required').max(100, 'Title cannot exceed 100 characters'),
  description: Yup.string().max(500, 'Description cannot exceed 500 characters'),
  status: Yup.string().oneOf(['pending', 'working', 'completed'], 'Invalid status').required('Status is required'),
  priority: Yup.string().oneOf(['low', 'medium', 'high'], 'Invalid priority').required('Priority is required'),
  dueDate: Yup.date().nullable().min(new Date(), 'Due date cannot be in the past').required('Due date is required'),
});

const TaskForm = ({ initialValues, onSubmit, isEditMode = false }) => {
  const defaultInitialValues = {
    title: '',
    description: '',
    status: 'pending',
    priority: 'medium',
    dueDate: '', 
  };


  const formInitialValues = isEditMode ? initialValues : defaultInitialValues;

  return (
    <Formik
      initialValues={formInitialValues}
      validationSchema={taskSchema}
      onSubmit={onSubmit}
      enableReinitialize={isEditMode} // Reinitialize if in edit mode and initialValues change
    >
      {({ isSubmitting }) => (
        <Form className="space-y-4">
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700">Title</label>
            <Field
              id="title"
              name="title"
              type="text"
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              placeholder="e.g., Finish project report"
            />
            <ErrorMessage name="title" component="div" className="text-red-500 text-sm mt-1" />
          </div>

          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700">Description</label>
            <Field
              id="description"
              name="description"
              as="textarea" 
              rows="3"
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              placeholder="Details about the task..."
            />
            <ErrorMessage name="description" component="div" className="text-red-500 text-sm mt-1" />
          </div>

          <div>
            <label htmlFor="status" className="block text-sm font-medium text-gray-700">Status</label>
            <Field
              id="status"
              name="status"
              as="select" 
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            >
              <option value="pending">Pending</option>
              <option value="working">Working</option>
              <option value="completed">Completed</option>
            </Field>
            <ErrorMessage name="status" component="div" className="text-red-500 text-sm mt-1" />
          </div>

          <div>
            <label htmlFor="priority" className="block text-sm font-medium text-gray-700">Priority</label>
            <Field
              id="priority"
              name="priority"
              as="select"
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </Field>
            <ErrorMessage name="priority" component="div" className="text-red-500 text-sm mt-1" />
          </div>

          <div>
            <label htmlFor="dueDate" className="block text-sm font-medium text-gray-700">Due Date</label>
            <Field
              id="dueDate"
              name="dueDate"
              type="date" 
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
            <ErrorMessage name="dueDate" component="div" className="text-red-500 text-sm mt-1" />
          </div>

          <div>
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
            >
              {isSubmitting ? 'Saving...' : (isEditMode ? 'Update Task' : 'Add Task')}
            </button>
          </div>
        </Form>
      )}
    </Formik>
  );
};

export default TaskForm;