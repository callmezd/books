var mongodb = require("mongodb");
var MongoClient = mongodb.MongoClient;
// var CONN_DB_STR = "mongodb://120.78.188.22/zhudan";
var CONN_DB_STR = "mongodb://localhost:27017/zd";

var ObjectId=mongodb.ObjectId;
module.exports = {
    getDb:function(callback){
        MongoClient.connect(CONN_DB_STR,(err,db)=>{
            if(err){
                callback(err,null);
            }else{
                callback(null,db);
            }
        })
    }
}