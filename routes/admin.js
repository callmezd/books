var express = require('express');
var router = express.Router();
var conn=require("../utils/conn");
var async = require("async")


//渲染页面
router.get("/",(req,res)=>{
    conn.getDb((err,db)=>{
        var user=db.collection("user");
        user.find().toArray((err,result)=>{
        res.render('admin',{
            username:req.session.username,
            id:req.session.id,
            result:result
        });
        })
    })
})
//删除

router.post("/del",(req,res)=>{
    var _id=req.body.id;
    console.log("last:"+_id);
    var mongodb = require("mongodb");
    var ObjectId=mongodb.ObjectId;
    _id=ObjectId(_id);
    console.log("now:"+_id)
    conn.getDb((err,db)=>{
        var user=db.collection("user");
        user.deleteOne({_id:_id},(err,result)=>{
            if(err){
                console.log(err)
            }else{
            res.send({status:1})
            } 
        })
    })
})

//修改框
router.post("/update",(req,res)=>{
    var _id=req.body.id;
    console.log("last:"+_id);
    var mongodb = require("mongodb");
    var ObjectId=mongodb.ObjectId;
    _id=ObjectId(_id);
    console.log("now:"+_id);
    conn.getDb((err,db)=>{
        var showAll = function(db,cb){
            var comment=db.collection("comment");
            var user=db.collection("user");
            async.waterfall([
                (cb)=>{
                    user.find({_id:_id}).toArray((err,result)=>{
                        if(err) throw err;
                        var userInfo = result[0];
                        console.log("用户查询"+userInfo)
                        cb(null,userInfo)
                    })
                },(userInfo,cb)=>{
                    var username=userInfo.username;
                    console.log(username)
                    comment.find({username:username}).toArray((err,result)=>{
                        if(err) throw err;
                        var comms=result;
                        console.log("评论查询"+comms);
                        var obj={
                            userInfo:userInfo,
                            comms:comms
                        }
                    
                        cb(null,obj);
                    })
                }
            ],(err,result)=>{
                if(err) throw err;
                cb(result);
            })
        }
        showAll(db,(result)=>{
            console.log("最终查询"+result)
            res.send({
                result:result
             })
        })

    })
})
//修改
router.post("/updatenow",(req,res)=>{
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

//删除评论
router.post("/delcom",(req,res)=>{
    console.log(req.body.id);
    var _id=req.body.id;
    var mongodb = require("mongodb");
    var ObjectId=mongodb.ObjectId;
    var _id=ObjectId(_id);
    conn.getDb((err,db)=>{
        var comment=db.collection("comment");
        comment.deleteOne({_id:_id},(err,result)=>{
            if(err){
                console.log(err)
                res.send({status:0});

            }else{
            res.send({status:1})
            } 
        })
    })

})



module.exports = router;