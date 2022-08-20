const express = require("express");
const router = express.Router();

const User = require("../schema/senior");
const Junior = require("../schema/junior");
const Senior = require("../schema/senior");

const senior_recommendation = (Senior_info, seniors)=>{
  let similarity_array = [];
  if(Senior_info.Flag !== 1) {//인기 시니어 추천
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
          ConnectCnt: seniors[i].ConnectCnt
          });
      }
    }
  }else{//유사성 검증 후 추천
    for (let i = 0; i < seniors.length; i++) {
      if((Senior_info.UserNo !== seniors[i].UserNo) &&(seniors[i].Flag == 1) ){
        let temp = seniors[i].Feedback
        let score=0;
        for(let j=0; i<temp.length; j++){
          score += temp[j].Score;
        }
        if(temp.length > 0){
          score /= temp.length;
        }else{
          score = 0;
        }
        let company_intersection = Senior_info.Company.filter(x => seniors[i].Company.includes(x)).length;
        let company_union = new Set([...Senior_info.Company, ...seniors[i].Company]).size;
        let company_jaccard = company_intersection / company_union;
        let work_intersection = Senior_info.Profile.WorkTag.filter(x => seniors[i].Profile.WorkTag.includes(x)).length;
        let work_union = new Set([...Senior_info.Profile.WorkTag, ...seniors[i].Profile.WorkTag]).size;
        let work_jaccard = work_intersection / work_union;
        let character_intersection = Senior_info.Profile.CharacterTag.filter(x => seniors[i].Profile.CharacterTag.includes(x)).length;
        let character_union = new Set([...Senior_info.Profile.CharacterTag, ...seniors[i].Profile.CharacterTag]).size;
        let character_jaccard = character_intersection / character_union;
        let similarity = (company_jaccard * 0.15) + (work_jaccard * 0.15) + (character_jaccard * 0.15) + (seniors[i].ConnectCnt * 0.25) + (score * 0.3);
        similarity_array.push({
            UserNo: seniors[i].UserNo,
            Company: seniors[i].Company,
            Category: seniors[i].Category,
            Period: seniors[i].Profile.WorkPeriod,
            WorkTag: seniors[i].Profile.WorkTag,
            CharacterTag: seniors[i].Profile.CharacterTag,
            ConnectCnt: seniors[i].ConnectCnt,
            Similarity: similarity
        });
      }
    }
    similarity_array = similarity_array.sort((a,b) => b.Similarity - a.Similarity)
  }
  return similarity_array;
}

const junior_recommendation = (Junior_info, seniors)=>{
  let similarity_array = [];
  if(Junior_info.Flag !== 1) {//인기 시니어 추천
    console.log(1);
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
        ConnectCnt: seniors[i].ConnectCnt
        }); 
      }
    }
  }else{//유사성 검증 후 추천
    console.log(2);
    for (let i = 0; i < seniors.length; i++) {
      if((Junior_info.UserNo !== seniors[i].UserNo) && (seniors[i].Flag == 1)){
        let temp = seniors[i].Feedback
        let score=0;
        for(let j=0; i<temp.length; j++){
          score += temp[j].Score;
        }
        if(temp.length > 0){
          score /= temp.length;
        }else{
          score = 0;
        }
        let company_intersection = Junior_info.Company.filter(x => seniors[i].Company.includes(x)).length;
        let company_union = new Set([...Junior_info.Company, ...seniors[i].Company]).size;
        let company_jaccard = company_intersection / company_union;
        console.log(seniors[i].ConnectCnt)
        let work_intersection = Junior_info.Profile.WorkTag.filter(x => seniors[i].Profile.WorkTag.includes(x)).length;
        let work_union = new Set([...Junior_info.Profile.WorkTag, ...seniors[i].Profile.WorkTag]).size;
        let work_jaccard = work_intersection / work_union;
        let character_intersection = Junior_info.Profile.CharacterTag.filter(x => seniors[i].Profile.CharacterTag.includes(x)).length;
        let character_union = new Set([...Junior_info.Profile.CharacterTag, ...seniors[i].Profile.CharacterTag]).size;
        let character_jaccard = character_intersection / character_union;
        let similarity = (company_jaccard * 0.15) + (work_jaccard * 0.15) + (character_jaccard * 0.15) + (seniors[i].ConnectCnt * 0.25) + (score * 0.3);
        similarity_array.push({
          UserNo: seniors[i].UserNo,
          Company: seniors[i].Company,
          Category: seniors[i].Category,
          Period: seniors[i].Profile.WorkPeriod,
          WorkTag: seniors[i].Profile.WorkTag,
          CharacterTag: seniors[i].Profile.CharacterTag,
          ConnectCnt: seniors[i].ConnectCnt,
          Similarity: similarity
        });
      }
    }
    similarity_array = similarity_array.sort((a,b) => b.Similarity - a.Similarity)
  }
  return similarity_array;
}

/* 로그인 */
router.post("/", function(req, res){
  const { ID, Password} = req.body.userInfo;
  User.findOne({ID: ID, Password: Password}, function(err, user){
    if(err) throw err;
    if(user===null){
      res.json({login: false});
    }else{
      if(user.Status===1){  // Senior가 로그인을 하는 경우
       let NewJuniorList = [];
       Senior.find({Category:user.Category, Status: 1}, function(err, seniors){
        let recommendList = senior_recommendation(user, seniors)

        Junior.find({ Category: user.Category, Status: 2 },function(err, juniors){
          for (let i = 0; i < juniors.length; i++) {
            if (juniors[i].Profile.Title !== undefined) {
              NewJuniorList.push({
                Title: juniors[i].Profile.Title,
                Content: juniors[i].Profile.Content,
                Register_Date: juniors[i].createdAt,
                UserNo: juniors[i].UserNo,
              });
            }
          }
          NewJuniorList = NewJuniorList.sort(
            (a, b) => b.createdAt - a.createdAt
          );
          res.json({
            ID: user.ID,
            Name: user.Name,
            UserNo: user.UserNo,
            Status: user.Status,
            RecommendSeniorList : recommendList, 
            NewJuniorList: NewJuniorList,
          });
        });

       })

      }else{  // Junior가 로그인을 하는 경우
        Senior.find({Category:user.Category, Status: 1}, function(err, seniors){
          let recommendList = junior_recommendation(user, seniors)
          res.json({
            ID: user.ID,
            UserNo: user.UserNo,
            Name: user.Name,
            RecommendSeniorList : recommendList, 
            Status: user.Status
          });
        })
      }
    }
  })
});

module.exports = router;
