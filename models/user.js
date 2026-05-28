const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true, 
    match: /^\S+@\S+\.\S+$/,
  },
  contact: {
    type: String, 
    required: true,
    match: /^[0-9]{10}$/,
  },
  university: {
    type: String,
    required: true,
  },
  gender:{
    type:String,
    enum:['MALE','FEMALE'],
    required:true,
  },
  course:{
    type:String,
    enum:["BCA","BBA","MCA","MBA"],
    required:true,
  },
  semester:{
    type:String,
    required:true,
  },
  batch: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  skills: [
    {
      type: String,
      required: true,
    },
  ],
  role:{
    type:String,
    enum:['ADMIN','STUDENT'],
    default:'STUDENT',
  },
  profileImg:{
    type:String,
    default: "https://cdn-icons-png.flaticon.com/512/3135/3135715.png",
    

  }
}, { timestamps: true });


const User =  mongoose.model('user', userSchema)

module.exports = User;