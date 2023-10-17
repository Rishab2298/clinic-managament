const userModel = require("../models/userModels");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const doctorModel = require("../models/doctorModel");

//register callback
// Register callback
const registerController = async (req, res) => {
  try {
    const existingUser = await userModel.findOne({ email: req.body.email });
    if (existingUser) {
      return res.status(200).send({ message: "User Already Exists", success: false });
    }

    // Check if req.body.password is defined
    if (!req.body.password) {
      return res.status(400).send({ message: "Password is missing", success: false });
    }

    const password = req.body.password;
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    req.body.password = hashedPassword;
    
    const newUser = new userModel(req.body);
    await newUser.save();
    
    res.status(201).send({ message: "Registered Successfully", success: true });
  } catch (error) {
    console.error(error); // Log the error for debugging
    res.status(500).send({
      success: false,
      message: `Register Controller ${error.message}`,
    });
  }
};
// login callback

const loginController = async (req, res) => {
  try {
    
    const user = await userModel.findOne({ email: req.body.email });
    if (!user) {
      return res
        .status(200)
        .send({ message: "user not found", success: false });
    }
    const isMatch = await bcrypt.compare(req.body.password, user.password);
    if (!isMatch) {
      return res
        .status(200)
        .send({ message: "Invlid Email or Password", success: false });
    }
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });
    let role = "user"; // Default role, change it as needed

    if (user.isAdmin) {
      role = "admin";
    } else if (user.isDoctor) {
      role = "doctor";
    } else if (user.isPatient) {
      role = "patient";
    } else if (user.isUser) {
      role = "user";
    };
    res.status(200).send({ message: "Login Success", success: true, token,role });
  } catch (error) {
    console.log(error);
    res.status(500).send({ message: `Error in Login CTRL ${error.message}` });
  }
};
// Auth Controller
const authController = async (req, res) => {
  try {
    const user = await userModel.findById({ _id: req.body.userId });
    user.password = undefined;
    if (!user) {
      return res.status(200).send({
        message: "user not found",
        success: false,
      });
    } else {
      res.status(200).send({
        success: true,
        data: user,
      });
    }
  } catch (error) {
    console.log(error);
    res.status(500).send({
      message: "auth error",
      success: false,
      error,
    });
  }
};
//Apply Doctor Controller
const applyDoctorController = async (req, res) => {
  try {
    const newDoctor = await doctorModel({ ...req.body, status: "pending" });
    await newDoctor.save();
    console.log(newDoctor);
    const adminUser = await userModel.findOne({ isAdmin: true });
    console.log(adminUser);
    const notification = adminUser.notifications;
    notification.push({
      key : `${newDoctor._id}-apply-doctor-request`,
      type: "apply-doctor-request",
      message: `${newDoctor.firstName} ${newDoctor.lastName} Has Applied For A Doctor Account`,
      data: {
        doctorId: newDoctor._id,
        name: newDoctor.firstName + " " + newDoctor.lastName,
        onClickPath: "/admin/docotrs",
      },
    });
    
    await userModel.findByIdAndUpdate(adminUser._id, { notifications: notification });
    res.status(201).send({
      success: true,
      message: "Doctor Account Applied SUccessfully",
    });
    
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      error,
      message: "Error WHile Applying For Doctotr",
    });
  }
};


//Notification ctrl
const getAllNotificationController = async (req, res) => {
  try {
    const user = await userModel.findById({ _id: req.body.userId });
    const seennotification = user.seennotification;
    const notifications = user.notifications;
    seennotification.push(...notifications);
    user.notifications = []; // Clear only the notifications array
    const updatedUser = await user.save();
  
    return res.status(200).send({
      message: "all notifications marked as read",
      success: true,
      data: updatedUser,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      message: "Error while getting notification",
      success: false,
      error,
    });
  }
}

const deleteAllNotificationController = async (req, res) => {
  try {
    const user = await userModel.findById({ _id: req.body.userId });
    user.seennotification = []; // Clear only the notifications array
    const updatedUser = await user.save();
    
  
    return res.status(200).send({
      message: "all notifications are deleted",
      success: true,
      data: updatedUser,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      message: "Error while deleting notification",
      success: false,
      error,
    });
  }
}
// Get All DOc

const getAllDoctorsController = async (req, res) => {
  try {
    const doctors = await doctorModel.find({ status: "approved" });

    res.status(200).send({
      message: "all doctors",
      success: true,
      data: doctors,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      message: "Error while getting doctors",
      success: false,
      error,
    });
  }
}
module.exports = { loginController, getAllDoctorsController , registerController, authController, applyDoctorController, getAllNotificationController, deleteAllNotificationController };


