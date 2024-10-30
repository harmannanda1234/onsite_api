const db = require("../db")
const bcrypt =require("bcrypt");

const signup = async (req, res) => {
    try {
        let { emp_name, emp_role, emp_password, emp_email } = req.body;

   
        if (!emp_name || !emp_role || !emp_password || !emp_email) {
            return res.status(400).send({ message: "Invalid request. All fields are required." });
        }

        // hash
        const hashedPass = await bcrypt.hash(emp_password, 10); 

        // query
        const query = 'INSERT INTO cred (emp_name, emp_role, emp_password, emp_email) VALUES (?, ?, ?, ?)';

        
        const [result] = await db.promise().query(query, [emp_name, emp_role, hashedPass, emp_email]);

        //successful signup
        return res.status(200).send({ result, message: "Signup successful" });

    } catch (error) {
        console.error("Error during signup:", error);
        return res.status(500).send({ message: "Internal server error", error: error.message });
    }
};

const login = async (req,res)=>{
    try {
        let{emp_email,emp_password}= req.body;
        if(!emp_email||!emp_password){
            return res.json({message:"invalid req"});
        }
        const [results]= await db.promise().query("select emp_password from cred where emp_email=? ",[emp_email]);
        if(!results[0]){
            return res.json({message:"user doesnt exsists"});
        }
        const dbpass = results[0].emp_password;
    
        const match = await bcrypt.compare(emp_password,dbpass);
        if(!match){
            return res.json({message:"invalid credentials"});
        }
    
        return res.json({message:"logged in succesfully"})
        
    } catch (error) {
        console.log("error error in logging in :",error)
        return res.json({message:"server error",error:error.message})
    }
    
}

const home_details= async(req,res)=>{
    let {emp_email}=req.body;
    if(!emp_email){
        return res.json({message:"error occured"});
    }
    const query = "select * from cred where emp_email=?";
    const [results]=await db.promise().query(query,[emp_email]);

    return res.json({results:[results]})
}

module.exports={
    signup,
    login
}