"use client"

import { useState } from "react"
import { useMutation } from "@apollo/client"
import { ADD_QUESTION } from "../utils/mutations"
import { useNavigate, Navigate } from "react-router-dom"
import Auth from "../utils/auth"

const AskQuestion = () => {
  const navigate = useNavigate()
  const [formState, setFormState] = useState({
    title: "",
    content: "",
    tags: "",
  })

  const [addQuestion, { error }] = useMutation(ADD_QUESTION)

  if (!Auth.loggedIn()) {
    return <Navigate to="/login" />
  }

  const handleChange = (event) => {
    const { name, value } = event.target
    setFormState({
      ...formState,
      [name]: value,
    })
  }

  const handleFormSubmit = async (event) => {
    event.preventDefault()

    try {
      const { data } = await addQuestion({
        variables: {
          ...formState,
          tags: formState.tags ? formState.tags.split(",").map((tag) => tag.trim()) : [],
        },
      })

      navigate(`/discussions/${data.addQuestion._id}`)
    } catch (err) {
      console.error(err)
    }
  }

  return (
    <div className="max-w-2xl mx-auto mt-10 bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Ask a Question</h2>
      <form onSubmit={handleFormSubmit} className="space-y-6">
        <div>
          <label htmlFor="title" className="block mb-1 font-medium text-gray-700">
            Question Title
          </label>
          <input
            type="text"
            name="title"
            id="title"
            value={formState.title}
            onChange={handleChange}
            required
            className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-pastel-purple"
            placeholder="e.g., How do I teach fractions to 3rd graders?"
          />
        </div>

        <div>
          <label htmlFor="content" className="block mb-1 font-medium text-gray-700">
            Question Details
          </label>
          <textarea
            name="content"
            id="content"
            value={formState.content}
            onChange={handleChange}
            required
            rows="8"
            className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-pastel-purple"
            placeholder="Provide as much detail as possible to help others understand your question..."
          ></textarea>
        </div>

        <div>
          <label htmlFor="tags" className="block mb-1 font-medium text-gray-700">
            Tags (comma separated)
          </label>
          <input
            type="text"
            name="tags"
            id="tags"
            value={formState.tags}
            onChange={handleChange}
            className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-pastel-purple"
            placeholder="e.g., math, fractions, elementary"
          />
        </div>

        {error && <div className="text-red-500">{error.message}</div>}

        <button type="submit" className="w-full bg-pastel-blue text-gray-800 py-2 rounded hover:bg-opacity-80">
          Post Question
        </button>
      </form>
    </div>
  )
}

export default AskQuestion
