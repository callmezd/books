var express = require('express');
var router = express.Router();

/* GET home page. */
// router.get('/', function(req, res, next) {
//   res.render('index', { title: 'hh' });
  
// });
router.get('/', function(req, res, next) {
  // res.render 渲染 模板   读取 html
  console.log(req.session);
  res.render('./index.ejs', 
  {
    username:req.session.username,
    id:req.session._id
  }
  );     
});
//登录渲染
router.get('/login', function(req, res, next) {
  res.render("login");
});
//注册页面渲染
router.get('/register', function(req, res, next) {
  res.render('register', {result: 0 ,sh:"hide"});
});
//登出操作
router.get("/logout",(req,res)=>{

  req.session.destroy((err)=>{
    if(err) throw err;
    res.redirect("/")
  })
})




module.exports = router;
