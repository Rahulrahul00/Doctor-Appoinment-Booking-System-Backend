import validator from 'validator'
import bcrypt from 'bcrypt'
import userModel from '../models/userModel.js'
import jwt from 'jsonwebtoken'
import {v2 as cloudinary} from 'cloudinary'



// API to register user

const registerUser = async (req, res) =>{
    try{
        const {name , email, password } = req.body

   
        if(!name || !password || !email){
            return res.json({success:false, message:"Missing Details"})
        }

        // Validating email format
        if(!validator.isEmail(email)){
            return res.json({success:false, message:"Enter  the vaild email"})
        }

        //Validating strong password
        if(password.length < 8){
            return res.json({success:false, message:"Enter a strong password"})
        }
        
        // Hashing User password
        const hashPassword = await bcrypt.hash(password,10)

        const userData = {
            name,
            email,
            password:hashPassword
        }

        const newUser = new userModel(userData) //createing a new user instance provided data 
        const user= await newUser.save() //save the new user data to the database

        //Genrating a token
        const token = jwt.sign({id:user._id}, process.env.JWT_SECRET)

        res.json({success:true, token})

    }catch(error){
        console.log(error)
        res.json({succcess:false, message:error.message})
    }
}


//API for user login
const loginUser = async (req, res) => {

    try{
        const {email, password} = req.body
        const user = await userModel.findOne({email})
       
        if(!user){
           return res.json({success:false, message:'User does not exist'})
        }
        //compareing password and user password
        const isMatch = await bcrypt.compare(password, user.password)

        if(isMatch){
            const token = jwt.sign({id:user._id}, process.env.JWT_SECRET)
            res.json({success:true, token})
        }else{
            res.json({success:false, message:"Invaild credentials"})
        }


    }catch(error){
        console.log(error)
        res.json({success:false, message:error.message})
    }
}


// API to get user profile data
const getProfile  = async (req, res) =>{
    
    try{
      
        const {userId} = req.body
        const userData = await userModel.findById(userId).select('-password')

        res.json({success:true, userData})
        
    }catch(error){
        console.log(error)
        res.json({success:false, message:error.message})
    }

    
}


// API to update user profile

const updateProfile = async (req, res) => {

    try{
        const {userId, name, phone, address, dob, gender} = req.body
        const imageFile = req.file

        if(!name || !phone || !address || !dob || !gender){
            return res.json({success: false, message:"Data Missing"})
        }

        await userModel.findByIdAndUpdate(userId, {name, phone, address: JSON.parse(address),dob,gender})

        if(imageFile){
            
            //upload image to cloudinary
            const imageUpload = await cloudinary.uploader.upload(imageFile.path, {resource_type:'image'})
            const imageURL = imageUpload.secure_url

            await userModel.findByIdAndUpdate(userId, {image:imageURL})
        }

        res.json({success:true, message:"Profile Updated"})

    }catch(error){
        console.log(error)
        res,json({success:false, message:error.message})
    }

}




export {registerUser, loginUser, getProfile, updateProfile}