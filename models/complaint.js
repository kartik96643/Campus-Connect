const mongoose = require('mongoose')

const complaintSchema = new mongoose.Schema({
    subject:{
        type:String,
        required:true,
    },
    desc:{
        type:String,
        required:true,
    },
    email:{
        type:String,
        required:true
    },
    sname:{
        type:String,
        required:true,
    }

},{timestamps:true})

const Complaint = mongoose.model('complaint', complaintSchema)

module.exports = Complaint;