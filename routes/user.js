const express = require('express')
const bcrypt = require('bcryptjs')
const {check, validationResult} = require('express-validator')
const User = require('../models/user')
const { generateToken } = require('../services/auth')


const router = express.Router()

const multer = require('multer')
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './uploads/profile-image')
  },
  filename: function (req, file, cb) {
    cb(null, `${Date.now()}-${file.originalname}`)
  }
})

const upload = multer({ storage: storage })






router.get('/signup', (req,res)=>{
    try {
        res.render('signup.ejs',{
            errors:[],
            formdata:[]
        })
    } catch (error) {
        res.render('error.ejs',{
            msg:"Error in loading Signup Page"
        })
    }
})

router.post('/signup',upload.single('profile-img'), [
    check('name','Name should be of atleast 3 characters').isLength({min:3}),
    check('email', 'Email length should be 10 to 30 characters').isEmail().matches(/^\S+@\S+\.\S+$/).isLength({ min: 10, max: 30 }),
    check('password', 'Password length should be 8 to 10 characters').isLength({ min: 8, max: 10 }),
    check('contact','Contact number should be of 10 numbers').matches(/^[0-9]{10}$/).isLength({min:10, max:10}),
    check('university','University should be of atleast 3 characters').isLength({min:3}),
    check('skills','Skills never be empty').notEmpty(),
    check('batch','Batch length should be of 9 characters and matches the pattern yyyy-yyyy').matches(/^\d{4}-\d{4}$/).isLength({min:9}),
    check('gender', 'Gender must be MALE or FEMALE').isIn(['MALE', 'FEMALE']),
    check('course', 'Course must be BCA, BBA, MCA, or MBA').isIn(['BCA','BBA','MCA','MBA',]),
    check('semester', 'Semester is required').notEmpty(),
    
    
 ], 
  async(req,res)=>{

        const errors = validationResult(req);
        if(!errors.isEmpty()){
           return res.render('signup',{
                errors: errors.array(),
                formdata: req.body,
            })
        }

        const {name,email,password,contact,skills,batch,university,gender,course,semester} = req.body;

        try {

            const user = await User.findOne({email});
            if(user){
                return res.render('signup.ejs',{
                    errors:[{msg:"User with this email already exists", param:"email"}],
                    formdata:req.body
                })
            }
            

            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(password, salt)

            let skillsArray = Array.isArray(skills) ? skills : skills.split(',').map(s => s.trim());

            const current = await User.create({
                name,
                email,
                contact,
                university:university.toUpperCase(),
                batch,
                course: course.toUpperCase(),
                gender: gender.toUpperCase(),
                semester,
                skills: skillsArray,
                password:hashedPassword,
                role:"STUDENT",
                profileImg: req.file ? `/uploads/profile-image/${req.file.filename}` : "https://cdn-icons-png.flaticon.com/512/3135/3135715.png"


            })

            return res.redirect('/user/signin')

            
        } catch (error) {
            return res.render("error.ejs",{
                msg:"Error in creating user"
            })
        }
})


router.get('/signin',(req,res)=>{
    try {
        res.render('signin',{
            errors:[],
            formdata:[]
        })
    } catch (error) {
        res.render('error',{
            msg:"Error in loading Signin Page"
        })
    }
})

router.post('/signin',[
    check('email','Email is required').isEmail(),
    check('password','Password is required')
] ,async(req,res)=>{
    
    const {email,password} = req.body;
    try {

        const exist = await User.findOne({email});
        if(!exist){
           return res.render("signin",{
                errors:[{msg:"User with this email does not exist"}],
                formdata:req.body,
            })
        }

        const validCredentials = await bcrypt.compare(password, exist.password)
        
        if(!validCredentials) {
            return res.render('signin',{
            errors:[{msg:'Invalid Credentials'}],
            formdata:req.body
        })}

        const token = generateToken(exist)
        res.cookie('token',token);

        return res.redirect('/')
        
    } catch (error) {
        res.render("errro",{
            msg:"Error occur in sign in process. Please try again later."
        })
    }
})

router.get('/logout', async(req,res)=>{
    try {
        res.clearCookie("token")
        return res.redirect('/')
    } catch (error) {
        return res.render('error',{
            msg:"Error in logout your account"
        })
    }
})



router.get('/:_id', async(req,res)=>{

    const _id = req.params._id
    try {
        const data = await User.findOne({_id})
        // return res.json({data})
        // console.log(data)
        return res.render('userData.ejs',{
            data,
        })
    } catch (error) {
        return res.render('error',{
            msg:"Error in fetching the data"
        })
    }
})


router.get('/profile/:_id', async(req,res)=>{

    const _id = req.params._id
    try {
        const data = await User.findOne({_id})
        // return res.json({data})
        // console.log(data)
        return res.render('profileData.ejs',{
            data,
        })
    } catch (error) {
        return res.render('error',{
            msg:"Error in fetching your data"
        })
    }
})

router.get('/delete/:_id', async(req,res)=>{
    const _id = req.params._id
    try {
        await User.deleteOne({_id})
        return res.redirect('/')
    } catch (error) {
        return res.render('error',{
            msg:"Error in deleting this account"
        })
    }
})


router.get('/edit/:_id', async(req,res)=>{
    const _id = req.params._id
    console.log(_id)
    try {
        const data = await User.findOne({_id})
        return res.render('editProfile.ejs',{
            data,
        })
    } catch (error) {
        return res.render('error',{
            msg:"Error in loading Edit page"
        })
    }
})


router.post('/edit/:_id', async (req, res) => {
  const _id = req.params._id;

  try {
    const { name, email, contact, university, batch, skills } = req.body;

    let skillsArray = Array.isArray(skills) ? skills : skills?.split(',').map(s => s.trim());

    await User.findByIdAndUpdate(_id, {
      name,
      email,
      contact,
      university,
      batch,
      skills: skillsArray
    });

    return res.redirect(`/user/${_id}`);
  } catch (error) {
    console.error(error);
    return res.render('error', {
      msg: "Error in updating data"
    });
  }
});




module.exports = router;