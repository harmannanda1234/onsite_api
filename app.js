const express = require("express");
const { urlencoded } = require("express");
//importinf environment variables from confg files
require("dotenv").config({path:"./config/config.env"});
//connection
const db=require("./db")
const app = express();
const router_cred = require("./routes/cred");
const router_site = require("./routes/siterouter");

// Middleware for parsing reqs
app.use(express.json());
app.use(urlencoded({ extended: true }));


//routes
app.use(router_cred)
app.use(router_site)



app.use("",(req,res)=>{
    res.send("error 404");
})
module.exports = app;
