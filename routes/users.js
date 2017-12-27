var express = require('express');
var router = express.Router();
var conn = require("../utils/conn");

var async =require("async");

/* GET users listing. */
router.get('/', function (req, res, next) {
  var id=req.query.id;
  console.log(id); 
  var mongodb=require("mongodb");
  var ObjectId=mongodb.ObjectId;
  id=ObjectId(id);
  conn.getDb((err,db)=>{
  var userInfo = db.collection("user");
    userInfo.find({_id:id}).toArray((err,result)=>{
      res.render("users",  {
        username:req.session.username,
        id:req.session._id,
        result
    
      })
      db.close();
    })
  })

});
//user信息更改
router.post("/update",(req,res)=>{
  var id=req.body.id;
  var username=req.body.username;
  var password=req.body.password;
  var email=req.body.email;
  console.log(id)
  var mongodb = require("mongodb");
  var ObjectId=mongodb.ObjectId;
  conn.getDb((err,db)=>{
      var _id=ObjectId(id);
      var user=db.collection("user");
      
      user.update({_id:_id},{
          $set:{
              username:username,
              password:password,
              email:email
          }
      },(err,result)=>{
          if(err) throw err;
          res.send({status:1});
      })
  })
})

// 注册
router.post("/register",(req,res)=>{
  //获取post信息
  var username=req.body.username;
  
  var password=req.body.password;
  var dbpwd = req.body.dbpwd;
  var email = req.body.email;
  //inserData 判断数据库是否存在该用户，然后进行入库操作
  var insertData = function(db,cb){
    var userInfo = db.collection("user");
    async.waterfall([
      (cb)=>{
        userInfo.find({username:username},{}).toArray((err,result)=>{
          if(err) throw err;
          console.log("查询结果"+result.length);
          if(result.length>0){
            cb(null,true);//已经存在该用户
          }else{
            cb(null,false);
          }
        })
      },
      (arg,cb)=>{
        if(!arg){
          console.log("该用户名可以使用")
          var date = new Date();
          // 表userI插入数据
          userInfo.insert({
            username:username,
            password:password,
            email:email,
            time:date 
          },(err,result)=>{
            if(err) throw err;
            console.log(result);
            cb(null,0);
          })
        }else{
          console.log("该用户名已经被使用")
          cb(null,1)
        }
      }],(err,result)=>{
        // console.log()
        if(err) throw err;
        cb(result);
      }) 
    }
    conn.getDb((err,db)=>{
      if(err) throw err;
      console.log("注册提交连接数据库成功");
      insertData(db,(result)=>{
        console.log("判断返回"+result);
        if(result == 1){
          res.send({status:1});         
        }else{
          res.send({status:0});
        }
      })
  })
});
  

  
router.post("/login",(req,res)=>{
  var username=req.body.username;
  var password=req.body.password;
  conn.getDb((err,db)=>{
    var userInfo = db.collection("user");
    userInfo.find({username:username},{}).toArray((err,result)=>{
        if(result.length>0){
          req.session.username = username;
          var ObjectID = require("mongodb").ObjectID;
          var id=ObjectID(result[0]._id)
          req.session._id=id;
          
          if(username=="zd"){
            res.send({status:1});
          }else{
            res.send({status:1});
          } 
        }else{
          res.send({status:0});//失败
        }
    })
  })
})
  






module.exports = router;
