const pool=require("../config/database");
const bcrypt=require("bcryptjs");
const jwt=require("jsonwebtoken");
const {promisify}=require("util");

module.exports.login = (req,res) => {
    const {email, password}=req.body;
    
    if(!email || !password){
       return res.render("login",{
            message: "Email id or password can't be empty"
        })
    }

    pool.query("Select * from user_table WHERE email=?",[email],async (error,results)=>{
        if(error){
            console.log(error);
        } else if(!results || !(await bcrypt.compare(password,results[0].password))){
            return res.render("login",{
                message:"Invalid Email id or password"
            })
        } else{
            const id = results[0].id;
            const token = jwt.sign({id},process.env.JWT_SECRET_KEY,{
                expiresIn: process.env.JWT_EXPIRES_IN
            })

            console.log("The jwt token is : "+token);
            
            const cookieOptions={
                expires : new Date(Date.now()+process.env.JWT_COOKIE_EXPIRES),
                httpOnly : true
            };

            res.cookie('jwt',token,cookieOptions);
            res.status(200).redirect("/");
        }
    })
}

module.exports.register = (req,res)=> {
    const {name, email, password, confirmedPassword}=req.body;

    pool.query("Select * from user_table WHERE email=?",[email],async (error,results)=>{
        if(error){
            console.log(error);
        }
        
        if(results.length>0){
            return res.render("register.hbs",{
                message:"This E-mail has already been taken"
            })
        } else if(password!=confirmedPassword){
            console.log("Wrong Entry");
            return res.render("register.hbs",{
                message:"Password didn't match"
            })
        }
        let hashedPassword =await bcrypt.hash(password,8);
        console.log(hashedPassword);

        pool.query("INSERT INTO user_table SET ?",{name:name, email:email, password:hashedPassword},(error,results)=>{
            if(error){
                console.log(error);
            } else{
                console.log(results);
                return res.render("register.hbs",{
                    message:"User Registered!!"
                })
            }
        })
    })

    console.log(req.body);
    //res.send("Form submitted");
}

module.exports.isLoggedIn =async (req,res,next)=>{
    // console.log("Yes");
    // res.send("Logged In");
    if(req.headers.cookie){
        try{
            const tokenName=req.headers.cookie;
            const token=tokenName.split("=")[1];
            const decoded=await promisify(jwt.verify)(token, process.env.JWT_SECRET_KEY);
            console.log(decoded);
            const id=decoded.id;
            pool.query("Select * from user_table where id=?",[id],(error,results)=>{
                if(!results){
                    return next();
                }else{
                    req.user=results[0];
                    console.log("User is :"+req.user);
                    return next();
                }
            })
        }catch(error){
            console.log(error);
            console.log("nahh");
            next();
        }
    }
    else{
        next();
    }
}