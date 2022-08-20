const express = require('express');
const router = express.Router();

const Senior = require('../../schema/senior');
const Junior = require('../../schema/junior');

router.post('/meetingInfo', function(req, res){
    const {UserNo} = req.body;
    Junior.findOne({UserNo: UserNo}, function(err, junior){
        if(junior.Meeting.length>1){
            junior = junior.sort((a, b) => Number(a.Meeting.Start) - Number(b.Meeting.Start));
            let temp = junior.Meeting[0].Senior_id.Feedback
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
                Name: junior.Meeting[0].Senior_id.Name,
                Category: junior.Meeting[0].Senior_id.Category,
                Start: junior.Meeting[0].Start,
                Title: junior.Meeting[0].Senior_id.Profile.Title,
                Score: score
            };
        res.send(seniorInfo);
        }else{
            let temp = junior.Meeting[0].Senior_id.Feedback
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
                Name: junior.Meeting[0].Senior_id.Name,
                Category: junior.Meeting[0].Senior_id.Category,
                Start: junior.Meeting[0].Start,
                Title: junior.Meeting[0].Senior_id.Profile.Title,
                Score: score
            };
        res.send(seniorInfo);
        }
    }).populate({
        path: "Meeting.Senior_id"
    }) 
}) 

router.post('/profile', function(req, res){ 
    const {UserNo, Title, Content, WorkTag, CharacterTag} = req.body;
    let request = {
        Title: Title,
        Content: Content,
        WorkTag: WorkTag,
        CharacterTag: CharacterTag,
    }
    Junior.findOneAndUpdate(
        {UserNo: UserNo}, 
        {$set: {Profile: request, Flag: 1}},
        function(err, junior){
            if (err) throw err;
            res.json({message: "프로필 수정이 완료되었습니다."})
        })
})

router.post('/appointment', function(req, res){
    const {Start, End, SeniorNo, JuniorNo} = req.body;
    Junior.findOne({UserNo: JuniorNo}, function(err, junior){
        let Junior_id = junior._id;
        Senior.findOneAndUpdate(
            {UserNo: SeniorNo}, 
            {
                $push: {
                    Meeting: {
                        Start: Start,
                        End: End,
                        Junior_id: Junior_id
                    }
                }
            }, 
            function(err, senior){
                if(err) throw err;
            }
        )
    })
    Senior.findOne({UserNo: SeniorNo}, function(err, senior){
        let Senior_id = senior._id;
        Junior.findOneAndUpdate(
            {UserNo: JuniorNo}, 
            {
                $push: {
                    Meeting: {
                        Start: Start,
                        End: End,
                        Senior_id: Senior_id
                    }
                }
            }, 
            function(err, senior){
                if(err) throw err;
                res.json({message: "예약 성공!"})
            }
        )
    })
})

module.exports = router;