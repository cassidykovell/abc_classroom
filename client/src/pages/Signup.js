"use client"

import { useState } from "react"
import { useMutation } from "@apollo/client"
import { ADD_USER } from "../utils/mutations"
import Auth from "../utils/auth"
import { Link, useNavigate } from "react-router-dom"

const Signup = () => {
  const navigate = useNavigate()
  const [formState, setFormState] = useState({
    username: "",
    email: "",
    password: "",
  })
  const [addUser, { error }] = useMutation(ADD_USER)

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
      const { data } = await addUser({
        variables: { ...formState },
      })
      Auth.login(data.addUser.token)
      navigate("/")
    } catch (e) {
      console.error(e)
    }
  }

  return (
    <div className="max-w-md mx-auto mt-10 bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Sign Up</h2>
      <form onSubmit={handleFormSubmit} className="space-y-4">
        <div>
          <label htmlFor="username" className="block mb-1 text-gray-700">
            Username
          </label>
          <input
            type="text"
            name="username"
            id="username"
            value={formState.username}
            onChange={handleChange}
            required
            className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-pastel-purple"
          />
        </div>
        <div>
          <label htmlFor="email" className="block mb-1 text-gray-700">
            Email
          </label>
          <input
            type="email"
            name="email"
            id="email"
            value={formState.email}
            onChange={handleChange}
            required
            className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-pastel-purple"
          />
        </div>
        <div>
          <label htmlFor="password" className="block mb-1 text-gray-700">
            Password
          </label>
          <input
            type="password"
            name="password"
            id="password"
            value={formState.password}
            onChange={handleChange}
            required
            className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-pastel-purple"
          />
        </div>
        {error && <div className="text-red-500">{error.message}</div>}
        <button type="submit" className="w-full bg-pastel-blue text-gray-800 py-2 rounded hover:bg-opacity-80">
          Sign Up
        </button>
      </form>
      <p className="mt-4 text-center text-gray-700">
        Already have an account?{" "}
        <Link to="/login" className="text-pastel-purple hover:underline">
          Login
        </Link>
      </p>
    </div>
  )
}

export default Signup
