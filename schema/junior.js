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
    Wish: {
        Company: [String],
        Category: Number,   //직군
        Hashtag: [String]
    }
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