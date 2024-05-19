const Task = require('../models/taskModel')
const admin = require('firebase-admin')
const User = require('../models/userModel')
const jwt = require('jsonwebtoken')
const nodemailer = require('nodemailer')
const serviceAccount = require('../middleware/serviceAccountKey.json')
const { response } = require('express')


admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});


const createTask = async (req, res) => {
  try {
    const { title, text, due_date } = req.body;
    const { user, userId } = req;
    const task = { title, text, due_date, createdBy: userId };
    const newTask = await Task.create(task);

    // Calculate time differences
    const now = new Date();
    const diffMs = new Date(due_date) - now;
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    const diffHours = Math.floor((diffMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));

    let notificationTitle = 'Task Reminder';
    let notificationBody;

    // Send notifications based on time differences
    if (diffDays === 2 || (diffDays === 1 && diffHours === 0)) {
      notificationBody = `Your task "${title}" is due in ${diffDays} days and ${diffHours} hours`;
    } else if (diffHours === 2) {
      notificationBody = `Your task "${title}" is due in ${diffHours} hours`;
    }

    if (notificationBody) {
      // Send notifications
      await Promise.all(user.token.map(async (userToken) => {
        try {
          await sendNotification(userToken, notificationTitle, notificationBody);
        } catch (error) {
          console.error(`Error sending notification to token ${userToken}:`, error.message);
        }
      }));
    }

    // Send email notification
    const emailContent = {
      to: user.email,
      subject: 'Task Reminder',
      text: `Your task "${title}" is due in ${diffDays} days and ${diffHours} hours`
    };
    await sendEmail(emailContent);

    return res.status(201).json({ message: 'New task created', newTask, notificationTitle, notificationBody });
  } catch (error) {
    console.error('Error creating task:', error);
    return res.status(500).json({ message: 'Error creating task', error: error.message });
  }
};

// send   firebase notification
const sendNotification = async (userToken, title, body) => {
  const message = {
    notification: {
      title: title,
      body: body
    },
    token: userToken
  };

  try {
    const response = await admin.messaging().send(message);
    console.log('Notification sent successfully:', response);
    return response;
  } catch (error) {
    console.error('Error sending notification:', error.message);
    throw new Error('Error sending notification:', error.message);
  }
};

// email notification
const sendEmail = async (emailContent) => {
  try {
    console.log(emailContent);

    const transporter = nodemailer.createTransport({
      host: process.env.E_host,
      port: 587,
      auth: {
        user: process.env.E_user,
        pass: process.env.E_pass
      }
    });

    await transporter.sendMail({
      from: process.env.E_user,
      to: emailContent.to,
      subject: emailContent.subject,
      text: emailContent.text
    });

    console.log('Email sent successfully');
    return true;
  } catch (error) {
    console.error('Error sending email:', error);
    throw new Error('Error sending email notification:', error.message);
  }
};



///delete taask///
const deleteTask = async (req, res) => {
  try {
    const { id } = req.body;
    const task = await Task.findByIdAndDelete(id);
    return res.status(200).json({ message: 'Task deleted successfully',task });
  } catch (error) {
    console.error('Error deleting task:', error);
    return res.status(500).json({ message: 'Error deleting task', error: error.message });
  }
};

const updateTask = async (req, res) => {
  try {
    const {id, title, text, due_date } = req.body;

    const updatedTask = { title, text, due_date };
    const newTask = await Task.findByIdAndUpdate(id, updatedTask, { new: true });

    return res.status(200).json({ message: 'Task updated successfully', newTask });
  } catch (error) {
    console.error('Error updating task:', error);
    return res.status(500).json({ message: 'Error updating task', error: error.message });
  }
};


const getAllTasks = async (req, res) => {
  try {
    const tasks = await Task.find();
    return res.status(200).json({ message: 'get all tasks successfully', tasks });
  } catch (error) {
    console.error('Error getting tasks:', error);
    return res.status(500).json({ message: 'Error getting tasks', error: error.message });
  }
}

const getTasksForUser = async (req, res) => {
  try {
    const {userId}= req.body;
    
    const tasks = await Task.find({ createdBy: userId });
  
    return res.status(200).json({ tasks });
  } catch (error) {
    console.error('Error getting tasks:', error);
    return res.status(500).json({ message: 'Error getting tasks', error: error.message });
  }
};




module.exports = {
  createTask,
  deleteTask,
  updateTask,
  getAllTasks,
  getTasksForUser
};
