const User = require('../models/userModel')
const bcrypt = require('bcrypt')


const registerAuth = async(req,res,next)=>{
    try{
  const {id, userName, email, password} = req.body
  
    if (!userName || !email) {
      return res.status(400).json({ message: 'All fields except password are required' })
    }

     hashedPassword =bcrypt.hash(password, 10)
   
      next();
    }catch(error){
        console.log('error userAuth task')
        res.status(500).json({ message: 'error userAuth task', error: error.message });
    }
    
    }


  const  updateAuth = async(req , res,next)=> {
    try{
      const {id} = req.body;
      if (!id) {
        return res.status(400).json({ message: 'user ID is required' });
     }
     const  user = await User.findById(id)
        if (!user) {
          return res.status(400).json({ message: 'User not found' })
        }

    
          next();
        }catch(error){
            console.log('error userAuth task')
            res.status(500).json({ message: 'error userAuth task', error: error.message });
        }
        }

const loginAuth = async (req,res ,next)=>{
   try{
const {email, password} = req.body
const user = await User.findOne({email})
const match = await bcrypt.compare(password, user.password);
if (!match) {
  return res.status(401).json({ message: 'Invalid email or password' });
}
if (!password || !email) {
    return res.status(400).json({ message: 'All fields except required' })
  }
const token = jwt.sign({ userId: user._id }, process.env.KEY_TOKEN, { expiresIn: '2h' });
user.token.push(token);

 next();
}catch(error){
    console.log('error loginAuth task')
    res.status(500).json({ message: 'error loginAuth task', error: error.message });
}
};
 module.exports = {
 registerAuth,
 updateAuth,
 loginAuth 

}