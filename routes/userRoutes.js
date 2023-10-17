const express = require("express");
const {
  loginController,
  registerController,
  authController,
  applyDoctorController,
  getAllNotificationController,
  deleteAllNotificationController,
  getAllDoctorsController
} = require("../controllers/userCtrl");
const authMiddleware = require("../middlewares/authMiddleware.js");

//router onject
const router = express.Router();

//routes
//LOGIN || POST
router.post("/login", loginController);

//REGISTER || POST
router.post("/register", registerController);

//Auth || POST
router.post("/get-user-data", authMiddleware, authController);
//Apply Doctor || POST
router.post("/apply-doctor", authMiddleware, applyDoctorController);
//Notification Doctor Get || POST
router.post("/get-all-notification", authMiddleware, getAllNotificationController);
//Notification Doctor Delete || POST
router.post("/delete-all-notification", authMiddleware, deleteAllNotificationController);

// Get All Doc

router.get('/get-all-doc', authMiddleware, getAllDoctorsController);

module.exports = router;