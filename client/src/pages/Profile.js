import { useQuery } from "@apollo/client"
import { GET_ME } from "../utils/queries"
import ActivityCard from "../components/ActivityCard"
import { Navigate } from "react-router-dom"
import Auth from "../utils/auth"

const Profile = () => {
  const { loading, data } = useQuery(GET_ME)
  const user = data?.me || {}

  // If not logged in, redirect to login page
  if (!Auth.loggedIn()) {
    return <Navigate to="/login" />
  }

  if (loading) {
    return <div>Loading...</div>
  }

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">My Profile</h1>
      <h2 className="text-2xl font-semibold mb-4">Welcome, {user.username}!</h2>

      <div className="mb-8">
        <h3 className="text-xl font-semibold mb-4">My Activities</h3>
        {user.activities && user.activities.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {user.activities.map((activity) => (
              <ActivityCard key={activity._id} activity={activity} />
            ))}
          </div>
        ) : (
          <p>You haven't uploaded any activities yet.</p>
        )}
      </div>

      <div>
        <h3 className="text-xl font-semibold mb-4">Saved Activities</h3>
        {user.savedActivities && user.savedActivities.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {user.savedActivities.map((activity) => (
              <ActivityCard key={activity._id} activity={activity} />
            ))}
          </div>
        ) : (
          <p>You haven't saved any activities yet.</p>
        )}
      </div>
    </div>
  )
}

export default Profile
