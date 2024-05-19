const mongoose = require('mongoose')
const taskModel= require('./taskModel')
const schema = mongoose.Schema

const userSchema = new schema({
userName:{
    type:String,
    require:true,
    tirm:true,
    default:null
},
password:{
    type:String,
    require:true,
    tirm:true,
    default:null,
    minlength:8
},
email:{
    type:String,
    require:true,
    tirm:true,
    default:null
},
provider:{
    type:String,
    require:false,
    tirm:true, 
},
tasks: {
    type:schema.Types.ObjectId,
    ref:'Task'
},
token:[{
type:String
}]

})
userSchema.methods.addToken = function(token) {
    if (!this.tokens.includes(token)) {
      this.tokens.push(token);
    }
  };

const User = mongoose.model("user",userSchema)

module.exports= User