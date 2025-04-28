const { Schema, model } = require("mongoose")
const dateFormat = require("../utils/dateFormat")

const questionSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    content: {
      type: String,
      required: true,
    },
    username: {
      type: String,
      required: true,
    },
    createdAt: {
      type: Date,
      default: Date.now,
      get: (timestamp) => dateFormat(timestamp),
    },
    tags: [String],
    answers: [
      {
        type: Schema.Types.ObjectId,
        ref: "Answer",
      },
    ],
  },
  {
    toJSON: {
      virtuals: true,
      getters: true,
    },
  },
)

// Create a text index for searching
questionSchema.index({
  title: "text",
  content: "text",
  tags: "text",
})

// Virtual for answer count
questionSchema.virtual("answerCount").get(function () {
  return this.answers.length
})

const Question = model("Question", questionSchema)

module.exports = Question
