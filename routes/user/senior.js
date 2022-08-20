const express = require('express');
const router = express.Router();

const Senior = require('../../schema/senior');
const Junior = require('../../schema/junior');

router.get('/profile/:UserNo', function(req, res){
    const {UserNo} =req.params;
    Senior.findOne({UserNo: UserNo}, function(err, senior){
        let temp = senior.Feedback;
        let score=0;
        for(let i=0; i<temp.length; i++){
            score += temp[i].Score;
        }
        if(temp.length>0){
            score /= temp.length
        }else{
            score = 0
        }
        let seniorInfo = {
            Name: senior.Name,
            Score: score,
            Company: senior.Company,
            Category: senior.Category,
            WorkPeriod: senior.Profile.WorkPeriod,
            Introduction: senior.Profile.Introduction,
            Career: senior.Profile.Career,
            Answer: senior.Profile.Answer
        }
        res.send(seniorInfo);
    })
})

router.post('/meetingInfo', function(req, res){
    const {UserNo} = req.body;
    Senior.findOne({UserNo: UserNo}, function(err, senior){
        if(senior.Meeting.length>1){
            senior = senior.sort((a, b) => Number(a.Meeting.Start) - Number(b.Meeting.Start));
            let temp = senior.Meeting[0].Junior_id.Feedback
            let score=0;
            for(let i=0; i<temp.length; i++){
                score += temp[i].Score;
            }
            if(temp.length>0){
                score /= temp.length
            }else{
                score = 0
            }
            let juniorInfo = {
                Name: senior.Meeting[0].Junior_id.Name,
                Category: senior.Meeting[0].Junior_id.Category,
                Start: senior.Meeting[0].Start,
                End: senior.Meeting[0].End,
                Title: senior.Meeting[0].Junior_id.Profile.Title,
                Score: score
            };
        res.send(juniorInfo);
        }else{
            let temp = senior.Meeting[0].Junior_id.Feedback
            let score=0;
            for(let i=0; i<temp.length; i++){
                score += temp[i].Score;
            }
            if(temp.length>0){
                score /= temp.length
            }else{
                score = 0
            }
            let seniorInfo = {
                Name: senior.Meeting[0].Junior_id.Name,
                Category: senior.Meeting[0].Junior_id.Category,
                Start: senior.Meeting[0].Start,
                End: senior.Meeting[0].End,
                Title: senior.Meeting[0].Junior_id.Profile.Title,
                Score: score
            };
        res.send(seniorInfo);
        }
    }).populate({
        path: "Meeting.Junior_id"
    }) 
})

router.post('/search', function(req, res){ 
    const {Company, Category} = req.body;
    if(!(Company||Category)){
        res.send([]);
    }
    else if(Company){
        Senior.find({Company:Company}, function(err, seniors){
            res.send(seniors);
        }).select("Name Company UserNo Profile Category ConnectCnt")
    }else{
        Senior.find({Category:Category}, function(err, seniors){
            res.send(seniors);
        }).select("Company  Name UserNo Profile Category ConnectCnt")
    }
})

router.post('/profile', function(req, res){ 
    const {UserNo, Title, Introduction, Answer, Career, Certification, AssignedWork, WorkTag, CharacterTag, WorkPeriod} = req.body;
    let profile = {
        UserNo: UserNo,
        Title: Title,
        Introduction: Introduction,
        Certification: Certification,
        AssignedWork: AssignedWork,
        WorkTag: WorkTag,
        CharacterTag: CharacterTag,
        Career: Career,
        Answer: Answer,
        WorkPeriod: WorkPeriod
    }
    Senior.findOneAndUpdate(
        {UserNo: UserNo}, 
        {$set: {Profile: profile, Flag: 1}},
        function(err, junior){
            if (err) throw err;
            res.json({message: "프로필 수정이 완료되었습니다."})
        })
})

module.exports = router;