import { userModel } from "../Models/userModel.js";
import bcrypt from "bcrypt";
import jsonwebtoken from "jsonwebtoken";
import validator from "validator";

const createToken = (_id) => {
    const jwtkey = process.env.JWT_SECRET_KEY;
    return jsonwebtoken.sign({_id}, jwtkey, { expiresIn: "3d"})
} 

const registerUser = async (request, response) => {
    try {
        console.log(request.body)
        const { name, email, password } = request.body;
        let user = await userModel.findOne({ email })
    
        if(user){
            return response.status(400).json("User with the given email already exists.")
        }
    
        if(!name || !email || !password)
            return response.status(400).json("All fields are required");
        
        if(!validator.isEmail(email))
            return response.status(400).json("Email must be a valid email");
    
        if(!validator.isStrongPassword(password))
            return response.status(400).json("Password must be a strong password");
    
        user = new userModel({name, email, password})
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(user.password, salt);
        await user.save();
    
        const token = createToken(user._id)
        return response.status(200).json({id: user._id, name, email, token});
        
    } catch (error) {
        console.log(error);
        return response.status(500).json({message: error.message});
    }


}

const loginUser = async (request, response) => {
    const { email, password } = request.body;
    console.log("login request body",request.body)
    
    try {
        let user = await userModel.findOne({email});
        console.log("Login user found", user)
        if(!user)
            return response.status(400).json({messaage: "Invalid email or password"})

        const isValidPassword = await bcrypt.compare(password, user.password);
        
        if(!isValidPassword)
            return response.status(400).json({messaage: "Invalid email or password"})

        const token = createToken(user._id);
        return response.status(200).json({id: user._id, name: user.name, email, token});

    } catch (error) {
        console.log(error);
        return response.status(500).json({message: error.message});
    }
}

const findUser = async (request, response) => {
    const userId = request.params.userId;
     try {
        const user = await userModel.findById(userId);
         return response.status(200).json(user);
     } catch (error) {
        console.log(error);
        return response.status(500).json({message: error.message});
     }
}

const getUsers = async (request, response) => {
     try {
        const user = await userModel.find();
         return response.status(200).json(user);
     } catch (error) {
        console.log(error);
        return response.status(500).json({message: error.message});
     }
}

export { registerUser, loginUser, findUser, getUsers };