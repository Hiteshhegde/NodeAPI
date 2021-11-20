const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const questionare = new Schema({
  question: { type: String, required: true },
  type: { type: String, default: "text" },
  choices: [{ type: String }],
  requirement: { type: Boolean, required: false, default: false },
});
const imageSchema = new Schema({
  formid: { type: String, required: false },
  desc: { type: String, required: false },
  image: { type: String, required: true },
});

const responseSchema = new Schema({
  uniqueFormId: { type: String, required: true },
  // answers: [[{ type: String }]],
  // answers: [
  //   {
  //     String,
  //     String,
  //   },
  // ],
  answers: { type: Array, default: [] },
});
const formSchema = new Schema({
  uniqueFormId: { type: String, required: true },
  formName: { type: String, required: true },
  questions: [questionare],
});

const contentSchema = new Schema({
  email: { type: String, required: true, unique: true },
  username: { type: String, required: true },
  responses: [responseSchema],
  imageHolder: [imageSchema],
  forms: [formSchema],
});

const userContentSchema = mongoose.model("User Content", contentSchema);

module.exports = userContentSchema;
