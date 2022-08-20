const express = require("express");
const router = express.Router();

const Senior = require("../schema/senior");
const Junior = require("../schema/junior");

const senior_recommendation = (Senior_info, seniors)=>{
  let similarity_array = [];
    seniors = seniors.sort((a,b) => b.ConnectCnt - a.ConnectCnt);
    for (let i = 0; i < seniors.length; i++) {
      if((Senior_info.UserNo !== seniors[i].UserNo) &&(seniors[i].Flag == 1) ){
          similarity_array.push({
          UserNo: seniors[i].UserNo,
          Company: seniors[i].Company,
          Category: seniors[i].Category,
          Period: seniors[i].Profile.WorkPeriod,
          WorkTag: seniors[i].Profile.WorkTag,
          CharacterTag: seniors[i].Profile.CharacterTag,
          Image: seniors[i].Image,
          ConnectCnt: seniors[i].ConnectCnt
          });
      }
    }
  
  return similarity_array;
}

const junior_recommendation = (Junior_info, seniors)=>{
  let similarity_array = [];
    seniors = seniors.sort((a,b) => b.ConnectCnt - a.ConnectCnt);
    for (let i = 0; i < seniors.length; i++) {
      if((Junior_info.UserNo !== seniors[i].UserNo) && (seniors[i].Flag == 1)){
        similarity_array.push({
        UserNo: seniors[i].UserNo,
        Company: seniors[i].Company,
        Category: seniors[i].Category,
        Period: seniors[i].Profile.WorkPeriod,
        WorkTag: seniors[i].Profile.WorkTag,
        CharacterTag: seniors[i].Profile.CharacterTag,
        Image: seniors[i].Image,
        ConnectCnt: seniors[i].ConnectCnt
        }); 
      }
    }
  
  return similarity_array;
}
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
      Image: userInfo.Image,
      ConnectCnt: 0
    });
    createUser.save(function (err, user){
      if (err) throw err;
      let NewJuniorList=[];
      Senior.find({Category:user.Category, Status: 1}, function(err, seniors){
        let recommendList = senior_recommendation(user, seniors)
      Junior.find({Category: user.Category, Status: 2},function(err, juniors){
        for(let i=0; i< juniors.length; i++){
          if(juniors[i].Profile.Title!==undefined){
            NewJuniorList.push({
              Title: juniors[i].Profile.Title,
              Content: juniors[i].Profile.Content,
              Register_Date: juniors[i].createdAt,
              UserNo: juniors[i].UserNo,
              Image: juniors[i].Image
            })
          }
        }
        NewJuniorList = NewJuniorList.sort((a, b) => b.createdAt - a.createdAt);
        res.json({
          ID: user.ID,
          Name: user.Name,
          UserNo: user.UserNo,
          Status: user.Status,
          NewJuniorList: NewJuniorList,
          RecommendSeniorList : recommendList 
        });
      })
    });
  })
  }else{
    createUser = new Junior({
      ID: userInfo.ID,
      Name: userInfo.Name,
      Password: userInfo.Password,
      Status: userInfo.Status,
      Company: userInfo.Company,
      Category: userInfo.Category,
      Image: userInfo.Image
    });
    createUser.save(function (err, user){
      if (err) throw err;
      Senior.find({Category:user.Category, Status: 1}, function(err, seniors){
        let recommendList = junior_recommendation(user, seniors)
      res.json({
        ID: user.ID,
        Name: user.Name,
        UserNo: user.UserNo,
        RecommendSeniorList : recommendList, 
        Status: user.Status
      });
    });
  })
  }
});

module.exports = router;
