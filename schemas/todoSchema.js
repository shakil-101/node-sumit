const mongoose = require("mongoose");

const todoSchema = mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: String,
  status: {
    type: String,
    enum: ["active", "inactive"],
  },
  date: {
    type: Date,
    default: Date.now,
  },
});

// ===== custom instance methods ========

todoSchema.methods = {
  findActive: function () {
    return mongoose.model("Todo").find({ status: "active" });
  },
};

// ===== custom static methods ========
todoSchema.statics = {
  findByJs: function () {
    return this.find({ title: /js/i });
  },
};
// ===== custom query helper ========
todoSchema.query = {
  byLanguage: function (language) {
    return this.find({ title: new RegExp(language, "i") });
  },
};

// // instance methods
// todoSchema.methods = {
//   findActive: function () {
//     return mongoose.model("Todo").find({ status: "active" });
//   },
//   findActiveCallback: function (cb) {
//     return mongoose.model("Todo").find({ status: "active" }, cb);
//   },
// };

// // static methods
// todoSchema.statics = {
//   findByJS: function () {
//     return this.find({ title: /js/i });
//   },
// };

// // query helpers
// todoSchema.query = {
//   byLanguage: function (language) {
//     return this.find({ title: new RegExp(language, "i") }); // new RegExp()
//   },
// };

module.exports = todoSchema;
