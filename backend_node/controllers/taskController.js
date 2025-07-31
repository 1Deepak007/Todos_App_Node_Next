const Task = require('../models/Task');



// res.send({user:req.user});   user details

exports.createTask = async (req, res) => {    
    const {title, description, status, priority, dueDate } = req.body;

    const fields = []
    if (!title ? fields.push('title') : null || !description ? fields.push('description') : null || !status ? fields.push('status') : null || !priority ? fields.push('priority') : null || !dueDate ? fields.push('dueDate') : null)
        return res.status(400).json({
            success: false, message: 'Please add all fields. ', 'missing fields ':fields
        });
    if (dueDate < Date.now()) 
        return res.status(400).json({success: false, message: 'Due date and time should be of future.'});
    else
        try {
            const payload = {title, description, status, priority, dueDate, user:req.user._id};
            const task = await Task.create(payload);
            res.status(201).json({success: true, task});
        } catch (error) {
            res.status(500).json({success: false, message: `Server Error : ${error.message}`});
        }
}


// get all tasks from collection
exports.getAllTasks = async (req, res) => {
    try {
        // Since we already have the user from isAuthenticated middleware
        // We can just use req.user instead of calling getUserFromToken again
        const tasks = await Task.find({ user: req.user._id });

        res.status(200).json({
            success: true,
            taskCount: tasks.length,
            tasks: tasks,
            // user:req.user
        });
        
    } catch (error) {
        console.error(error);
        res.status(500).json({ 
            success: false, 
            message: 'Server error while fetching tasks',
            error: error.message 
        });
    }
};

// get a task by task's _id
exports.getTaskByTaskId = async (req, res) => {
    try {
        const task = await Task.findById(req.params.id);
        if (!task) {
            return res.status(404).json({ success: false, message: 'Task not found' });
        }
        res.status(200).json({ success: true, task });
    } catch (error) {
        res.status(500).json({ success: false, message: `Server Error : ${error.message}` });
    }
}

exports.updateTask = async (req, res) => {
    try{
        const task = await Task.findById(req.params.id);
        if (!task) {
            return res.status(404).json({ success: false, message: 'Task not found' });
        }
        else{
            const { title, description, status, priority, dueDate } = req.body;
            if (title) task.title = title;
            if (description) task.description = description;
            if (status) task.status = status;
            if (priority) task.priority = priority;
            if (dueDate) task.dueDate = dueDate;
            await task.save();
            res.status(200).json({ success: true, task });
        }
    }
    catch (error) {
        res.status(500).json({ success: false, message: `Server Error : ${error.message}` });
    }
}

exports.deleteTask = async(req, res) => {
    try{
        const task = await Task.findByIdAndDelete(req.params.id);
        if (!task) {
            return res.status(404).json({ success: false, message: 'Task not found' });
        }
        else{
            res.status(200).json({ success: true, message: 'Task deleted successfully' });
        }
    }
    catch (error) {
        res.status(500).json({ success: false, message: `Server Error : ${error.message}` });
    }
}
