import User from "../models/userModels.js";
import Contact from "../models/contectModel.js";
import { errorFn } from "../helper/helper.js";
import bcrypt from "bcrypt";
import sequelize from "../models/connection.js";









// Getting All Users in Admin
export var getAllUsers = async (req, res) => {
  try {
    const  local_url=process.env.LOCAL_URL;
    const user = await User.findAll({
      attributes:[
        "id",
        "firstName",
        "email",
        [sequelize.literal(`CONCAT('${local_url}',\`image\`)`), "image"]
      ]
    });


    return res.status(200).json({user});
  } catch (error) {
    //res.status(400).json({ data: error.message });
    console.log("errrrrrrrrrrrrrrrrrrr", error.message);
    errorFn(error, req, res);
  }
};

// All Users , All Contact
export var getUserContacts = async (req, res) => {
  const local_url = process.env.LOCAL_URL;
  const { limit, page } = req.query;
  const l = parseInt(limit) || 5;
  const p = parseInt(page) || 1;
  console.log(p);
  const offset = (p - 1) * l; 
  try {
    const contact = await Contact.findAndCountAll({
      limit: l,
      offset: offset,
      attributes: [
        "id",
        "userId",
        "name",
        "phone",
        'profile',
        [sequelize.literal("CONCAT('http://localhost:5000/upload/', profile)"), "profile"],
        "createdAt",
        "updatedAt",
      ],
    });
    const totalPages=Math.ceil(contact.count/l);
    return res.status(200).json(contact);
  } catch (error) {
    console.log("didn't find contacts", error);
    return res.json({ status: false, message: error.message });
  }
};

// Change Any User password by Admin

export var updateUserPassword = async (req, res) => {
  try {
    const obj = req.body;
    const newPass = obj.newPassword;
    const confirmNewPass = obj.ConfirmNewPassword;
    const { id } = req.params;

    if (newPass != confirmNewPass) {
      return res.status(400).json({
        status: false,
        message: "New password and confirm new passord not matched",
      });
    }
    const hashedPassword = await bcrypt.hash(newPass, 10);

    const newObj = {
      password: hashedPassword,
    };
    await User.update(newObj, {
      where: {
        id: id,
      },
    });
    return res.status(201).json({ status: true, message: "password updated" });
  } catch (error) {
    errorFn(error, req, res);
  }
};

// DELETE ANY USERS CONTACT BY ADMIN
export var deleteContact = async (req, res) => {
  try {
    const { id } = req.params;
    const contact = await Contact.findOne({
      where: {
        id: id,
      },
    });
    if (!contact) {
      return res.status(404).json({ message: "contact not found" });
    }
    const d = await contact.destroy({
      where: {
        id: id,
      },
    });
    if (d) {
      res.status(200).json({ message: "contact deleted" });
    } else {
      res.status(500).json({ message: "error deleting contact" });
    }
  } catch (error) {
    errorFn(error, req, res);
  }
};


export var updateContact = async (req, res) => {
  try {
    var local_url=process.env.LOCAL_URL;
    const obj = req.body;
    const id = req.params.id;
    const file = req.file;

  
    const profile=file?file.filename:null;

    if (profile) {
      obj.profile = profile;
    }

    const contact = await Contact.findOne({
      where: {
        id: id,
      },
      attributes: [
        "id",
        "name",
        "phone",
        [sequelize.literal(`CONCAT('${local_url}',\`profile\`)`), "profile"]
       
      ],
    });
    // console.log(contact);
    if (!contact) {
      return res
        .status(404)
        .json({ status: false, message: "Contact not found!" });
    }

    // return res.json(obj);
    const data = await Contact.update(obj, {
      where: {
        id: id,
      },
    });
    return res
      .status(201)
      .json({ status: true, message: "Updated!" });
  } catch (error) {
    return res.status(500).json({
      status: false,
      error: error.message,
    });
  }
};

// //* UPDATE USER PROFILE PIC 

// export var updateUserProfile = async (req,res)=>{
// const obj = req.body
// const id = req.params.id
// const file = req.file
//     const profile=file?file.filename:null;
// if(profile){
//   obj.profile = profile
// }
// const user = await  User.findOne({
//   where: {
//   id:id      
// },
// attributes: [
//   "id",

// ]
// })
// }
