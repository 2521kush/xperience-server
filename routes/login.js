const express = require("express");
const router = express.Router();

const Student = require("../schema/student");

/* 로그인 */
router.post("/", function (req, res) {
  Student.findOne({ Email: req.body.Email, Login: 1 }, function (err, userInfo) {
    if (err) return res.status(400).send(err);
    if (!userInfo) {
      return res.json({ Status: 2, Message: '이메일 또는 비밀번호를 확인해 주세요.' });
    }
    userInfo.comparePassword(req.body.Password, function (err, isMatch) {  // comparePassword는 Student모델 파일에서 직접 만든 임의의 함수로, 에러와 결과값(isMatch)을 반환받음.
      if (err) return res.status(400).send(err);
      if (!isMatch) {
        return res.json({ Status: 2, Message: '이메일 또는 비밀번호를 확인해 주세요.' });
      }
      const genLoginKey = String(userInfo._id) + String(Date.now());
      const loginInfo = new LoginKey({
        LoginKey: genLoginKey,
        User_id: userInfo._id,
      });
      loginInfo.save();
      res.send({ 
        Status: 1, 
        LoginKey: genLoginKey,
        Name: userInfo.Name,
        UserNo: userInfo.UserNo
      });
    });
  });
});

module.exports = router;
