const express = require('express');
const User = require('../models/user');
// const Chat = require('../models/chat')

const router = express.Router();

router.get('/', async(req,res)=>{
    try {
       
         const { skill,university,course,semester,gender,batch } = req.query;  
    let query = {};

    query.role = "STUDENT"
   if (skill && skill.trim() !== "") {
    
      const skillArray = skill
        .split(',')
        .map(s => s.trim())
        .filter(s => s.length > 0);

      
      query.skills = { $in: skillArray.map(s => new RegExp(s, "i")) };
    }

    if(university) query.university = university.toUpperCase()
   if(course) query.course = course.toUpperCase()
    if(semester) query.semester = semester
    if(gender) query.gender = gender.toUpperCase()
if (batch && batch.trim() !== "") {
  const year = parseInt(batch.trim(), 10);

  query = {
    ...query,
    $expr: {
      $and: [
        { $lte: [ { $toInt: { $substr: ["$batch", 0, 4] } }, year ] },
        { $gte: [ { $toInt: { $substr: ["$batch", 5, 4] } }, year ] }
      ]
    }
  };
}

    const users = await User.find(query);

  //   const unread = await Chat.aggregate([
  //   {$match:{receiverId:req.user._id, isRead:false}},
  //   { $group: {_id:'$senderId', count:{ $sum: 1}}}
  // ])
    // console.log(unread,"unread messages")
    // console.log(req.user)
    return res.render('home.ejs', {
      users,
      skill,
      university,
      course,
      semester,
      gender,
      batch,
      user:req.user,
      // unread,
    });
    } catch (error) {
        res.render('error',{
          msg:"Error in loading home page"
        })
    }
})



module.exports = router;