import express from "express";
import bodyParser from "body-parser";
import ejs from 'ejs';
import { model,Schema,connect } from "mongoose";
import encrypt from 'mongoose-encryption';
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
const encryptionKey='jksdnfcjkesnfjkndsfjkndsjk'
userSchema.plugin(encrypt,{secret:encryptionKey,encryptedFields:['userPassword']});


const UserInfo =new model('userinfo',userSchema);

app.get('/',(req,res)=>{
    res.render('home')
})


app.route('/register')
.get((req,res)=>{
    res.render('register')
})




.post((req,res)=>{
  const newUser = new UserInfo({
    email:req.body.username,
    userPassword:req.body.password
  })

 

    newUser.save().then(()=>{
        console.log('Successfully Saved')
        res.render('secrets')
      })
  
  
  
})


app.get('/login',(req,res)=>{
    res.render('login')
    

})

app.post('/login',(req,res)=>{
    const username = req.body.username;
    const password = req.body.password;
    UserInfo.findOne({email : username}).then((data)=>{
        if (data.userPassword === password){
            res.render('secrets')
        }
    })

})



app.listen('3000',function(){
    console.log('server Started');
})
