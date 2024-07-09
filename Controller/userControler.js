import User from "../models/userModels.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { errorFn } from "../helper/helper.js";
import dotenv from "dotenv";
import sequelize from "../models/connection.js";
dotenv.config();

export var getUser = async (req, res) => {
  try {
    var user = await User.findAll({
      attributes: [
        "id",
        "firstName",
        "email",
        "role",
        [sequelize.literal("CONCAT('http://localhost:5000/upload/', image)"), "image"],
        
        "createdAt",
        "updatedAt",
      ],
    });
    console.log(user);

    res.status(200).json({ data: user });
  } catch (error) {
    //res.status(400).json({ data: error.message });
    errorFn(error, req, res);
  }
};

//REGISTER USER

export var postUser = async (req, res) => {
  try {
    const { firstName, lastName, email, password } = req.body;

    // return res.json(req.body);
    const file = req.file;
    console.log(file);
    const image = file ? (file.filename ? file.filename : null) : null;
    const hashedPassword = await bcrypt.hash(password, 10);
    const obj = {
      firstName: firstName,
      lastName: lastName,
      email: email,
      password: hashedPassword,
      image: image,
    };
    const user = await User.create(obj);
    res.status(201).json({ data: user });
  } catch (error) {
    //res.status(400).json({ data: error.message });
    console.log("errrrrrrrrrrrrrrrrrrr", error.message);
    errorFn(error, req, res);
  }
};

export var loginUser = async (req, res) => {
  const { email, password } = req.body;
  console.log(email);

  const user = await User.findOne({ where: { email: email } });
  console.log(email);

  try {
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({ message: "Invalid password or credentials" });
    }

    // Create JWT token
    var key = process.env.JWT_SECRET;
    const payload = { user_id: user.id };

    const token = jwt.sign(payload, key, {
      expiresIn: 900000,
    });

    res.status(200).json({ data: user, token });
  } 
  catch (error) 
  {
    errorFn(error, req, res);
  }
};

// Function to delete a user by ID
export var deleteUser = async (req, res) => {
  const { id } = req.params;
  try {
    const user = await User.findByPk(id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    await user.destroy();
    res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    errorFn(error, req, res);
  }
};

//*All USER DETAILS 

// export var allUserDetails = async(req,res) =>{
//   const {id}= req.params;
//   const user = await User.findByPk(id)
//   if (!user){
//     return res.status(404).json({message:"User not found"});
//   }
// }
