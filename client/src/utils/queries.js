import { gql } from "@apollo/client"

export const QUERY_ACTIVITIES = gql`
  query getActivities($searchTerm: String) {
    activities(searchTerm: $searchTerm) {
      _id
      lessonName
      subjects
      gradeLevel
      description
      duration
      username
      tags
    }
  }
`

export const QUERY_ACTIVITY = gql`
  query getActivity($activityId: ID!) {
    activity(activityId: $activityId) {
      _id
      lessonName
      subjects
      gradeLevel
      description
      objectives
      materialsNeeded
      duration
      instructions
      files {
        name
        url
      }
      tags
      username
      createdAt
    }
  }
`

export const GET_ME = gql`
  query me {
    me {
      _id
      username
      email
      activities {
        _id
        lessonName
        subjects
        gradeLevel
        description
        duration
        tags
      }
      savedActivities {
        _id
        lessonName
        subjects
        gradeLevel
        description
        duration
        tags
      }
    }
  }
`
