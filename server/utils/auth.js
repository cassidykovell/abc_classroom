const jwt = require("jsonwebtoken")
require("dotenv").config()

// Use environment variables for token secret and expiration
const secret = process.env.JWT_SECRET || "mysecretsshhhhh"
const expiration = process.env.EXPIRATION || "2h"

module.exports = {
  // Function for our authenticated routes
  authMiddleware: ({ req }) => {
    // Allows token to be sent via req.body, req.query, or headers
    let token = req.body.token || req.query.token || req.headers.authorization

    // ["Bearer", "<tokenvalue>"]
    if (req.headers.authorization) {
      token = token.split(" ").pop().trim()
    }

    if (!token) {
      return req
    }

    // Verify token and get user data out of it
    try {
      const { data } = jwt.verify(token, secret, { maxAge: expiration })
      req.user = data
    } catch {
      console.log("Invalid token")
    }

    return req
  },
  signToken: ({ username, email, _id }) => {
    const payload = { username, email, _id }
    return jwt.sign({ data: payload }, secret, { expiresIn: expiration })
  },
}
