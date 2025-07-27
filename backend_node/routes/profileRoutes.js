const router = require("express").Router();
const { isAuthenticated } = require("../middleware/auth");
const {getProfile, updateProfile, deleteProfile} = require("../controllers/profileController");
const multer = require('multer');
const { storage } = require("../config/cloudinary");  
const upload = multer({ storage });

router.get("/", isAuthenticated , getProfile);
router.patch("/update", isAuthenticated, upload.single("profilePicture") , updateProfile);
router.delete("/delete", isAuthenticated, deleteProfile);

module.exports = router;