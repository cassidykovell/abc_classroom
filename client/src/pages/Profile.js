import { useQuery } from "@apollo/client"
import { GET_ME } from "../utils/queries"
import ProfileActivityCard from "../components/ProfileActivityCard"
import { Navigate } from "react-router-dom"
import Auth from "../utils/auth"

const Profile = () => {
  const { loading, data } = useQuery(GET_ME)
  const user = data?.me || {}

  if (!Auth.loggedIn()) {
    return <Navigate to="/login" />
  }

  if (loading) {
    return <div className="text-center py-8">Loading...</div>
  }

  return (
    <div className="bg-pastel-gray bg-opacity-30 p-6 rounded-lg">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">My Profile</h1>
      <h2 className="text-2xl font-semibold mb-4 text-gray-800">Welcome, {user.username}!</h2>

      <div className="mb-8">
        <h3 className="text-xl font-semibold mb-4 text-gray-800 bg-pastel-pink inline-block px-4 py-1 rounded">
          My Activities
        </h3>
        {user.activities && user.activities.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {user.activities.map((activity) => (
              <ProfileActivityCard key={activity._id} activity={activity} isOwner={true} />
            ))}
          </div>
        ) : (
          <p className="bg-white p-4 rounded shadow">You haven't uploaded any activities yet.</p>
        )}
      </div>

      <div>
        <h3 className="text-xl font-semibold mb-4 text-gray-800 bg-pastel-green inline-block px-4 py-1 rounded">
          Saved Activities
        </h3>
        {user.savedActivities && user.savedActivities.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {user.savedActivities.map((activity) => (
              <ProfileActivityCard key={activity._id} activity={activity} isOwner={false} />
            ))}
          </div>
        ) : (
          <p className="bg-white p-4 rounded shadow">You haven't saved any activities yet.</p>
        )}
      </div>
    </div>
  )
}

export default Profile
