const express = require("express")
const { ApolloServer } = require("apollo-server-express")
const path = require("path")
require("dotenv").config()
const { authMiddleware } = require("./utils/auth")
const { typeDefs, resolvers } = require("./schemas")
const db = require("./config/connection")

const PORT = process.env.PORT || 3001
const app = express()


const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: authMiddleware,
  formatError: (err) => {
    console.error(err)
    return err
  },
})

const startApolloServer = async () => {
  await server.start()
  server.applyMiddleware({ app })

  app.use(express.urlencoded({ extended: false }))
  app.use(express.json())

  if (process.env.NODE_ENV === "production") {
    app.use(express.static(path.join(__dirname, "../client/build")))
  }

  app.get("/api/debug/activities", async (req, res) => {
    try {
      const { Activity } = require("./models")
      const activities = await Activity.find({})
      res.json({
        count: activities.length,
        activities: activities.map((a) => ({
          _id: a._id,
          lessonName: a.lessonName,
          username: a.username,
        })),
      })
    } catch (err) {
      res.status(500).json({ error: err.message })
    }
  })

  app.get("/api/debug/users", async (req, res) => {
    try {
      const { User } = require("./models")
      const users = await User.find({})
      res.json({
        count: users.length,
        users: users.map((u) => ({
          _id: u._id,
          username: u.username,
          email: u.email,
          activitiesCount: u.activities.length,
          savedActivitiesCount: u.savedActivities.length,
        })),
      })
    } catch (err) {
      res.status(500).json({ error: err.message })
    }
  })

  app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "../client/build/index.html"))
  })

  db.once("open", () => {
    try {
      app.listen(PORT, () => {
        console.log(`API server running on port ${PORT}!`)
        console.log(`Use GraphQL at http://localhost:${PORT}${server.graphqlPath}`)
      })
    } catch (err) {
      if (err.code === "EADDRINUSE") {
        console.error(
          `Port ${PORT} is already in use. Try using a different port by setting the PORT environment variable.`,
        )
        process.exit(1)
      } else {
        console.error("Server error:", err)
        process.exit(1)
      }
    }
  })
}

startApolloServer().catch((err) => {
  console.error("Failed to start server:", err)
  process.exit(1)
})
