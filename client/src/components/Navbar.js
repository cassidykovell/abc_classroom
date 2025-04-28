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
    <nav className="bg-pastel-blue p-4 shadow-md">
      <div className="container mx-auto flex justify-between items-center">
        <Link to="/" className="text-gray-800 text-xl font-bold">
         ABC Classroom
        </Link>
        <div className="flex space-x-4">
          <Link to="/discussions" className="text-gray-800 hover:text-pastel-darkPurple">
            Discussions
          </Link>
          {Auth.loggedIn() ? (
            <>
              <span className="text-gray-800">Welcome, {userData.username || "Teacher"}!</span>
              <Link to="/profile" className="text-gray-800 hover:text-pastel-darkPurple">
                Profile
              </Link>
              <Link to="/upload" className="text-gray-800 hover:text-pastel-darkPurple">
                Upload Activity
              </Link>
              <button onClick={logout} className="text-gray-800 hover:text-pastel-darkPurple">
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="text-gray-800 hover:text-pastel-darkPurple">
                Login
              </Link>
              <Link to="/signup" className="text-gray-800 hover:text-pastel-darkPurple">
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
