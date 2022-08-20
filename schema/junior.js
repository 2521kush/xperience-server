const mongoose = require("mongoose");
var autoIncrement = require("mongoose-auto-increment");
autoIncrement.initialize(mongoose.connection);

const juniorSchema = new mongoose.Schema(
  {
    UserNo: Number,
    ID: String,
    Name: String,
    Password: String,
    Status: Number,
    Flag: Number,  
    Company: [Number],
    Category: Number,   //직군  
    Feedback: [{
      _id:false,
      Score: Number,
      Comment: String
    }],
    Profile: {
      Title: String,
      Content: String,
      WorkTag: [Number], //1: 실무노하우, 2: 회사생활, 3: 부서별 업무, 4: 요구 능력  
      CharacterTag: [Number],  //1:상냥한, 2:냉철한, 3:따뜻한, 4:차가운
    },
    Meeting: [{
      _id:false,
      Start: String,
      End: String,
      Senior_id: { type: mongoose.Schema.Types.ObjectId, ref: "Senior" },
    }]
  },
  { versionKey: false, timestamps: true }
);

 /* autoincrement를 위해 설정 */
juniorSchema.plugin(autoIncrement.plugin, {
  model: "Junior",
  field: "UserNo", //collection 중 postNum 필드를 기준
  startAt: 10001, //1부터 시작
  increment: 1, // 1씩 증가
});

module.exports = mongoose.model("Junior", juniorSchema, "User");