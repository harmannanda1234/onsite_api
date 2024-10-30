const express=require("express");
const { add_location, location_check } = require("../controllers/sitecon");
const router = express.Router();

router.post("/addsite",add_location)
router.post("/siteupdate",location_check)
module.exports=router;