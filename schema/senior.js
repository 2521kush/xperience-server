const mongoose = require("mongoose");
var autoIncrement = require("mongoose-auto-increment");
autoIncrement.initialize(mongoose.connection);

const seniorSchema = new mongoose.Schema(
  {
    Image: String,
    UserNo: Number,
    ID: String,
    Name: String,
    Password: String,
    Flag: Number,  
    Status: Number, //1: Senior, 2: Junior  
    Company: [Number],  //회사
    Category: Number, //직군
    Feedback: [{
      _id:false,
      Score: Number,
      Comment: String
    }],
    ConnectCnt: Number,
    AbleTime: {
      Weekdays: [Number], //0,1
      Time: [Number] // length 4
    },
    Meeting: [{
      _id:false,
      Start: String,
      End: String,
      Junior_id: { type: mongoose.Schema.Types.ObjectId, ref: "Junior" },
    }],
    Profile: {
        _id: false, 
        Title: String,
        WorkPeriod: Number,
        Introduction: String,
        Certification: String,  //경력증명서
        AssignedWork: String, // 담당 업무
        WorkTag: [Number], //1: 실무노하우, 2: 회사생활, 3: 부서별 업무, 4: 요구 능력  
        CharacterTag: [Number],  //1:상냥한, 2:냉철한, 3:따뜻한, 4:차가운
        Career: [{
            _id: false,
            Title: String,
            Content: String,
            Date: String
        }],
        Answer: [String]
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