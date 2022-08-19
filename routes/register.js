const express = require("express");
const router = express.Router();

const Senior = require("../schema/senior");
const Junior = require("../schema/junior");

/* 회원가입 */
router.post("/", function (req, res, next) {
  const { userInfo } = req.body;
  let createUser;
  createUser = new Senior({
    ID: userInfo.ID,
    Name: userInfo.Name,
    Password: userInfo.Password,
    Status: userInfo.Status,
  });
  createUser.save(function (err, user){
    if (err) throw err;
    res.send(user);
  });
});

module.exports = router;
