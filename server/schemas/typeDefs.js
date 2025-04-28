const { gql } = require("apollo-server-express")

const typeDefs = gql`
  type User {
    _id: ID
    username: String
    email: String
    activities: [Activity]
    savedActivities: [Activity]
  }

  type Activity {
    _id: ID
    lessonName: String
    subjects: [String]
    gradeLevel: [String]
    description: String
    objectives: String
    materialsNeeded: String
    duration: String
    instructions: String
    files: [File]
    tags: [String]
    username: String
    createdAt: String
  }

  type File {
    name: String
    url: String
  }

  type Auth {
    token: ID!
    user: User
  }

  type Question {
    _id: ID
    title: String
    content: String
    username: String
    createdAt: String
    tags: [String]
    answers: [Answer]
    answerCount: Int
  }

  type Answer {
    _id: ID
    content: String
    username: String
    questionId: ID
    createdAt: String
    isAccepted: Boolean
  }

  type Query {
    me: User
    users: [User]
    user(username: String!): User
    activities(searchTerm: String): [Activity]
    activity(activityId: ID!): Activity
    userActivities(username: String!): [Activity]
    questions(searchTerm: String): [Question]
    question(questionId: ID!): Question
  }

  type Mutation {
    login(email: String!, password: String!): Auth
    addUser(username: String!, email: String!, password: String!): Auth
    addActivity(
      lessonName: String!
      subjects: [String]!
      gradeLevel: [String]!
      description: String!
      objectives: String!
      materialsNeeded: String
      duration: String!
      instructions: String!
      tags: [String]!
    ): Activity
    saveActivity(activityId: ID!): User
    removeActivity(activityId: ID!): User
    deleteActivity(activityId: ID!): Activity
    addQuestion(title: String!, content: String!, tags: [String]): Question
    addAnswer(questionId: ID!, content: String!): Answer
    acceptAnswer(answerId: ID!): Answer
    deleteQuestion(questionId: ID!): Question
    deleteAnswer(answerId: ID!): Answer
  }
`

module.exports = typeDefs
