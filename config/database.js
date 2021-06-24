const {createPool} =require("mysql");
const pool=createPool({
    port: process.env.DB_PORT,
    host: process.env.HOST,
    user: process.env.USER,
    password: process.env.PASSWORD,
    database:"test"
});
pool.getConnection((err)=>{
    if(err){
        console.log(err);
    }
    else{
        console.log("Connection established!!");
    }
})
module.exports = pool;
