import Contact from "../models/contectModel.js";
import { errorFn } from "../helper/helper.js";
import { Op } from "sequelize";
import XLSX from "xlsx";

export var getContact = async (req, res) => {
  const search = req.query.search || "";
                                              
  const page = parseInt(req.query.page) || 1;      //*page: the current page number (defaults to 1 if not provided)

  const limit = parseInt(req.query.limit) || 5;    //*limit: the number of contacts to return per page (defaults to 5 if not provided)

  const offset = (page - 1) * limit;              //*offset: the offset for pagination, calculated*based on the page number and limit
  
  try {
    const userId = req.user_id;
    var contact = await Contact.findAndCountAll({
      where: {
        userId: userId,
        [Op.or]: [
          { name: { [Op.like]: `%${search}%` } },
          { phone: { [Op.like]: `%${search}%` } },
        ],
      },
      limit: limit,
      offset: offset,
    });
    console.log(contact);
    return res.status(200).json({ count: contact.count, data: contact.rows });
  } catch (error) {
    console.log(error);
    errorFn(error, req, res);
  }
};

export var deleteContact = async (req, res) => {
  const { id } = req.params;
  const userId = req.user_id;
  try {
    const contact = await Contact.findOne({
      where: {
        id: id,
        userId: userId,
      },
    });

    if (!contact) {
      return res.status(404).json({ message: "Contact not found" });
    }
    const d = await Contact.destroy({
      where: { id: id, userId: userId },
    });

    if (d) {
      res.status(200).json({ message: "Contact deleted successfully" });
    } else {
      res.status(500).json({ message: "Failed to delete contact" });
    }
  } catch (error) {
    errorFn(error, req, res);
  }
};

export var updateContact = async (req, res) => {
  try {
    const { id } = req.params;
    const obj = req.body;

    const userId = req.user_id;
    const file = req.file;

    const contact = await Contact.findOne({
      where: { id, userId },
    });
    // console.log("--------------->",userId);
    if (!contact) {
      return res.status(404).json({ message: "Contact not found" });
    }
     console.log("--------------->",req.file);

    const image = file ? (file.filename ? file.filename : null) : null;
    obj.profile = image;

    const updateContact = await Contact.update(obj, {
      where: { id: id, userId: userId },
    });

    return res.status(200).json({ message: "Contact updated successfully" });
  } catch (error) {
    errorFn(error, req, res);
  }
};

export var saveContact = async (req, res) => {
  try {
    //res.send(file);
    const obj = req.body;
    const file = req.file;  
    const userId = req.user_id;
    // return res.json(userId);
    console.log(obj);
    const data = await Contact.findOne({
      where: { userId: userId, phone: req.body.phone },
    });
    if (data) {
      return res.status(400).json({ message: "Contact already exists" });
    }

    obj.userId = req.user_id;
    const profile = file ? (file.filename ? `${file.filename}` : null) : null;
    obj.profile = profile;

    const d = await Contact.create(obj);
    if (d) {
      return res.status(201).json({ status: true, message: "number saved" });
    } else {
      return res
        .status(400)
        .json({ status: false, message: "number is not saved" });
    }
  } catch (error) {
    console.log(error.message);
    return res.json({ message: error.message });
  }
};

//Excel File UPLODING

const uploadExcel = async (req, res) => {
  try {
    const userId = req.user_id;
    //console.log("==>>>>", userId);
    // console.log(req.file, "k>>>>kkkkkkkkkkkkkkkkkkkkkkkkkk");

    if (!req.file || !req.file.path) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const filePath = req.file.path;
    const workbook = XLSX.readFile(filePath);
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];
    const data = XLSX.utils.sheet_to_json(sheet);
    //    console.log(data);

    const newData = [];
    for (const row of data) {
      const v = row.phone;
      try {
        const d = await Contact.findOne({
          where: {
            userId: userId,
            phone: v,
          },
        });
        if (!d) {
          row.userId = userId;
          newData.push(row);
        }
      } catch (err) {
        console.error("Error finding contact:", err);
      }
    }
    console.log(newData);
    await Contact.bulkCreate(newData);

    res.status(200).json({
      message: "File uploaded and data saved successfully",
      //file: req.file.path,
    });
  } catch (error) {
    console.error("Error processing Excel file:", error);
    res.status(500).json({ message: "Failed to process Excel file", error });
  }
};
export { uploadExcel };
