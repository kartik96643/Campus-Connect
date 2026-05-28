const express = require('express')

const router = express.Router()

const multer = require('multer')
const LostAndFound = require('../models/lostAndFound')

const storage = multer.diskStorage({
    destination: function(req,file,cb){
        cb(null, './uploads/lostAndFound')
    },
    filename: function(req,file,cb){
        cb(null, `${Date.now()}-${file.originalname}`)
    }
})

const upload = multer({storage:storage})

router.get('/', async(req,res)=>{
    const {msg,type} = req.query
    try {
        return res.render('lostAndFound-form.ejs',{
            user:req.user,
            msg:msg || null,
            type:type || null,
        })
    } catch (error) {
        return res.render('error.ejs',{
            msg:"Error in loading lost and found form"
        })
    }
})

router.post('/', upload.single('item-image'), async(req,res)=>{
    
    try {
        await LostAndFound.create({
            founderId:req.body.founderId,
            message:req.body.message,
            ItemImageUrl: req.file ? `/uploads/lostAndFound/${req.file.filename}` : '',
        })

        return res.status(200).redirect('/lostandfound?msg=Successfully submitted&type=success')
    } catch (error) {
        console.log(error)
        return res.render('error.ejs',{
            msg:"Error in submitting the request. Please try again later"
        })
    }

})

router.get('/all', async(req,res)=>{
    try {
        const all = await LostAndFound.find({}).sort({timestamp:-1})
        return res.status(200).render('all-lostandfound.ejs',{
            user:req.user,
            all,
        })
    } catch (error) {
         console.log(error)
        return res.render('error.ejs',{
            msg:"Error in fetching the data. Please try again later"
        })
    }
})

module.exports = router;