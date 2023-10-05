//jshint esversion:6
require('dotenv').config()
const express=require('express')
const bodyParser=require('body-parser')
const ejs=require('ejs')
const encrypt=require('mongoose-encryption')

const port=3000
const app=express()
app.use(bodyParser.urlencoded({extended:true}))
app.use(express.static('public'))
app.set('view engine','ejs')
const mongoose=require('mongoose')
const { encryptedChildren } = require('mongoose-encryption')
mongoose.connect('mongodb://127.0.0.1:27017/userDB')
const userSchema=new mongoose.Schema({
    email:String,
    password:String
})
//console.log(process.env.SECRET)

var secret='saidkarim'
userSchema.plugin(encrypt,{secret:process.env.SECRET,encryptedFields:["password"]})
const Users=mongoose.model('Users',userSchema)
app.get('/',function(req,res){
    res.render('home')
})
app.get('/login',function(req,res){
    res.render('login')
})
app.get('/register',function(req,res){
    res.render('register')
})
app.get('/secrets',function(res,req){
    res.render('secrets')
})
app.post('/register',async function(req,res){
   //console.log(req.body.username,req.body.password)
   const {email,password}=req.body
   const user1=new Users({
        email:req.body.username,
        password:req.body.password
    })
    //console.log(email,password)
    try{
        await user1.save()
    
    }catch(err){
        console.log(err)
        res.status(500).send('theres an eerrroe')
    } 
    res.render('secrets')
    })
    // const userSchema=new mongoose.Schema({
    //     email:String,
    //     password:String
    // })
//     var secret='saidkarim'
// userSchema.plugin(encrypt,{secret:secret,encryptedFields:["password"]})
// const Users=mongoose.model('Users',userSchema)
app.post('/login',async function(req,res){
    const {username,password}=req.body
    
    try {
        console.log('this is password geted',password)
        const userFind=await Users.findOne({email:username})
        console.log(userFind.password)
        if(userFind){
            if(password===userFind.password){
                res.render('secrets')
            }else{
                console.log('not denied')
                res.status(404).send('something wrong')
            }
        }else{
            console.log('not existing user')
        }
    }catch(err){
        console.log(err)
        res.status(500).send('not denied')
    }
})
app.listen(port,()=> {
    console.log('its connect in the port',port)
})