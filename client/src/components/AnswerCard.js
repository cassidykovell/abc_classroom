"use client"

import { useMutation } from "@apollo/client"
import { ACCEPT_ANSWER, DELETE_ANSWER } from "../utils/mutations"
import { QUERY_QUESTION } from "../utils/queries"
import Auth from "../utils/auth"

const AnswerCard = ({ answer, questionId, isQuestionAuthor }) => {
  const [acceptAnswer] = useMutation(ACCEPT_ANSWER, {
    refetchQueries: [{ query: QUERY_QUESTION, variables: { questionId } }],
  })

  const [deleteAnswer] = useMutation(DELETE_ANSWER, {
    refetchQueries: [{ query: QUERY_QUESTION, variables: { questionId } }],
  })

  const handleAcceptAnswer = async () => {
    try {
      await acceptAnswer({
        variables: { answerId: answer._id },
      })
    } catch (err) {
      console.error(err)
    }
  }

  const handleDeleteAnswer = async () => {
    if (window.confirm("Are you sure you want to delete this answer?")) {
      try {
        await deleteAnswer({
          variables: { answerId: answer._id },
        })
      } catch (err) {
        console.error(err)
      }
    }
  }

  const isCurrentUserAuthor = Auth.loggedIn() && Auth.getProfile().data.username === answer.username

  return (
    <div
      className={`border rounded-lg p-4 shadow-md mb-4 ${
        answer.isAccepted ? "bg-pastel-green bg-opacity-20" : "bg-white"
      }`}
    >
      {answer.isAccepted && (
        <div className="mb-2 text-pastel-green font-semibold flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
            <path
              fillRule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
              clipRule="evenodd"
            />
          </svg>
          Accepted Answer
        </div>
      )}
      <p className="mb-4">{answer.content}</p>
      <div className="flex justify-between items-center">
        <p className="text-gray-600">
          Answered by {answer.username} on {answer.createdAt}
        </p>
        <div className="flex gap-2">
          {isQuestionAuthor && !answer.isAccepted && (
            <button
              onClick={handleAcceptAnswer}
              className="bg-pastel-green text-gray-800 px-3 py-1 rounded hover:bg-opacity-80 text-sm"
            >
              Accept
            </button>
          )}
          {isCurrentUserAuthor && (
            <button
              onClick={handleDeleteAnswer}
              className="bg-pastel-pink text-gray-800 px-3 py-1 rounded hover:bg-opacity-80 text-sm"
            >
              Delete
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

export default AnswerCard
