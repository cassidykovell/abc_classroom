"use client"

import { useState } from "react"
import { useParams, Link, useNavigate } from "react-router-dom"
import { useQuery, useMutation } from "@apollo/client"
import { QUERY_QUESTION } from "../utils/queries"
import { ADD_ANSWER, DELETE_QUESTION } from "../utils/mutations"
import AnswerCard from "../components/AnswerCard"
import Auth from "../utils/auth"

const QuestionDetail = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [answerContent, setAnswerContent] = useState("")
  const { loading, error, data } = useQuery(QUERY_QUESTION, {
    variables: { questionId: id },
  })

  const [addAnswer] = useMutation(ADD_ANSWER, {
    refetchQueries: [{ query: QUERY_QUESTION, variables: { questionId: id } }],
  })

  const [deleteQuestion] = useMutation(DELETE_QUESTION)

  const question = data?.question || {}
  const answers = question.answers || []

  const isQuestionAuthor = Auth.loggedIn() && Auth.getProfile().data.username === question.username

  const handleAddAnswer = async (e) => {
    e.preventDefault()

    try {
      await addAnswer({
        variables: { questionId: id, content: answerContent },
      })
      setAnswerContent("")
    } catch (err) {
      console.error(err)
    }
  }

  const handleDeleteQuestion = async () => {
    if (window.confirm("Are you sure you want to delete this question? This action cannot be undone.")) {
      try {
        await deleteQuestion({
          variables: { questionId: id },
        })
        navigate("/discussions")
      } catch (err) {
        console.error(err)
      }
    }
  }

  if (loading) return <p className="text-center py-8">Loading question...</p>
  if (error) return <p className="text-center py-8 text-red-600">Error loading question: {error.message}</p>

  return (
    <div className="max-w-4xl mx-auto mt-10">
      <div className="mb-6">
        <Link to="/discussions" className="text-pastel-purple hover:underline">
          &larr; Back to Discussions
        </Link>
      </div>

      <div className="bg-white shadow-md rounded-lg p-6 mb-6">
        <div className="flex justify-between items-start">
          <h1 className="text-3xl font-bold mb-4 text-gray-800">{question.title}</h1>
          {isQuestionAuthor && (
            <button
              onClick={handleDeleteQuestion}
              className="bg-pastel-pink text-gray-800 px-3 py-1 rounded hover:bg-opacity-80"
            >
              Delete Question
            </button>
          )}
        </div>
        <p className="text-gray-600 mb-4">
          Asked by {question.username} on {question.createdAt}
        </p>
        <p className="mb-6 whitespace-pre-wrap">{question.content}</p>
        <div className="flex flex-wrap gap-2">
          {question.tags &&
            question.tags.map((tag, index) => (
              <span key={index} className="bg-pastel-yellow text-gray-800 px-2 py-1 rounded-full text-sm">
                {tag}
              </span>
            ))}
        </div>
      </div>

      <h2 className="text-2xl font-semibold mb-4 text-gray-800">
        {answers.length} {answers.length === 1 ? "Answer" : "Answers"}
      </h2>

      {answers.map((answer) => (
        <AnswerCard key={answer._id} answer={answer} questionId={id} isQuestionAuthor={isQuestionAuthor} />
      ))}

      {Auth.loggedIn() ? (
        <div className="bg-white shadow-md rounded-lg p-6 mt-6">
          <h2 className="text-xl font-semibold mb-4 text-gray-800">Your Answer</h2>
          <form onSubmit={handleAddAnswer}>
            <textarea
              value={answerContent}
              onChange={(e) => setAnswerContent(e.target.value)}
              required
              rows="6"
              className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-pastel-purple mb-4"
              placeholder="Write your answer here..."
            ></textarea>
            <button type="submit" className="bg-pastel-blue text-gray-800 px-4 py-2 rounded hover:bg-opacity-80">
              Post Answer
            </button>
          </form>
        </div>
      ) : (
        <div className="bg-white shadow-md rounded-lg p-6 mt-6 text-center">
          <p className="mb-4">You need to be logged in to answer questions.</p>
          <Link to="/login" className="bg-pastel-blue text-gray-800 px-4 py-2 rounded hover:bg-opacity-80 inline-block">
            Login to Answer
          </Link>
        </div>
      )}
    </div>
  )
}

export default QuestionDetail
