require("dotenv").config({path:'./.env'});
const { error } = require("console");
const express=require("express");
const app=express();
const path=require("path");
// const mysql=require("mysql");
// const db=mysql.createConnection({
//     port: process.env.DB_PORT,
//     host: process.env.HOST,
//     user: "root",
//     password: process.env.PASSWORD,
//     database:"test"
// });

// db.connect((error) =>{
//     if(error){
//         console.log(error);
//     }
//     else{
//         console.log("MySql connected...");
//     }
// })

const publicDirectory=path.join(__dirname,"./public");
app.use(express.static(publicDirectory));
app.set('view engine','hbs');

//to get data from the forms
app.use(express.urlencoded({ extended : false}));

//to parse json bodies sent by API clients
app.use(express.json());

app.use('/',require("./Routers/pages.js"));
app.use("/auth",require("./Routers/auth.js"));
app.listen(3000,(req,res)=>{console.log("Server is up")});
