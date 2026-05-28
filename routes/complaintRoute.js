const express = require('express')
const Complaint = require('../models/complaint')
const { check, validationResult } = require('express-validator')


const router = express.Router()

router.get('/', async (req, res) => {
    try {
        res.render('complaint-form.ejs', {
            user: req.user,
            errors: [],
            formdata: [],

        })
    } catch (error) {
        res.render('error.ejs', {
            msg: "Error in loading this page"
        })
    }
})

router.post('/submit', [
    check('subject', "Subject length should be at least 5 characters").isLength({ min: 5 }),
    check('desc', "Description length should be at least 5 characters").isLength({ min: 5 }),
], async (req, res) => {

    console.log(req.body)
    const errors = validationResult(req);
    console.log(errors)
    if (!errors.isEmpty()) {
        return res.render('complaint-form.ejs', {
            errors: errors.array(),
            formdata: req.body,
            user:req.user,
        })
    }

    const { subject, desc, email, sname } = req.body
    try {
        await Complaint.create({ subject, desc, email, sname })
        return res.redirect('/complaint/all?msg=Successfully submitted&type=success')
    } catch (error) {
        console.log(error)
        return res.render('error.ejs', {
            msg: "Error in submitting complaint. Please try again later."
        })
    }
})

router.get('/all', async(req,res) => {
    try {
        const {msg,type} = req.query
        const allcomplaints = await Complaint.find({}).sort({createdAt:-1})
        return res.status(200).render('complaints.ejs',{
            user:req.user,
            allcomplaints,
            msg,
            type,
        })
    } catch (error) {
         console.log(error)
        return res.render('error.ejs', {
            msg: "Error in fetching complaints. Please try again later."
        })
    }
})


router.get('/delete/:id', async(req,res)=> {

    const {id} = req.params;
    try {
        await Complaint.deleteOne({_id:id})
        return res.redirect('/complaint/all?msg=Successfully Deleted&type=success')
    } catch (error) {
         return res.render('error.ejs', {
            msg: "Error in deleting complaint. Please try again later."
        })
    }
    
})
module.exports = router;