const User = require('../models/User');
const bcrypt = require('bcryptjs');
const { cloudinary } = require('../config/cloudinary');
const Task = require('../models/Task');

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
        const { name, email, currentPassword, newPassword } = req.body;
        
        const user = await User.findById(req.user._id).select('+password');

        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        console.log('Updating profile with data:', currentPassword,' : ', newPassword)

        // handle email
        if (email && email !== user.email) {
            const userExists = await User.findOne({ email });
            if (userExists) return res.status(400).json({ success: false, message: 'Email already exists' });
            user.email = email;
        }

        // handle name
        if (name && name !== user.name) 
            user.name = name;

        // handle profile picture
        if (req.file) {
            // If a new file is uploaded, delete the old one if it exists
            if (user.profilePicture) {
                const publicId = user.profilePicture.split('/').pop().split('.')[0];
                await cloudinary.uploader.destroy(publicId);
            }

            // Upload the new file
            const result = await cloudinary.uploader.upload(req.file.path, { folder: "TODOS_APP_NODE_NEXT" }); // Add folder for consistency
            user.profilePicture = result.secure_url; // Store the Cloudinary URL
        }

        // handle update password
        if (currentPassword && newPassword) {
            const isMatch = await bcrypt.compare(currentPassword, user.password);
            if (!isMatch) return res.status(400).json({ success: false, message: 'Current password is incorrect' });
            user.password = newPassword;

            console.log(currentPassword, newPassword);
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

