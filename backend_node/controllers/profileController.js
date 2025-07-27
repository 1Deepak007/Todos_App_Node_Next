const User = require('../models/User');
const bcrypt = require('bcryptjs');
const { cloudinary } = require('../config/cloudinary');
const Task = require('../models/task');

exports.getProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user._id).select('-password');

        res.status(200).json({ success: true, user });
    }
    catch (error) {
        res.status(500).json({ success: false, message: `Server Error : ${error.message}` });
    }
}

exports.updateProfile = async (req, res) => {
    try {
        const { name, email, profilePicture, currentPassword, newPassword } = req.params;
        const user = await User.findById(req.user._id);

        // handle email
        if (email && email !== user.email) {  // if email is provided and is not the same as the current email
            const userExists = await User.findOne({ email });
            if (userExists) return res.status(400).json({ success: false, message: 'Email already exists' });
            user.email = email;
        }

        // handle name
        if (name && name !== user.name) // if name is provided and is not the same as the current name
            user.name = name;

        // handle profile picture
        if (req.file) {
            if (user.profilePicture) {
                const publicId = user.profilePicture.split('/').pop().split('.')[0];
                await cloudinary.uploader.destroy(publicId);
            }
            user.profilePicture = req.file.path;
        }

        // handle password
        if (currentPassword && newPassword) {
            // decrypt current password and compare with new password
            const isMatch = await user.comparePassword(currentPassword);
            if (!isMatch) return res.status(400).json({ success: false, message: 'Incorrect current password' });
            user.password = await bcrypt.hash(newPassword, 10);
        }

        await user.save();

        res.status(200).json({ success: true, user });
    }
    catch (error) {
        res.status(500).json({ success: false, message: `Server Error : ${error.message}` });
    }
}


exports.deleteProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user._id);
        
        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        // Delete all user tasks
        await Task.deleteMany({ user: req.user._id });

        // Delete profile picture from Cloudinary if exists
        if (user.profilePicture) {
            try {
                // Extract the full public ID including folder path
                const url = user.profilePicture;
                const folderName = process.env.CLOUDINARY_FOLDER_NAME || 'TODOS_APP_NODE_NEXT';
                
                // Method 1: If URL contains the folder name
                let publicId;
                if (url.includes(folderName)) {
                    const parts = url.split(folderName + '/');
                    publicId = folderName + '/' + parts[1].split('.')[0];
                } 
                // Method 2: Fallback extraction
                else {
                    const matches = url.match(/\/upload(?:\/v\d+)?\/(.+?)\.\w+$/);
                    publicId = matches ? matches[1] : null;
                }

                if (publicId) {
                    console.log('Deleting Cloudinary image with public ID:', publicId);
                    await cloudinary.uploader.destroy(publicId);
                    
                    // Optional: Delete any other resources related to this user
                    // await cloudinary.api.delete_resources_by_prefix(`${folderName}/${req.user._id}`);
                }
            } catch (cloudinaryError) {
                console.error('Cloudinary deletion error:', cloudinaryError);
                // Continue with user deletion even if image deletion fails
            }
        }

        // Delete user account
        await User.findByIdAndDelete(req.user._id);
        
        // Clear authentication token
        res.clearCookie('token');
        
        res.status(200).json({ 
            success: true, 
            message: 'User and associated data deleted successfully' 
        });
    } catch (error) {
        console.error('Profile deletion error:', error);
        res.status(500).json({ 
            success: false, 
            message: `Server Error: ${error.message}` 
        });
    }
}

