const express = require('express')
const Chat = require('../models/chat')
const User = require('../models/user')

const router = express.Router()

router.get('/:_id', async(req,res)=>{
  const {_id} = req.params
  const student = await User.findById({_id})

  await Chat.updateMany({senderId:_id, receiverId:req.user._id, isRead:false},
    {$set:{isRead:true}}
  );

  const chats = await Chat.find({
    $or: [
      { senderId: req.user._id, receiverId: _id },
      { senderId: _id, receiverId: req.user._id }
    ]
  }).sort({ timestamp: 1 });

  

  return res.render('chat.ejs',{
    user:req.user,
    _id,
    student,
    chats,
    
  })
})

module.exports = router;