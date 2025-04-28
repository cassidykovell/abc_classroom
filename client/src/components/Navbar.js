"use client"
import { Link, useNavigate } from "react-router-dom"
import { useQuery } from "@apollo/client"
import { GET_ME } from "../utils/queries"
import Auth from "../utils/auth"

const Navbar = () => {
  const navigate = useNavigate()
  const { data } = useQuery(GET_ME)
  // We'll use the user data in the JSX below
  const userData = data?.me || {}

  const logout = (event) => {
    event.preventDefault()
    Auth.logout()
    navigate("/")
  }

  return (
    <nav className="bg-blue-600 p-4">
      <div className="container mx-auto flex justify-between items-center">
        <Link to="/" className="text-white text-xl font-bold">
          ABC Classroom
        </Link>
        <div className="flex space-x-4">
          {Auth.loggedIn() ? (
            <>
              <span className="text-white">Welcome, {userData.username || "Teacher"}!</span>
              <Link to="/profile" className="text-white hover:text-blue-200">
                Profile
              </Link>
              <Link to="/upload" className="text-white hover:text-blue-200">
                Upload Activity
              </Link>
              <button onClick={logout} className="text-white hover:text-blue-200">
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="text-white hover:text-blue-200">
                Login
              </Link>
              <Link to="/signup" className="text-white hover:text-blue-200">
                Signup
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  )
}

export default Navbar
