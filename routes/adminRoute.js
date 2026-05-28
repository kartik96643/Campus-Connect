const express = require('express');
const User = require('../models/user');

const router = express.Router()

router.get('/allUsers', async(req,res)=>{
    try {
        const totalStudents = await User.find({role:"STUDENT"}).countDocuments()
        const studentsByCourse = await User.aggregate([
            {$match : {role:"STUDENT"}},
            {$group: { _id:'$course', count:{$sum:1}}}
        ])

        const studentsByUniv = await User.aggregate([
            {$match:{role:"STUDENT"}},
            {$group: { _id: '$university', count:{$sum:1}}}
        ])

        const studentsBySex = await User.aggregate([
            {$match:{role:"STUDENT"}},
            {$group: { _id: '$gender', count:{$sum:1}}}
        ])

        let courseCounts = {}
        studentsByCourse.forEach((course)=>{
            courseCounts[course._id] = course.count
        })

        let univCounts = {}
        studentsByUniv.forEach((univ)=>{
            univCounts[univ._id] = univ.count
        })

        let sexCounts = {}
        studentsBySex.forEach((sex)=>{
            sexCounts[sex._id] = sex.count
        })

        return res.status(200).render('admin-AllUserData.ejs',{
            totalStudents,
            courseCounts,
            univCounts,
            sexCounts,
            user:req.user
        })
    } catch (error) {
        return res.status(500).redirect('/')
    }
})

module.exports = router;