var express = require("express");
var router=express.Router();
var async =  require("async");
var conn =require("../utils/conn");
//渲染图书页
router.get("/",(req,res)=>{
    conn.getDb((err,db)=>{
        console.log(1)
        var books=db.collection("books");
        books.find().toArray((err,result)=>{
            res.render('./books', 
            {
              username:req.session.username,
              id:req.session._id,
              result:result
            })
           
        })
    })    
})

// 图书详情页渲染
router.get("/detail",(req,res)=>{
    var bookid=req.query.id;
    var data = {};   
    var comm={};
    console.log("图书id  "+bookid)
    conn.getDb((err,db)=>{
        var books=db.collection("books");
        var comment=db.collection("comment");        
        async.series([
            (callback)=>{
            books.findOne({id:bookid},{},function(err,result){
                if(err) throw err;                    
                console.log("books连接成功");               
                callback(null,result);                
            })                
            },(callback)=>{
                console.log("comment连接成功");                
                comment.find({bookid:bookid},{}).sort({_id:-1}).toArray((err,result)=>{
                    if(err) throw err;
                    console.log("comm输出"+result)                  
                    callback(null,result);    
                })

                
            }

        ],(err,result)=>{
            if(err) throw err;
            // data = Object.assign(data,{result:result[0]},{comment:comm});  
            console.log("返还图书和评论数据")         
            
            res.render("./book",{
                        username:req.session.username,
                        id:req.session._id,
                        result:result[0],
                        comment:result[1]
                             })
                        })
        })
})

//详情页评论提交
router.post("/comm",(req,res)=>{  
    //时间补0  1:1===>01:01
    function add0(num){
        if(num<10){
            return `0`+num;
        }else{
            return num;
        }
    }
    var bookid=req.query.id;   
    var data=req.body;
    var title =data.title;
    var centent =data.centent;
    var username =req.session.username;
    var booktitle=req.body.booktitle;
    var time = new Date();

    var now = time.getMonth()+1+"月"+time.getDate()+"日  "+add0(time.getHours())+":"+add0(time.getMinutes())+':'+add0(time.getSeconds());
    console.log("图书id  "+bookid);
    conn.getDb((err,db)=>{    
        var comment=db.collection("comment");
        comment.save({
            title:title,
            centent:centent,
            username:req.session.username,
            
            time:now,
            bookid:bookid,
            booktitle:booktitle
        })
        res.redirect("/books/detail?id="+bookid)
    })
})
    

module.exports=router;