const { Schema, model } = require("mongoose")
const dateFormat = require("../utils/dateFormat")

const answerSchema = new Schema(
  {
    content: {
      type: String,
      required: true,
    },
    username: {
      type: String,
      required: true,
    },
    questionId: {
      type: Schema.Types.ObjectId,
      ref: "Question",
      required: true,
    },
    createdAt: {
      type: Date,
      default: Date.now,
      get: (timestamp) => dateFormat(timestamp),
    },
    isAccepted: {
      type: Boolean,
      default: false,
    },
  },
  {
    toJSON: {
      getters: true,
    },
  },
)

const Answer = model("Answer", answerSchema)

module.exports = Answer
