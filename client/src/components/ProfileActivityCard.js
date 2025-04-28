"use client"
import { Link } from "react-router-dom"
import { useMutation } from "@apollo/client"
import { DELETE_ACTIVITY, REMOVE_SAVED_ACTIVITY } from "../utils/mutations"
import { GET_ME } from "../utils/queries"

const ProfileActivityCard = ({ activity, isOwner = false }) => {
  const [deleteActivity] = useMutation(DELETE_ACTIVITY, {
    refetchQueries: [{ query: GET_ME }],
  })

  const [removeActivity] = useMutation(REMOVE_SAVED_ACTIVITY, {
    refetchQueries: [{ query: GET_ME }],
  })

  const handleDeleteActivity = async () => {
    if (window.confirm("Are you sure you want to delete this activity? This action cannot be undone.")) {
      try {
        await deleteActivity({
          variables: { activityId: activity._id },
        })
      } catch (err) {
        console.error(err)
        alert("Failed to delete activity: " + err.message)
      }
    }
  }

  const handleUnsaveActivity = async () => {
    try {
      await removeActivity({
        variables: { activityId: activity._id },
      })
    } catch (err) {
      console.error(err)
      alert("Failed to unsave activity: " + err.message)
    }
  }

  return (
    <div className="border rounded-lg p-4 shadow-md hover:shadow-lg transition-shadow bg-white">
      <h3 className="text-xl font-semibold mb-2 text-gray-800">{activity.lessonName}</h3>
      <p className="text-gray-600 mb-2">Grade: {activity.gradeLevel.join(", ")}</p>
      <p className="text-gray-600 mb-2">Subject: {activity.subjects.join(", ")}</p>
      <p className="text-gray-600 mb-4">Duration: {activity.duration}</p>
      <p className="mb-4">{activity.description && activity.description.substring(0, 100)}...</p>
      <div className="flex flex-wrap gap-2 mb-4">
        {activity.tags &&
          activity.tags.map((tag, index) => (
            <span key={index} className="bg-pastel-yellow text-gray-800 px-2 py-1 rounded-full text-sm">
              {tag}
            </span>
          ))}
      </div>
      <div className="flex justify-between">
        <Link
          to={`/activity/${activity._id}`}
          className="bg-pastel-blue text-gray-800 px-4 py-2 rounded hover:bg-opacity-80"
        >
          View Details
        </Link>
        <div className="flex gap-2">
          {isOwner ? (
            <button
              onClick={handleDeleteActivity}
              className="bg-pastel-pink text-gray-800 px-4 py-2 rounded hover:bg-opacity-80"
              aria-label="Delete activity"
            >
              Delete
            </button>
          ) : (
            <button
              onClick={handleUnsaveActivity}
              className="bg-pastel-purple text-gray-800 px-4 py-2 rounded hover:bg-opacity-80"
              aria-label="Unsave activity"
            >
              Unsave
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

export default ProfileActivityCard
