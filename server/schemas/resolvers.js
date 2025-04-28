const { AuthenticationError } = require("apollo-server-express")
const { User, Activity, Question, Answer } = require("../models")
const { signToken } = require("../utils/auth")

const resolvers = {
  Query: {
    me: async (parent, args, context) => {
      if (context.user) {
        const userData = await User.findOne({ _id: context.user._id })
          .select("-__v -password")
          .populate("activities")
          .populate("savedActivities")

        return userData
      }
      throw new AuthenticationError("Not logged in")
    },
    users: async () => {
      return User.find().select("-__v -password").populate("activities").populate("savedActivities")
    },
    user: async (parent, { username }) => {
      return User.findOne({ username }).select("-__v -password").populate("activities").populate("savedActivities")
    },
    activities: async (parent, { searchTerm }) => {
      console.log("Fetching activities with searchTerm:", searchTerm)

      const params = {}

      if (searchTerm) {
        params.$or = [
          { lessonName: { $regex: searchTerm, $options: "i" } },
          { tags: { $in: [new RegExp(searchTerm, "i")] } },
        ]
      }

      const activities = await Activity.find(params).sort({ createdAt: -1 })
      console.log(`Found ${activities.length} activities`)
      return activities
    },
    activity: async (parent, { activityId }) => {
      return Activity.findOne({ _id: activityId })
    },
    userActivities: async (parent, { username }) => {
      const params = { username }
      return Activity.find(params).sort({ createdAt: -1 })
    },
    questions: async (parent, { searchTerm }) => {
      const params = {}

      if (searchTerm) {
        params.$or = [
          { title: { $regex: searchTerm, $options: "i" } },
          { content: { $regex: searchTerm, $options: "i" } },
          { tags: { $in: [new RegExp(searchTerm, "i")] } },
        ]
      }

      return Question.find(params)
        .sort({ createdAt: -1 })
        .populate({
          path: "answers",
          options: { sort: { isAccepted: -1, createdAt: -1 } },
        })
    },
    question: async (parent, { questionId }) => {
      return Question.findOne({ _id: questionId }).populate({
        path: "answers",
        options: { sort: { isAccepted: -1, createdAt: -1 } },
      })
    },
  },

  Mutation: {
    addUser: async (parent, args) => {
      const user = await User.create(args)
      const token = signToken(user)
      return { token, user }
    },
    login: async (parent, { email, password }) => {
      const user = await User.findOne({ email })

      if (!user) {
        throw new AuthenticationError("Incorrect credentials")
      }

      const correctPw = await user.isCorrectPassword(password)

      if (!correctPw) {
        throw new AuthenticationError("Incorrect credentials")
      }

      const token = signToken(user)
      return { token, user }
    },
    addActivity: async (parent, args, context) => {
      if (context.user) {
        const activity = await Activity.create({
          ...args,
          username: context.user.username,
        })

        await User.findByIdAndUpdate({ _id: context.user._id }, { $push: { activities: activity._id } }, { new: true })

        return activity
      }
      throw new AuthenticationError("You need to be logged in!")
    },
    saveActivity: async (parent, { activityId }, context) => {
      if (context.user) {
        const updatedUser = await User.findOneAndUpdate(
          { _id: context.user._id },
          { $addToSet: { savedActivities: activityId } },
          { new: true },
        ).populate("savedActivities")

        return updatedUser
      }
      throw new AuthenticationError("You need to be logged in!")
    },
    removeActivity: async (parent, { activityId }, context) => {
      if (context.user) {
        const updatedUser = await User.findOneAndUpdate(
          { _id: context.user._id },
          { $pull: { savedActivities: activityId } },
          { new: true },
        ).populate("savedActivities")

        return updatedUser
      }
      throw new AuthenticationError("You need to be logged in!")
    },
    deleteActivity: async (parent, { activityId }, context) => {
      if (context.user) {
        // Find the activity to check ownership
        const activity = await Activity.findById(activityId)

        if (!activity) {
          throw new Error("Activity not found")
        }

        // Check if the current user is the owner of the activity
        if (activity.username !== context.user.username) {
          throw new AuthenticationError("You can only delete activities you've created")
        }

        // Delete the activity
        const deletedActivity = await Activity.findByIdAndDelete(activityId)

        // Remove the activity from the user's activities array
        await User.updateMany(
          {},
          {
            $pull: {
              activities: activityId,
              savedActivities: activityId,
            },
          },
        )

        return deletedActivity
      }
      throw new AuthenticationError("You need to be logged in!")
    },
    addQuestion: async (parent, { title, content, tags }, context) => {
      if (context.user) {
        const question = await Question.create({
          title,
          content,
          tags: tags || [],
          username: context.user.username,
        })

        return question
      }
      throw new AuthenticationError("You need to be logged in to ask a question!")
    },
    addAnswer: async (parent, { questionId, content }, context) => {
      if (context.user) {
        const answer = await Answer.create({
          content,
          username: context.user.username,
          questionId,
        })

        await Question.findByIdAndUpdate(questionId, { $push: { answers: answer._id } }, { new: true })

        return answer
      }
      throw new AuthenticationError("You need to be logged in to answer a question!")
    },
    acceptAnswer: async (parent, { answerId }, context) => {
      if (context.user) {
        const answer = await Answer.findById(answerId)

        if (!answer) {
          throw new Error("Answer not found")
        }

        const question = await Question.findById(answer.questionId)

        if (!question) {
          throw new Error("Question not found")
        }

        // Only the question author can accept an answer
        if (question.username !== context.user.username) {
          throw new AuthenticationError("Only the question author can accept an answer")
        }

        // Reset all answers for this question to not accepted
        await Answer.updateMany({ questionId: answer.questionId }, { isAccepted: false })

        // Set this answer as accepted
        const updatedAnswer = await Answer.findByIdAndUpdate(answerId, { isAccepted: true }, { new: true })

        return updatedAnswer
      }
      throw new AuthenticationError("You need to be logged in!")
    },
    deleteQuestion: async (parent, { questionId }, context) => {
      if (context.user) {
        const question = await Question.findById(questionId)

        if (!question) {
          throw new Error("Question not found")
        }

        // Check if the current user is the owner of the question
        if (question.username !== context.user.username) {
          throw new AuthenticationError("You can only delete questions you've created")
        }

        // Delete all answers associated with this question
        await Answer.deleteMany({ questionId })

        // Delete the question
        await Question.findByIdAndDelete(questionId)

        return question
      }
      throw new AuthenticationError("You need to be logged in!")
    },
    deleteAnswer: async (parent, { answerId }, context) => {
      if (context.user) {
        const answer = await Answer.findById(answerId)

        if (!answer) {
          throw new Error("Answer not found")
        }

        // Check if the current user is the owner of the answer
        if (answer.username !== context.user.username) {
          throw new AuthenticationError("You can only delete answers you've created")
        }

        // Remove the answer from the question's answers array
        await Question.findByIdAndUpdate(answer.questionId, { $pull: { answers: answerId } })

        // Delete the answer
        await Answer.findByIdAndDelete(answerId)

        return answer
      }
      throw new AuthenticationError("You need to be logged in!")
    },
  },
}

module.exports = resolvers
