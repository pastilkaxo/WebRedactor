require('dotenv').config();
const express = require("express");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const mongoose = require("mongoose");
const router = require("./router/index.js");
const errorMiddleware = require("./middlewares/error-middleware");

const PORT = process.env.PORT || 5000;
const app = express();


app.use(express.json());
app.use(cookieParser());
app.use(cors());
app.use('/api',router);
app.use(errorMiddleware);

const start = async () => {
  try{
    await  mongoose.connect(process.env.MONGODB_URI,{
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    app.listen(PORT, () => console.log("Сервер запущен на http://localhost:5000"));
  }
  catch(err){
    console.log(err);
  }
}

start()
