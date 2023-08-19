import express from "express";
import path from "path";
import mongoose from "mongoose";
import cookieParser from "cookie-parser";
import router from "./routes/auth.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

const app = express();
app.set("view engine" , "ejs");
app.use(express.urlencoded({extended:true}));
app.use( express.static(path.join(path.resolve(),"public")));
app.use("/",router);
app.use(cookieParser());


const con  = mongoose.connect("mongodb://127.0.0.1:27017/userAuth",{

useNewUrlParser:true,
useUnifiedTopology:true
}).then(()=>{

console.log("success")

})
con.catch((e)=>{
    console.log(e);
})




const userSchema = new mongoose.Schema({

    username:String,
    password:String,
    email:String
})

const User = mongoose.model("User",userSchema);

const isAuthenticated = (req,res,next)=>{


    let {token} = req.cookies;
    if(token){

token = jwt.verify(token,"abbaskhano")

   next();
    }else{
      res.redirect("/login")
    }
}


app.get("/",(req,res)=>{


  res.render("home")


  

    }).listen(3000,()=>{
    
    console.log("listening on port 3000");
})




app.get("/logout",(req,res)=>{

    res.cookie("token",null,{
        expires:new Date(Date.now())
    })
     res.redirect("/");
    })
     
    app.get("/register",(req,res)=>{

        res.render("register");
    })



    

app.get("/user",isAuthenticated, async (req,res)=>{


let data =await User.find({});

res.render("user",{usser:"".username,  data:data})
   

})





app.get("/login",(req,res)=>{

res.render("login",{passmessage:"", message:""}) 
})





app.post("/register", async(req,res)=>{


   
    let {username,password,email}= req.body;

 const hashPassword  = await bcrypt.hash(password,10)
console.log(hashPassword)
 await User.create({

username,
password:hashPassword,
email

})

return  res.redirect("/");

})

 



app.post("/login", async(req,res)=>{

 
    let {username,password}= req.body;
 
    
    let usern = await User.findOne({username});

if(!usern)
{
res.render("login",{passmessage:"",message:"register first"});

}
else{
const ismMatch = bcrypt.compare(password,usern.password)
if (ismMatch){
    console.log("you are logged in ")

 let token = jwt.sign({ token: usern._id }, 'abbaskhano');
  
    res.cookie("token",token);
console.log(token)
res.redirect("/user");

}
    else
    
    {

        res.render("login",{passmessage:"please enter correct password",message:"",ne:""});

    }
    
}

})




app.get("/delete/:id",async(req,res)=>{

try{

    const id = (req.params.id).trim();
 
 await User.findByIdAndDelete(id);
console.log("delelted succssfully");
res.redirect("/user");


}
catch(err){
    console.log(err)
}

})





app.get("/update/:id",async(req,res)=>{

    try{
    
        const id = (req.params.id).trim();
     
   const editdata = await User.findById(id);
    console.log(editdata);
   
    res.render("update",{editdata:editdata})
    
    }
    catch(err){
        console.log(err)
    }
    
    })
    


    app.post("/update/:id",async(req,res)=>{

        try{
        
            const id = (req.params.id).trim();
         
       const updatedata = await User.findByIdAndUpdate(id,req.body)
        console.log(updatedata);
       
     res.redirect("/user");
        
        }
        catch(err){
            console.log(err)
        }
        
        })

