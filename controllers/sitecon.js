const db =require("../db")
const turf = require("@turf/turf")

// const location_check =async(req,res)=>{
//     try {
//     let{latitude,longitude,site_id}=req.body;

//     const userLocation = {
//         type: "Feature",
//         geometry: {
//           type: "Point",
//           coordinates: [longitude, latitude],
//         },
//       };

//     const query ="SELECT boundary from site_fence where site_id=?"
//    await db.promise().query(query,[site_id],(err,results)=>{
//     if(err){
//         throw err;
//     }

//     const site_boundary= JSON.parse(results[0].boundary)

//     const match = turf.booleanPointInPolygon(userLocation,site_boundary);

//     if(match){

//       return res.json({message:"inside the site radius , you are goodto go"})
//     }

//     else{
//         return res.json({message:"outside the site radius"})
//     }
//    })
//     } catch (error) {
//         console.log("error internal",error)
//         return res.json({message:"internal server error",error:error.message})
//     }
// };


const location_check = async (req, res) => {
    try {
      let { latitude, longitude, site_id } = req.body;
  
      const userLocation = {
        type: "Feature",
        geometry: {
          type: "Point",
          coordinates: [longitude, latitude],
        },
      };
  
      const query = "SELECT boundary FROM site_fence WHERE site_id = ?";
      const [results] = await db.promise().query(query, [site_id]);
  
      if (results.length === 0) {
        return res.status(404).json({ message: "Site not found" });
      }
  
      const boundaryData = results[0].boundary;
  
    //   console.log("Boundary data:", boundaryData); // Debugging line
  
      // Ensure the boundary is a valid JSON string before parsing
      let site_boundary;
      if (typeof boundaryData === "string") {
          site_boundary = JSON.parse(boundaryData);}

      site_boundary=boundaryData;
      
  
      const match = turf.booleanPointInPolygon(userLocation, site_boundary);
  
      if (match) {
        return res.json({ message: "Inside the site radius, you are good to go" });
      } else {
        return res.json({ message: "Outside the site radius" });
      }
    } catch (error) {
      console.log("Internal error:", error);
      return res.status(500).json({ message: "Internal server error", error: error.message });
    }
  };
  

const add_location=async(req,res)=>{
    try {

        let{pin_code,site_id,boundary,role}=req.body;

        if(role!='admin'){
        return res.json({message:"access not granted"});
    }
    const boundaryString = JSON.stringify(boundary);
    const add_query= 'INSERT INTO site_fence(site_id,boundary,pin_code)VALUES(?,?,?)';
    await db.promise().query(add_query,[site_id,boundaryString,pin_code]);
    return res.json({message:"site inserted succesfully"})

    } catch (error) {
        console.log("error:",error);
        return res.status(500).json({message:"server error",error:error.message})
    }
   

}

module.exports={
    add_location,
    location_check
}

