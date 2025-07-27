const router = require('express').Router();
const {isAuthenticated} = require('../middleware/auth');
const {getAllTasks, createTask, updateTask, deleteTask, getTaskByTaskId} = require('../controllers/taskController');


router.post('/', isAuthenticated, createTask);
router.get('/', isAuthenticated, getAllTasks);      // get all tasks created by the user
router.get('/:id', isAuthenticated, getTaskByTaskId);    // get task by task's _id
router.patch('/:id', isAuthenticated, updateTask);
router.delete('/:id', isAuthenticated, deleteTask);


module.exports = router;