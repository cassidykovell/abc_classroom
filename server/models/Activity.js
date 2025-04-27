const { Schema, model } = require("mongoose")
const dateFormat = require("../utils/dateFormat")

const activitySchema = new Schema({
  lessonName: {
    type: String,
    required: true,
    trim: true,
  },
  subjects: {
    type: [String],
    required: true,
  },
  gradeLevel: {
    type: [String],
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  objectives: {
    type: String,
    required: true,
  },
  materialsNeeded: {
    type: String,
  },
  duration: {
    type: String,
    required: true,
  },
  instructions: {
    type: String,
    required: true,
  },
  files: [
    {
      name: {
        type: String,
      },
      url: {
        type: String,
      },
    },
  ],
  tags: [String],
  username: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
    get: (timestamp) => dateFormat(timestamp),
  },
})

// Create a text index for searching
activitySchema.index({
  lessonName: "text",
  tags: "text",
  description: "text",
})

const Activity = model("Activity", activitySchema)

module.exports = Activity
