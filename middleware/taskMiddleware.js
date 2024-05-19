const jwt = require('jsonwebtoken');
const Task = require('../models/taskModel');

const taskAuthentication = async (req, res, next) => {
  try {

    const { title, text, due_date } = req.body;
    if (!title || !text || !due_date) {
        return res.status(400).json({ message: 'All fields are required' });
      }

    next();
  } catch (error) {
    console.error('Error authenticating task', error);
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
};



const updateTaskAuth = async(req,res,next)=>{
try{
 const {id} = req.body
 const { userId } = req;


 if (!id) {
    return res.status(400).json({ message: 'Task ID is required' });
 }
const task = await Task.findById(id);
 if (!task) {
    return res.status(404).json({ message: 'Task not found' });
}
if (task.createdBy.toString() !== userId) {
     return res.status(403).json({ message: 'Unauthorized to this task' });
}
  next();
}catch(error){
    console.log('error updateAuth task')
    res.status(500).json({ message: 'error updateAuth task', error: error.message });
}

}


module.exports = {
    taskAuthentication,
    updateTaskAuth
}
