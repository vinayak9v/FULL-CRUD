import { DataTypes } from "sequelize";
import sequelize from "./connection.js";

//*The Contact model is defined using the sequelize.define() method, which takes two arguments:
// the name of the table and an object that defines the table's structure.

var Contact = sequelize.define("Contact", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  userId: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  phone: {
    type: DataTypes.STRING,
  },
  profile: {
    type: DataTypes.STRING,
    allowNull: true,
  },
});
// Contact.sync({ alter: true });

export default Contact;
