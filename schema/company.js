const mongoose = require("mongoose");

const companySchema = new mongoose.Schema(
  {
    CompanyName: [String]
  }
);

module.exports = mongoose.model("Company", companySchema, "Company");