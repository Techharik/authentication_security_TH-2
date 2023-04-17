// import * as dotenv from 'dotenv'
// dotenv.config()
import express from "express";
import bodyParser from "body-parser";
import ejs from 'ejs';
import { model,Schema,connect } from "mongoose";
// import md5 from 'md5';
// import user from __dirname+"/user";
// const data = require(__dirname+'/user.js')
import session from 'express-session'
import passport from "passport";
import passportLocalMongoose from 'passport-local-mongoose'



// const saltRounds = 10;
// import encrypt from 'mongoose-encryption';


const app = express();

//settign up the server in express;

app.set('view engine','ejs');
app.use(express.static('public'))
app.use(bodyParser.urlencoded({extended:true}));


app.use(session({
    secret: 'keyboard cat.',
    resave: false,
    saveUninitialized: false,
  }))
//creating a database:

app.use(passport.initialize())
app.use(passport.session())

connect('mongodb://localhost:27017/userData')

const userSchema = new Schema({
    email:String,
    userPassword:String,
})

userSchema.plugin(passportLocalMongoose);


const User = new model('user',userSchema)


passport.use(User.createStrategy());

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
// const encryptionKey='jksdnfcjkesnfjkndsfjkndsjk';

//ENV WORKINF LEVEL-2:
// console.log(process.env.SECRET)
// userSchema.plugin(encrypt,{secret:process.env.SECRET,encryptedFields:['userPassword']});


const UserInfo =new model('userinfo',userSchema);

app.get('/',(req,res)=>{
    res.render('home')
})


app.route('/register')
.get((req,res)=>{
    res.render('register')
})




.post((req,res)=>{
    //brcypt

//  bcrypt.hash(req.body.password, saltRounds, function(err, hash) {

//     const newUser = new UserInfo({
//         email:req.body.username,
//         userPassword:hash
//       })
//       newUser.save().then(()=>{
//         console.log('Successfully Saved')
//         res.render('secrets')
//       })
        
    // });

app.get('/secrets',(req,res)=>{
    // console.log(req.isAuthentica ted())
        if(req.isAuthenticated()){
        res.render('secrets')

     }else{
        console.log('unautherised')
     }
})
 

User.register({username:req.body.username}, req.body.password, function(err, user) {
      
      if(err){
        res.redirect('/login')
      }else{
        
        passport.authenticate('local')(req,res,()=>{
            res.redirect('/secrets')
        })
      }
        
        
    });

    
  
  
  
})


app.get('/login',(req,res)=>{
  res.render('login')

})

app.post('/login',(req,res)=>{
    const username = req.body.username;
    const password = req.body.password;

    const user = new User({
        username:username,
        password:password
    })

    //brcypt.

    // UserInfo.findOne({email : username}).then((data)=>{
     
    
    //         bcrypt.compare(password, data.userPassword, function(err, result) {
    //             if(result === true){
    //             res.render('secrets')
    //             }else{
    //                 console.log('Error')
    //             }
    //         });
        
       
        
    // })


    req.login(user,function(err){
        if(err){
            console.log(err)
        }else{
            passport.authenticate('local')(req,res,()=>{
                res.redirect('/secrets')
            })
        }
       })
        

})

app.get('/logout',(req,res)=>{
    req.logout((err)=>{
  if(err){
    console.log(err)
  }else{
    res.redirect('/')

  }
    })
})

app.listen('3000',function(){
    console.log('server Started');
})
