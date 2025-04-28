"use client"
import { Link } from "react-router-dom"
import { useMutation } from "@apollo/client"
import { SAVE_ACTIVITY } from "../utils/mutations"
import Auth from "../utils/auth"

const ActivityCard = ({ activity }) => {
  const [saveActivity] = useMutation(SAVE_ACTIVITY)

  const handleSaveActivity = async () => {
    try {
      await saveActivity({
        variables: { activityId: activity._id },
      })
      alert("Activity saved!")
    } catch (err) {
      console.error(err)
    }
  }

  return (
    <div className="border rounded-lg p-4 shadow-md hover:shadow-lg transition-shadow bg-white">
      <h3 className="text-xl font-semibold mb-2 text-gray-800">{activity.lessonName}</h3>
      <p className="text-gray-600 mb-2">Grade: {activity.gradeLevel.join(", ")}</p>
      <p className="text-gray-600 mb-2">Subject: {activity.subjects.join(", ")}</p>
      <p className="text-gray-600 mb-4">Duration: {activity.duration}</p>
      <p className="mb-4">{activity.description.substring(0, 100)}...</p>
      <div className="flex flex-wrap gap-2 mb-4">
        {activity.tags.map((tag, index) => (
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
        {Auth.loggedIn() && (
          <button
            onClick={handleSaveActivity}
            className="bg-pastel-green text-gray-800 px-4 py-2 rounded hover:bg-opacity-80"
          >
            Save
          </button>
        )}
      </div>
    </div>
  )
}

export default ActivityCard
