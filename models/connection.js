import { Sequelize } from "sequelize";
import dotenv from "dotenv";  
dotenv.config();


//*It then creates a new instance of `Sequelize` using the environment variables
const sequelize = new Sequelize(         
  process.env.DB_DATA,
  process.env.DB_NAME,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    dialect: process.env.DB_BASE,
  }
);
//*This line calls the authenticate() method of the Sequelize instance, which attempts to establish a connection to the database. 
try {
  sequelize.authenticate();
  console.log("Connection has been established successfully.");
} catch (error) {
  console.error("Unable to connect to the database:", error);
}

export default sequelize;
