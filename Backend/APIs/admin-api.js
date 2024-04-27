const exp = require("express");
const adminApp = exp.Router();
const bcryptjs = require("bcryptjs");
const expressAsyncHandler = require("express-async-handler");
const jwt = require("jsonwebtoken");
const verifyToken=require('../middleware/verifyToken');
require("dotenv").config();

let voters;
let admin;
let elections;
let votes;

adminApp.use((req, res, next) => {
    voters = req.app.get("voters");
    admin = req.app.get("admin");
    elections = req.app.get("elections");
    votes = req.app.get("votes");
    next();
  });


//admin login
adminApp.post('/login',expressAsyncHandler(async(req,res)=>{
    const userCred=req.body;
    const dbuser=await admin.findOne({username:userCred.username})
    if(dbuser===null){
        res.send({message:"Invalid username"})
    }else{
       const status=await bcryptjs.compare(userCred.password,dbuser.password)
       if(status===false){
        res.send({message:"Invalid password"})
       }else{
        const signedToken=jwt.sign({username:dbuser.username},process.env.SECRET_KEY,{expiresIn:'1d'})
        res.send({message:"login success",token:signedToken,user:dbuser})
       }
    }
}))

//get the whole voter count
adminApp.get('/count',expressAsyncHandler(async(req,res)=>{
    const voterCount = await voters.count();
    res.send({voterCount});
    // console.log(voterCount);
}))

adminApp.get('/votedcount', expressAsyncHandler( async (req, res) => {
    try {
        const votedCount = await votes.countDocuments({ voted: true });
        res.json({ votedCount });
    } catch (error) {
        console.error("Error getting voted count:", error);
        res.status(500).json({ message: "Error getting voted count" });
    }
}))

// now to add a new election in elections collection
adminApp.post("/addElection" , expressAsyncHandler ( async (req,res)=> {
    const eleInfo = req.body;
    const eleno = await elections.countDocuments();
    if(eleno===0){
    try{
        // console.log(eleInfo)
        eleInfo.status = true;  //default status of an election is active i.e., it can receive votes
        await elections.insertOne(eleInfo);
        res.send({message:"Election added successfully"})
    }catch(err){
        res.status(409).send("Error adding Election");
        console.error(err);
    }
    }else{
        res.send( {message : 'Already one election is goingon'} );
    }
} ))

// now to stop the election
adminApp.put("/stopElection",expressAsyncHandler(async(req,res)=>{
    const eleInfo = await elections.findOne();
    ele = eleInfo.electionTitle;
    if(eleInfo.status===true){
        await elections.findOneAndUpdate({electionTitle:ele},{$set:{status:false}});
        res.send({message:`${ele} has been stopped`});
    }else{
        res.status(409).send('This election is already Stopped');
    }
}))


// now to delete the election that was created previously
adminApp.delete('/deleteElection/:title' , expressAsyncHandler ( async (req , res ) => {
    let title = req.params.title ;
    try {
        let deletedElection = await elections.findOneAndDelete ({ electionTitle: title }) ;
        res.json ( deletedElection );
        // res.send ("Deleted Successfully");
    }catch ( err ) {
        return res.status ( 500 ). json ({ message : 'Error deleting the election' });
    }
}))













module.exports = adminApp;

