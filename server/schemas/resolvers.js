const { AuthenticationError } = require("apollo-server-express")
const { User, Activity } = require("../models")
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
      const params = {}

      if (searchTerm) {
        params.$or = [
          { lessonName: { $regex: searchTerm, $options: "i" } },
          { tags: { $in: [new RegExp(searchTerm, "i")] } },
        ]
      }

      return Activity.find(params).sort({ createdAt: -1 })
    },
    activity: async (parent, { activityId }) => {
      return Activity.findOne({ _id: activityId })
    },
    userActivities: async (parent, { username }) => {
      const params = { username }
      return Activity.find(params).sort({ createdAt: -1 })
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
        )

        return updatedUser
      }
      throw new AuthenticationError("You need to be logged in!")
    },
  },
}

module.exports = resolvers
