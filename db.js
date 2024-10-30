const mysql = require("mysql2");
require("dotenv").config({path:"./config/config.env"});


const pool = mysql.createPool({
    host:process.env.DB_HOST, 
    user:process.env.DB_USER,
    password:process.env.DB_PASSWORD,
    database:process.env.DB_NAME
},()=>{console.log(`${process.env.DB_NAME} connected succesfully `)})

module.exports=pool;