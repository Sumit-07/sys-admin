
const express=require("express");

const router=express.Router();

const {isLoggedIn}=require("../controllers/auth");

router.get("/",(req, res)=> {
    res.render("index.hbs")
});

router.get("/register",(req, res)=> {
    res.render("register.hbs")
});

router.get("/login",(req, res)=> {
    res.render("login.hbs")
});

router.get("/profile",isLoggedIn,(req,res)=>{
    console.log(req.user);
    res.send("Logged in");
})

module.exports=router;