"use client"

import { useState } from "react"
import { useMutation } from "@apollo/client"
import { LOGIN_USER } from "../utils/mutations"
import Auth from "../utils/auth"
import { Link, useNavigate } from "react-router-dom"

const Login = () => {
  const navigate = useNavigate()
  const [formState, setFormState] = useState({ email: "", password: "" })
  const [login, { error }] = useMutation(LOGIN_USER)

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
      const { data } = await login({
        variables: { ...formState },
      })
      Auth.login(data.login.token)
      navigate("/")
    } catch (e) {
      console.error(e)
    }
  }

  return (
    <div className="max-w-md mx-auto mt-10">
      <h2 className="text-2xl font-bold mb-6">Login</h2>
      <form onSubmit={handleFormSubmit} className="space-y-4">
        <div>
          <label htmlFor="email" className="block mb-1">
            Email
          </label>
          <input
            type="email"
            name="email"
            id="email"
            value={formState.email}
            onChange={handleChange}
            required
            className="w-full p-2 border rounded"
          />
        </div>
        <div>
          <label htmlFor="password" className="block mb-1">
            Password
          </label>
          <input
            type="password"
            name="password"
            id="password"
            value={formState.password}
            onChange={handleChange}
            required
            className="w-full p-2 border rounded"
          />
        </div>
        {error && <div className="text-red-500">{error.message}</div>}
        <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700">
          Login
        </button>
      </form>
      <p className="mt-4 text-center">
        Don't have an account?{" "}
        <Link to="/signup" className="text-blue-600 hover:underline">
          Sign up
        </Link>
      </p>
    </div>
  )
}

export default Login
