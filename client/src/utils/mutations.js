import { gql } from "@apollo/client"

export const LOGIN_USER = gql`
  mutation login($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      token
      user {
        _id
        username
      }
    }
  }
`

export const ADD_USER = gql`
  mutation addUser($username: String!, $email: String!, $password: String!) {
    addUser(username: $username, email: $email, password: $password) {
      token
      user {
        _id
        username
      }
    }
  }
`

export const ADD_ACTIVITY = gql`
  mutation addActivity(
    $lessonName: String!
    $subjects: [String]!
    $gradeLevel: [String]!
    $description: String!
    $objectives: String!
    $materialsNeeded: String
    $duration: String!
    $instructions: String!
    $tags: [String]!
  ) {
    addActivity(
      lessonName: $lessonName
      subjects: $subjects
      gradeLevel: $gradeLevel
      description: $description
      objectives: $objectives
      materialsNeeded: $materialsNeeded
      duration: $duration
      instructions: $instructions
      tags: $tags
    ) {
      _id
      lessonName
      subjects
      gradeLevel
      description
      objectives
      materialsNeeded
      duration
      instructions
      tags
      username
      createdAt
    }
  }
`

export const SAVE_ACTIVITY = gql`
  mutation saveActivity($activityId: ID!) {
    saveActivity(activityId: $activityId) {
      _id
      username
      savedActivities {
        _id
        lessonName
      }
    }
  }
`

export const REMOVE_SAVED_ACTIVITY = gql`
  mutation removeActivity($activityId: ID!) {
    removeActivity(activityId: $activityId) {
      _id
      username
      savedActivities {
        _id
        lessonName
      }
    }
  }
`

export const DELETE_ACTIVITY = gql`
  mutation deleteActivity($activityId: ID!) {
    deleteActivity(activityId: $activityId) {
      _id
    }
  }
`
