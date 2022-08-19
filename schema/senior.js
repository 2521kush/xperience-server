const mongoose = require("mongoose");
var autoIncrement = require("mongoose-auto-increment");
autoIncrement.initialize(mongoose.connection);

const seniorSchema = new mongoose.Schema(
  {
    UserNo: Number,
    ID: String,
    Name: String,
    Password: String,
    Status: Number, //1: Senior, 2: Junior  
    Profile: {
        _id: false,
        Company: [String],
        Introduction: String,
        Certification: String,  //경력증명서
        AssignedWork: String, // 담당 업무
        Category: Number,   //직군
        Hashtag: [String],
        Career: [{
            _id: false,
            Title: String,
            Content: String,
            Date: String
        }]
    }
  },
  { versionKey: false, timestamps: true }
);

 /* autoincrement를 위해 설정 */
seniorSchema.plugin(autoIncrement.plugin, {
  model: "Senior",
  field: "UserNo", //collection 중 postNum 필드를 기준
  startAt: 10001, //1부터 시작
  increment: 1, // 1씩 증가
});

module.exports = mongoose.model("Senior", seniorSchema, "User");