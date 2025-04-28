const mongoose = require("mongoose")
require("dotenv").config()

mongoose.set("strictQuery", false)

console.log("Attempting to connect to MongoDB...")

mongoose
  .connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB connection successful!"))
  .catch((err) => {
    console.error("MongoDB connection error:", err)
    console.log("Please check your connection string and make sure your IP address is whitelisted in MongoDB Atlas.")
  })

module.exports = mongoose.connection
