import validator from "validator"
import bcrypt from "bcrypt"



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
        if(!validator.isEmail()){
            return res.json({success:false, message:"Please enter a valid email"})
        }

        //Validating strong password
        if(password.length < 8){
            return res.json({success:false, message:"Please enter a strong password"})
        }

        // Hashing doctor password
        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(password, salt)



    }catch(error){

    }
}

export {addDoctor}