const express = require("express");
const router = express.Router();

const Senior = require("../schema/senior");
const Junior = require("../schema/junior");

/* 회원가입 */
router.post("/", function(req, res, next){
  const { userInfo } = req.body;
  let createUser;
  if(userInfo.Status===1){
    createUser = new Senior({
      ID: userInfo.ID,
      Name: userInfo.Name,
      Password: userInfo.Password,
      Status: userInfo.Status,
      Company: userInfo.Company,
      Category: userInfo.Category,
      ConnectCnt: 0
    });
    createUser.save(function (err, user){
      if (err) throw err;
      let NewJuniorList=[];
      Junior.find({Category: user.Category, Status: 2},function(err, juniors){
        for(let i=0; i< juniors.length; i++){
          if(juniors[i].Profile.Title!==undefined){
            NewJuniorList.push({
              Title: juniors[i].Profile.Title,
              Content: juniors[i].Profile.Content,
              Register_Date: juniors[i].createdAt,
              UserNo: juniors[i].UserNo
            })
          }
        }
        NewJuniorList = NewJuniorList.sort((a, b) => b.createdAt - a.createdAt);
        res.json({
          ID: user.ID,
          Name: user.Name,
          UserNo: user.UserNo,
          Status: user.Status,
          NewJuniorList: NewJuniorList
        });
      })
    });
  }else{
    createUser = new Junior({
      ID: userInfo.ID,
      Name: userInfo.Name,
      Password: userInfo.Password,
      Status: userInfo.Status,
      Company: userInfo.Company,
      Category: userInfo.Category
    });
    createUser.save(function (err, user){
      if (err) throw err;
      res.json({
        ID: user.ID,
        Name: user.Name,
        UserNo: user.UserNo,
        Status: user.Status
      });
    });
  }
});

module.exports = router;
