const express = require('express')
const router = express.Router()
const verifyToken= require('../middleware/verifyToken')
const taskController = require('../controllers/taskController')
const {taskAuthentication, updateTaskAuth}= require('../middleware/taskMiddleware')


router.post('/createTask',verifyToken,taskAuthentication,taskController.createTask)
router.delete('/deleteTask',verifyToken,updateTaskAuth,taskController.deleteTask)
router.patch('/updateTask',verifyToken,updateTaskAuth,taskController.updateTask)
router.get('/getAllTasks',taskController.getAllTasks)
router.get('/getTasksForUser',taskController.getTasksForUser)


module.exports = router;



