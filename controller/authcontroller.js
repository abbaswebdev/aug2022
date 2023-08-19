import express from "express";

import cookieParser from "cookie-parser";
const app =  express();

app.use(cookieParser())



const routpage =   (req,res)=>{


res.render("rout");


}

const login =   (req,res)=>{

console.log(req.cookies)




    res.render("login",{message:"",ne:"abbaaaaaaaa"});






    
    
    }
    

export {routpage,login} ;












