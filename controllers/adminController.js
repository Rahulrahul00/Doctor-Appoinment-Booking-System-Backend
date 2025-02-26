import validator from "validator"
import bcrypt from "bcrypt"
import { v2 as cloudinary } from "cloudinary"
import doctorModel from "../models/doctorsModel.js"
import jwt from "jsonwebtoken"




//API for adding doctor
const addDoctor = async (req, res) => {

    try{
        const {name, email, password, speciality, degree, experience, about, fees, address} = req.body
        const imageFile = req.file
        // console.log({name, email, password, speciality, degree, experience, about, fees, address}, imageFile)

        // checking for all data to add doctor
        if(!name || !email || !password || !speciality || !degree || !experience || !about || !fees || !address){
            return res.json({success:false, message:"Missing Details"})
        }

        //Validating email format
        if(!validator.isEmail(email)){
            return res.json({success:false, message:"Please enter a valid email"})
        }

        //Validating strong password
        if(password.length < 8){
            return res.json({success:false, message:"Please enter a strong password"})
        }

        // Hashing doctor password
        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(password, salt)

        // upload image to cloudinary
        const imageUpload = await cloudinary.uploader.upload(imageFile.path, { resource_type:"image" })
        const imageUrl = imageUpload.secure_url

        // Data formate for the doctor
        const doctorData = {
            name,
            email,
            image:imageUrl,
            password:hashedPassword,
            speciality,
            degree,
            experience,
            about,
            fees,
            address:JSON.parse(address),
            date:Date.now()
        }

        const newDoctor = new doctorModel(doctorData) //Creating a new doctor instance with the provided data
        await newDoctor.save()  //Saving the doctor data to the database

        res.json({success: true, message: "Doctor Added"})

    }catch(error){
       console.log(error)
       res.json({success:false, message:error.message})
    }
}

//  API for admin Login
const loginAdmin = async (req, res) =>{
    try{
        const {email,password} = req.body

        //checking admin email and password
        if(email === process.env.ADMIN_EMAIL && password === process.env.ADMIN_PASSWORD){
          const token = jwt.sign(email+password,process.env.JWT_SECRET)
          res.json({success:true, token})

        }else{
            res.json({success:false, message:"Invaild credential"})
        }

    }catch(error){
        console.log(error)
        res.json({success:false, message:error.message})
    }
}


//API to get all doctors list for admin panel
const allDoctors = async (req, res) => {
    try{
        const doctors = await doctorModel.find({}).select('-password')
        res.json({success:true, doctors})

    }catch(error){
        console.log(error)
        res.json({success:false, message:error.message})
    }

}


export {addDoctor, loginAdmin, allDoctors}