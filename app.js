import express from "express";
import userRouter from "./router/userRouter.js";
import sequelize from "./models/connection.js";
import bodyParser from "body-parser";
import dotenv from "dotenv";
import cors from "cors";
import path from "path";
import multer from "multer";
import url from "url";
import contactRouter from "./router/contactRouter.js";
import adminRouter from "./router/adminRouter.js";
dotenv.config();

var app = express();
var PORT = process.env.PORT || 5000;
console.log(PORT);

app.use(bodyParser.json());   //*app.use(bodyParser.json()): enables JSON parsing for request bodies

app.use(bodyParser.urlencoded({ extended: true })); //*app.use(bodyParser.urlencoded({ extended: true })): enables URL-encoded parsing for request bodies


var __dirname = url.fileURLToPath(new URL(".", import.meta.url));
var dir = path.join(__dirname, "./upload");    //*uses the url and path modules to get the absolute path of the current directory. This is stored in the variable __dirname.
app.use(express.static(path.join(__dirname, "/")));

app.use(cors());



//*multer setup star 
// const storage = multer.diskStorage({
//   destination: function (req, file, cb) {
//     cb(null, dir);
//   },
//   filename: function (req, file, cb) {
//     cb(null, "image1" + "-" + Date.now() + "-" + file.originalname);
//   },
// });

// const upload = multer({ storage: storage });


const upload=multer({
  storage: multer.diskStorage({
    destination:function(req,file,cb){
      cb(null,dir);
    },
    filename:function(req,file,cb){
      const extension = path.extname(file.originalname)
      cb(null,path.basename (file.originalname, extension)+Date.now()+extension )
    }
  })
})

app.use("/home", userRouter(upload));
app.use("/contact", contactRouter(upload));
app.use("/admin", adminRouter(upload));

app.listen(PORT, () => {
  console.log("Server is running on port 5000");
});
