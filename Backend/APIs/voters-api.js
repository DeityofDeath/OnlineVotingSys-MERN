const exp = require("express");
const votersApp = exp.Router();
const bcryptjs = require("bcryptjs");
const expressAsyncHandler = require("express-async-handler");
const jwt = require("jsonwebtoken");
const verifyToken=require('../middleware/verifyToken');
require("dotenv").config();

let voters;
let admin;
let elections;
let votes;

votersApp.use((req, res, next) => {
    voters = req.app.get("voters");
    admin = req.app.get("admin");
    elections = req.app.get("elections");
    votes = req.app.get("votes");
    next();
  });


  //user register
  votersApp.post(
    "/register",
    expressAsyncHandler(async (req, res) => {
      const newUser = req.body;
      const dbuser = await voters.findOne({ username: newUser.username });
      if (dbuser !== null) {
        res.send({ message: "User existed" });
      } else {
        const hashedPassword = await bcryptjs.hash(newUser.password, 6);
        newUser.password = hashedPassword;
        await voters.insertOne(newUser);
        await votes.insertOne({
          username: newUser.username,
          voted: false,
          for:-1
        });
        res.send({ message: "User created" });
      }
    })
  );



  //user login
votersApp.post(
    "/login",
    expressAsyncHandler(async (req, res) => {
      const userCred = req.body;
      const dbuser = await voters.findOne({
        username: userCred.username,
      });
      if (dbuser === null) {
        res.send({ message: "Invalid username" });
      } else {
        const status = await bcryptjs.compare(userCred.password, dbuser.password);
        if (status === false) {
          res.send({ message: "Invalid password" });
        } else {
          const signedToken = jwt.sign(
            { username: dbuser.username },
            process.env.SECRET_KEY,
            { expiresIn: '1d' }
          );
          res.send({
            message: "login success",
            token: signedToken,
            user: dbuser,
          });
        }
      }
    })
  );



  // voter voting only if the status of election is true
  votersApp.get('/vote/:username',expressAsyncHandler(async(req,res)=>{
    const voterInfo = req.params.username;
    let voteInfo = await votes.findOne({username : voterInfo});
    let eleInfo = await elections.findOne();
    if(voteInfo.voted===false && eleInfo.status===true){
    try{
      let vinfo = await votes.findOneAndUpdate({username:voterInfo},{$set:{voted:true}});
      res.json(vinfo);
    }catch(err){
      return res.status(500).json({message:"error the vote is not registered"})
    }
  }else{
    return res.json({message:"The vote has already been casted"})
  }
  }))


  

module.exports = votersApp;

