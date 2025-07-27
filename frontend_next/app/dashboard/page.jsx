"use client"; // This must be a Client Component to manage state and user interaction

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation'; // For client-side navigation
import { toast, ToastContainer } from 'react-toastify'; // Import ToastContainer
import 'react-toastify/dist/ReactToastify.css'; // Import toastify CSS
import Modal from '../components/Modal'; // Import your Modal component
import TaskForm from '../components/TaskForm'; // Import your TaskForm component
import Navbar from '../components/Navbar';
import { HiMiniPencilSquare, HiLogout } from "react-icons/hi2"; // Import icons
import { tasksService } from '../services/tasks';
import { MdDeleteForever } from "react-icons/md";
import { FaCheck } from "react-icons/fa";
import { AiOutlineFileDone } from "react-icons/ai";


const DashboardPage = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentTaskToEdit, setCurrentTaskToEdit] = useState(null); // Stores the task object being edited
  const router = useRouter();

  // --- Function to fetch tasks ---
  const fetchTasks = async () => {
    setLoading(true);
    setError(null);
    try {
      const fetchedResponse = await tasksService.getAllTasks();
      // Ensure tasks is always an array, even if fetchedResponse.tasks is null/undefined
      setTasks(Array.isArray(fetchedResponse.tasks) ? fetchedResponse.tasks : []);
    } catch (err) {
      console.error("Error fetching tasks:", err);
      setError(err.message);
      // If unauthorized, redirect to login (this is a fallback, middleware should handle most of this)
      if (err.message.includes('unauthorized') || err.message.includes('Unauthorized')) {
        toast.error("Session expired or unauthorized. Please log in again.");
        router.push('/signuplogin');
      } else {
        toast.error(`Error fetching tasks: ${err.message || 'Unknown error'}`);
      }
      setTasks([]); // Reset tasks to empty array on error
    } finally {
      setLoading(false);
    }
  };

  // --- Fetch tasks on component mount ---
  useEffect(() => {
    fetchTasks();
  }, []); // Empty dependency array means run once on mount

  // --- Modal Control Functions ---
  const handleOpenModal = (task = null) => {
    setCurrentTaskToEdit(task); // Set the task data for the form
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setCurrentTaskToEdit(null); // Clear the task being edited when modal closes
    fetchTasks(); // Refresh tasks list to reflect any changes made (e.g. from the form)
  };

  // --- Delete Functionality ---
  const handleDeleteClick = async (taskId) => {
    if (!window.confirm("Are you sure you want to delete this task?")) {
      return;
    }
    try {
      await tasksService.deleteTask(taskId);
      toast.success("Task deleted successfully!");
      // No need for fetchTasks() here, handleCloseModal will do it,
      // or we can optimistically update the state. Let's keep fetchTasks()
      // in handleCloseModal and handleTaskFormSubmit for simplicity.
    } catch (err) {
      console.error("Error deleting task:", err);
      toast.error(`Error deleting task: ${err.message || 'Unknown error'}`);
    } finally {
      fetchTasks(); // Always re-fetch after delete attempt
    }
  };

  // --- Mark Completed Functionality ---
  const handleMarkCompleted = async (taskToComplete) => {
    try {
      const updatedTask = await tasksService.updateTask(taskToComplete._id, {
        ...taskToComplete,
        status: 'completed'
      });
      // Optimistically update the UI, assuming the API call was successful
      setTasks(prevTasks => Array.isArray(prevTasks) ? prevTasks.map(task =>
        task._id === updatedTask._id ? updatedTask : task
      ) : []);
      toast.success(`Task "${taskToComplete.title}" marked completed!`);
    } catch (error) {
      console.error("Error marking task as completed:", error);
      toast.error(`Failed to mark task as completed: ${error.message || 'Unknown error'}`);
    } finally {
      fetchTasks(); // Re-fetch to ensure state is in sync with backend
    }
  };


  // --- Task Form Submission Handler (for both Create and Update) ---
  const handleTaskFormSubmit = async (values, { setSubmitting, resetForm }) => {
    try {
      let response;
      if (currentTaskToEdit) {
        // --- UPDATE TASK ---
        response = await tasksService.updateTask(currentTaskToEdit._id, values);
        toast.success("Task updated successfully!");
      } else {
        // --- CREATE NEW TASK ---
        response = await tasksService.createTask(values);
        toast.success("Task added successfully!");
        resetForm(); // Clear form only for new task creation
      }
      // The onSubmitSuccess in TaskForm passes the API response.data directly
      // which should be the updated/created task object.
      // We don't need to call fetchTasks here if TaskForm calls onSubmitSuccess
      // and then handleCloseModal which itself calls fetchTasks().
    } catch (err) {
      console.error('Error submitting task:', err);
      toast.error(`Operation failed: ${err.response?.data?.message || err.message || 'Unknown error'}`);
    } finally {
      setSubmitting(false);
      handleCloseModal(); // Close modal and trigger fetchTasks
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 text-gray-800">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-indigo-500 mb-4" />
        <p className="text-lg">Loading your dashboard...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-4">
        <p className="text-red-500 text-lg mb-4">Error: {error}</p>
        <button
          onClick={fetchTasks}
          className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
        >
          Retry
        </button>
      </div>
    );
  }

  // Ensure tasks is always an array before filtering for stats
  const safeTasks = Array.isArray(tasks) ? tasks : [];
  const totalTasks = safeTasks.length;
  const workingTasks = safeTasks.filter(task => task.status === 'working').length;
  const pendingTasks = safeTasks.filter(task => task.status === 'pending').length;
  const completedTasks = safeTasks.filter(task => task.status === 'completed').length;
  // Calculate incomplete based on total minus completed
  const incompleteTasks = totalTasks - completedTasks;


  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-100 text-gray-800 p-4 sm:p-6 md:p-8 lg:p-10 xl:p-20">
        <div className="max-w-4xl mx-auto bg-white p-6 rounded-lg shadow-md">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            Welcome, User!
          </h1>
          <p className="text-base sm:text-lg text-gray-600 mb-6">
            This is your personal task dashboard. Let's get things done!
          </p>

          {/* Task Statistics Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            <div className="bg-blue-50 p-4 rounded-lg shadow-sm flex justify-between items-center">
              <h3 className="text-lg sm:text-xl font-semibold text-blue-700">Total Tasks</h3>
              <p className="text-lg sm:text-xl font-bold text-blue-900 me-1">{totalTasks}</p>
            </div>
            <div className="bg-green-200 p-4 rounded-lg shadow-sm flex justify-between items-center">
              <h3 className="text-lg sm:text-xl font-semibold text-green-700">Working</h3>
              <p className="text-lg sm:text-xl font-bold text-green-900 me-1">{workingTasks}</p>
            </div>
            <div className="bg-yellow-50 p-4 rounded-lg shadow-sm flex justify-between items-center">
              <h3 className="text-lg sm:text-xl font-semibold text-yellow-700">Pending</h3>
              <p className="text-lg sm:text-xl font-bold text-yellow-900 me-1">{pendingTasks}</p>
            </div>
            <div className="bg-lime-50 p-4 rounded-lg shadow-sm flex justify-between items-center">
              <h3 className="text-lg sm:text-xl font-semibold text-green-700">Completed</h3>
              <p className="text-lg sm:text-xl font-bold text-green-900 me-1">{completedTasks}</p>
            </div>
            <div className="bg-red-200 p-4 rounded-lg shadow-sm flex justify-between items-center">
              <h3 className="text-lg sm:text-xl font-semibold text-red-500">Incomplete</h3>
              <p className="text-lg sm:text-xl font-bold text-red-900 me-1">{incompleteTasks}</p>
            </div>
          </div>

          <div className="mt-8 text-center">
            <button
              onClick={() => handleOpenModal()} // Clear edit state for new task
              className="mt-4 bg-indigo-600 text-white py-2 px-6 rounded-md shadow-md mb-4
                         hover:bg-indigo-700 hover:scale-105 transition duration-300"
            >
              Add New Task
            </button>
          </div>

          {totalTasks === 0 ? (
            <p className="text-gray-600 text-center py-8">No tasks found. Click "Add New Task" to get started!</p>
          ) : (
            <div className="space-y-4">
              {/* Use safeTasks for mapping to ensure it's always an array */}
              {safeTasks.map((task) => (
                <div
                  key={task._id} // Use _id as key
                  className={`p-4 rounded-lg shadow-sm flex flex-col sm:flex-row justify-between items-start sm:items-center
                             hover:scale-[1.02] transition duration-300 ${task.status === 'completed' ? 'bg-gray-100' : task.status === 'working' ? 'bg-green-100' : task.status === 'pending' ? 'bg-yellow-100' : 'bg-red-100'}`}
                >
                  <div className="flex-grow">
                    <h3 className={`text-lg sm:text-xl font-semibold text-gray-900 ${task.status === 'completed' ? 'line-through text-gray-500' : ''}`}>
                      {task.title}
                    </h3>
                    {task.description && <p className={`text-sm text-gray-600 ${task.status === 'completed' ? 'line-through text-gray-400' : ''}`}>{task.description}</p>}
                    <div className="mt-2 text-sm text-gray-500">
                      <span className="mr-3">Status: <span className={`font-medium ${task.status === 'completed' ? 'text-green-600' : task.status === 'working' ? 'text-blue-600' : 'text-red-800'}`}>
                        {task.status}
                      </span></span>
                      <span className="mx-2">|</span>
                      <span className="mr-3">Priority: <span className={`font-medium ${task.priority === 'high' ? 'text-red-600' : task.priority === 'medium' ? 'text-yellow-600' : 'text-green-600'}`}>
                        {task.priority}
                      </span></span>
                      <span className="mx-2">|</span>
                      {task.dueDate && (
                        <span>Due: <span className="font-medium text-gray-700">{new Date(task.dueDate).toLocaleDateString()}</span></span>
                      )}
                    </div>
                  </div>
                  <div className="flex space-x-2 mt-4 sm:mt-0 sm:ml-4">
                    <button
                      onClick={() => handleOpenModal(task)}
                      className="p-2 rounded-full bg-blue-100 text-blue-600 hover:bg-blue-200"
                      title="Edit Task"
                    >
                      <HiMiniPencilSquare />
                    </button>
                    <button
                      onClick={() => handleDeleteClick(task._id)} // Use _id for delete
                      className="p-2 rounded-full bg-red-100 text-red-600 hover:bg-red-200"
                      title="Delete Task"
                    >
                      <MdDeleteForever />
                    </button>
                    {task.status !== 'completed' && (
                      <button
                        onClick={() => handleMarkCompleted(task)}
                        className="p-2 rounded-full bg-green-100 text-green-600 hover:bg-green-200"
                        title='Mark Completed'
                      >
                        <AiOutlineFileDone />
                      </button>
                    )}
                    {task.status === 'completed' && (
                      <FaCheck className="text-green-600 text-2xl font-medium self-center" />
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Modal for Add/Edit Task */}
      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title={currentTaskToEdit ? 'Edit Task' : 'Add New Task'}
      >
        <TaskForm
          initialValues={currentTaskToEdit || {}} // Pass the task data for editing
          onSubmitSuccess={handleTaskFormSubmit} // Pass the submit handler (renamed to handle submission success from TaskForm)
          isEditMode={!!currentTaskToEdit} // Pass boolean indicating edit mode
          taskId={currentTaskToEdit?._id || null} // Pass the task's _id for the API call
          onClose={handleCloseModal} // Allows TaskForm to close the modal itself
        />
      </Modal>
      <ToastContainer /> {/* Toastify container */}
    </>
  );
};

export default DashboardPage;
