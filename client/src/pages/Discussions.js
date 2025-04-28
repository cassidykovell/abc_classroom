"use client"

import { useState } from "react"
import { useQuery } from "@apollo/client"
import { QUERY_QUESTIONS } from "../utils/queries"
import QuestionCard from "../components/QuestionCard"
import { Link } from "react-router-dom"
import Auth from "../utils/auth"

const Discussions = () => {
  const [searchTerm, setSearchTerm] = useState("")
  const { loading, error, data } = useQuery(QUERY_QUESTIONS, {
    variables: { searchTerm },
    fetchPolicy: "network-only",
  })

  const questions = data?.questions || []

  const handleSearch = (e) => {
    e.preventDefault()
  }

  return (
    <div className="bg-pastel-gray bg-opacity-30 p-6 rounded-lg">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Teacher Discussions</h1>
        {Auth.loggedIn() ? (
          <Link to="/discussions/ask" className="bg-pastel-purple text-gray-800 px-4 py-2 rounded hover:bg-opacity-80">
            Ask a Question
          </Link>
        ) : (
          <Link to="/login" className="text-pastel-darkPurple hover:underline">
            Login to ask a question
          </Link>
        )}
      </div>

      <form onSubmit={handleSearch} className="mb-8">
        <div className="flex">
          <input
            type="text"
            placeholder="Search discussions..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-grow p-2 border rounded-l focus:outline-none focus:ring-2 focus:ring-pastel-purple"
          />
          <button type="submit" className="bg-pastel-purple text-gray-800 px-4 py-2 rounded-r hover:bg-opacity-80">
            Search
          </button>
        </div>
      </form>

      {loading ? (
        <p className="text-center py-8">Loading discussions...</p>
      ) : error ? (
        <div className="text-center py-8 text-red-600">
          <p>Error loading discussions: {error.message}</p>
        </div>
      ) : questions.length === 0 ? (
        <div className="text-center py-8 bg-white p-4 rounded shadow">
          <p>No discussions found.</p>
          <p className="mt-2">{searchTerm ? "Try a different search term." : "Be the first to start a discussion!"}</p>
        </div>
      ) : (
        <div>
          {questions.map((question) => (
            <QuestionCard key={question._id} question={question} />
          ))}
        </div>
      )}
    </div>
  )
}

export default Discussions
