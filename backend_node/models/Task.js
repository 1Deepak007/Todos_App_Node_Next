const mongoose = require("mongoose");
const User = require("./User");


const taskSchema = new mongoose.Schema({
    title:{
        type:String,
        required:[true, 'Please add a title for task.'],
        maxlength:[100, 'Title cannot exceed 100 characters.']
    },
    description:{
        type:String,
        required:[true, 'Please add a description for task.'],
        maxlength:[500, 'Description cannot exceed 500 characters.']
    },
    status:{
        type:String,
        enum: ['pending', 'working', 'completed'],
        default: 'pending'
    },
    priority:{
        type:String,
        enum: ['low', 'medium', 'high'],
        default: 'medium'
    },
    dueDate:{
        type:Date,
        required:[true, 'Please add a due date for task.'],
        validate:{
            validator: function(value){
                return value > new Date();
            },
            message: 'Due date cannot be in the past.'
        }
    },
    // user _id
    user: {
        type: mongoose.Schema.ObjectId,
        ref: User,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
}, {timestamps: true});

module.exports = mongoose.model('Task', taskSchema);