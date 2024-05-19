const User = require('../models/userModel')
const bcrypt= require('bcrypt')
const jwt = require('jsonwebtoken')


const  createUser= async(req ,res)=>{
  try{
const {userName,password ,email}=req.body;

const user = new User({userName,email})

await user.save();
res.status(200).json({message:"create new user successfully"})
}
catch(error){
    res.status(500).json({ message: 'Error creating user', error: error.message });
    }
}

const updateUserProfile = async (req, res) => {
    try{
    const {id,userName,email, password} = req.body

    const user = await User.findByIdAndUpdate(id)
  
    const updatedUser = await user.updateOne(id)
  
    res.json({ message: "updated user successfully",updatedUser })
  }
  catch (error) {
    console.error('Error updating user', error);
    res.status(500).json({ message: 'Error updating user' });
  }}


const loginUser= async(req,res)=>{
 try{
const {email,password} = req.body;
const user = await User.findOne({email})

await user.save()
return res.status(201).send({message:'user login successfully',token})
 }catch(error){

 console.log('error in login',error)
 return res.status(500).send({message:'error in login ',error:error.message})
}
}

const logoutUser = (req, res) => {
 try{
  res.clearCookie('jwt', { httpOnly: true, sameSite: 'None', secure: true });
 return res.status(200).json({ message: 'Token cleared' });
 }catch(error){
  console.log('error in logout ',error)
  return res.status(500).json({ message: 'error in logout' ,error:error.message});
 }

}

module.exports= {
createUser,
updateUserProfile,
loginUser,
logoutUser,

}