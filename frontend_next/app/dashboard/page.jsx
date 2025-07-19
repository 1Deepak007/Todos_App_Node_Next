"use client"

import Link from 'next/link'
import React from 'react'
import { useState, useEffect } from 'react'
import Navbar from '../components/Navbar'
import Modal from '../components/Modal'
import TaskForm from '../components/TaskForm'
import { toast } from 'react-toastify'
import { HiMiniPencilSquare } from "react-icons/hi2";
import { MdDeleteForever } from "react-icons/md";
import { AiOutlineFileDone } from "react-icons/ai";
import { FaCheck } from "react-icons/fa6";

const DashboardPage = () => {

  const [loading, setLoading] = useState(true);
  const [username, setUsername] = useState('User');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    setTimeout(() => {
      setLoading(false)
      setUsername('Adhrit')

      setTasks([
        { id: '1', title: 'Finish project report', description: 'Complete the Q3 financial report.', status: 'working', priority: 'high', dueDate: '2025-07-25' },
        { id: '2', title: 'Buy groceries', description: 'Milk, eggs, bread, vegetables.', status: 'pending', priority: 'medium', dueDate: '2025-07-20' },
        { id: '3', title: 'Buy groceries', description: 'Go to airport.', status: 'pending', priority: 'medium', dueDate: '2025-07-21' },
        { id: '4', title: 'Call client X', description: 'Discuss new requirements for phase 2.', status: 'incomplete', priority: 'high', dueDate: '2025-07-18' },
        { id: '5', title: 'Haircut', description: 'Go to barbar for haircut.', status: 'completed', priority: 'mediun', dueDate: '2025-07-19' },
      ]);

    }, 1000);
  }, []);

  const handleOpenModal = (task = null) => {
    setEditingTask(task);
    setIsModalOpen(true);
  }

  const handleCloseModal = () => {
    setEditingTask(null);
    setIsModalOpen(false);
  };

  const handleTaskSubmit = (values, { setSubmitting, resetForm }) => {
    if (editingTask) {
      console.log('Updating task:', values);
      toast.success('Task updated successfully!');
      handleCloseModal();
    }
    else {
      console.log('Creating task:', values);
      toast.success('Task created successfully!');
      setTasks([...tasks, { id: Date.now().toString(), ...values }]);
    }
    setTimeout(() => {
      setSubmitting(false);
      resetForm({ values: values });
    }, 1000);
  };

  const handleDeleteTask = (taskId) => {
    console.log('Deleting task with ID:', taskId);
    toast.success('Task deleted successfully!');
    setTasks(tasks.filter((task) => task.id !== taskId));
  };

  if (loading) {
    return (<><div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 text-gray-800">
      <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-indigo-500 mb-4"></div>
      <p className="text-lg">Loading your dashboard...</p>
    </div></>)
  }

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-100 text-gray-800 p-20">
        <div className="max-w-4xl mx-auto bg-white p-6 rounded-lg shadow-md">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Welcome, {username}!
          </h1>
          <p className="text-lg text-gray-600 mb-6">
            This is your personal task dashboard. Let's get things done!
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Placeholder for Task Summary Cards */}
            <div className="bg-blue-50 p-4 rounded-lg shadow-sm">
              <h3 className="text-xl font-semibold text-blue-700">Total Tasks</h3>
              <p className="text-3xl font-bold text-blue-900">{tasks.length}</p>
            </div>
            <div className="bg-yellow-50 p-4 rounded-lg shadow-sm">
              <h3 className="text-xl font-semibold text-yellow-700">Pending</h3>
              <p className="text-3xl font-bold text-yellow-900">{tasks.filter(task => task.status === 'pending').length}</p>
            </div>
            <div className="bg-green-50 p-4 rounded-lg shadow-sm">
              <h3 className="text-xl font-semibold text-green-700">Completed</h3>
              <p className="text-3xl font-bold text-green-900">{tasks.filter(task => task.status === 'completed').length}</p>
            </div>
          </div>

          <div className="mt-8 text-center">
            <p className="text-gray-500">Your tasks will appear here once you add them.</p>
            <button onClick={() => handleOpenModal()}
              className="mt-4 bg-indigo-600 text-white py-2 px-6 rounded-md shadow-md mb-4
                             hover:bg-indigo-700 hover:scale-105 transition duration-300 hover:size-md">
              Add New Task
            </button>
          </div>

          {tasks.length === 0 ? (
            <p className="text-gray-500 text-center py-8">No tasks yet. Click "Add New Task" to get started!</p>
          ) : (
            <div className='space-y-4'>
              {tasks.map(task => (
                <div key={task.id} className={`bg-gray-50 p-4 rounded-lg shadow-sm flex justify-between hover:scale-102 transition duration-300 ${task.status === 'completed' ? 'bg-gray-100' : task.status === 'working' ? 'bg-green-200' : task.status === 'pending' ? 'bg-yellow-200' : 'bg-red-200 font-bold text-white'}`}>
                  <div>
                    <h3 className={`text-lg font-semibold text-gray-900 ${ task.status === 'incomplete' ? 'line-through' : ''}`}>
                      {task.title}
                    </h3>
                    <p className={`text-sm text-gray-600 ${task.status === 'incomplete' ? 'line-through' : ''}`}>
                      {task.description}
                    </p>
                    <p className="text-xs text-gray-500 mt-2">
                      Status: <span className={`font-medium ${task.status === 'completed' ? 'text-green-600' : task.status === 'working' ? 'text-blue-600' : 'text-red-800'}`}>
                        {task.status}&nbsp;&nbsp;
                      </span>
                      Priority: <span className={`font-medium ${task.priority === 'high' ? 'text-red-600' : task.priority === 'medium' ? 'text-yellow-600' : 'text-green-600'}`}>
                        {task.priority}&nbsp;&nbsp;
                      </span>
                      Due Date: {task.dueDate}
                    </p>
                  </div>
                  <div className='flex space-x-2'>
                    <button
                      onClick={() => handleOpenModal(task)} // Pass the task object for editing
                      className="text-indigo-600 hover:text-indigo-800 text-2xl font-medium"
                      title="Edit Task"
                    >
                      <HiMiniPencilSquare/>
                    </button>
                    <button
                      onClick={() => handleDeleteTask(task.id)}
                      className="text-red-600 hover:text-red-800 text-2xl font-medium"
                      title="Delete Task"
                    >
                      <MdDeleteForever/>
                    </button>
                    {/* Status Toggle Buttons - for quick updates */}
                    {task.status !== 'completed' && (
                      <button
                        onClick={() => {
                          setTasks(tasks.map(t => t.id === task.id ? { ...t, status: 'completed' } : t));
                          toast.success(`Task "${task.title}" marked completed!`);
                        }}
                        className="text-green-600 hover:text-green-800 text-2xl font-medium"
                        title='Mark Completed'
                      >
                        <AiOutlineFileDone />
                      </button>
                    )}
                    {task.status === 'completed' && (
                        <FaCheck className="text-green-600 hover:text-green-800 text-2xl font-medium mt-6"/>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title={editingTask ? 'Edit Task' : 'Add New Task'}
      >
        <TaskForm
          initialValues={editingTask} // Pass the task data for editing
          onSubmit={handleTaskSubmit}
          isEditMode={!!editingTask} // Pass a boolean indicating edit mode
        />
      </Modal>
    </>
  )
}

export default DashboardPage
