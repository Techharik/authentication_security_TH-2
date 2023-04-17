// import * as dotenv from 'dotenv'
// dotenv.config()
import express from "express";
import bodyParser from "body-parser";
import ejs from 'ejs';
import { model,Schema,connect } from "mongoose";
// import md5 from 'md5';
import bcrypt from 'bcrypt';

const saltRounds = 10;
// import encrypt from 'mongoose-encryption';

// import userCheck from "./js/user";
const app = express();

//settign up the server in express;

app.set('view engine','ejs');
app.use(express.static('public'))
app.use(bodyParser.urlencoded({extended:true}));

//creating a database:

connect('mongodb://localhost:27017/userData')

const userSchema = new Schema({
    email:String,
    userPassword:String,
})

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

 bcrypt.hash(req.body.password, saltRounds, function(err, hash) {

    const newUser = new UserInfo({
        email:req.body.username,
        userPassword:hash
      })
      newUser.save().then(()=>{
        console.log('Successfully Saved')
        res.render('secrets')
      })
        
    });
 

 

    
  
  
  
})


app.get('/login',(req,res)=>{
    res.render('login')
    

})

app.post('/login',(req,res)=>{
    const username = req.body.username;
    const password = req.body.password;

    UserInfo.findOne({email : username}).then((data)=>{
     
    
            bcrypt.compare(password, data.userPassword, function(err, result) {
                if(result === true){
                res.render('secrets')
                }else{
                    console.log('Error')
                }
            });
        
       
        
    })

})



app.listen('3000',function(){
    console.log('server Started');
})
