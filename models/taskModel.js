const mongoose = require('mongoose')

const schema = mongoose.Schema

const taskSchema = new schema({
title:{
    type:String,
    require:true,
    tirm:true,
    default:null
},
text:{
    type:String,
    require:true,
    tirm:true,
    default:null
},
due_date:{
    type: Date,
    required: true
},
createdBy: {
    type: schema.Types.ObjectId,
     ref: 'User'
}

})


const Task = mongoose.model('task',taskSchema)

module.exports= Task