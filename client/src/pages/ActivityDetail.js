"use client"
import { useParams, Link, useNavigate } from "react-router-dom"
import { useQuery, useMutation } from "@apollo/client"
import { QUERY_ACTIVITY } from "../utils/queries"
import { SAVE_ACTIVITY, DELETE_ACTIVITY } from "../utils/mutations"
import Auth from "../utils/auth"

const ActivityDetail = () => {
  const navigate = useNavigate()
  const { id } = useParams()
  const { loading, data } = useQuery(QUERY_ACTIVITY, {
    variables: { activityId: id },
  })
  const [saveActivity] = useMutation(SAVE_ACTIVITY)
  const [deleteActivity] = useMutation(DELETE_ACTIVITY)

  const activity = data?.activity || {}

  // Check if the current user is the owner of the activity
  const isOwner = Auth.loggedIn() && Auth.getProfile().data.username === activity.username

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

  const handleDeleteActivity = async () => {
    if (window.confirm("Are you sure you want to delete this activity? This action cannot be undone.")) {
      try {
        await deleteActivity({
          variables: { activityId: activity._id },
        })
        alert("Activity deleted successfully!")
        navigate("/profile")
      } catch (err) {
        console.error(err)
        alert("Failed to delete activity: " + err.message)
      }
    }
  }

  const handleDownload = () => {
    alert("Download functionality would be implemented here.")
  }

  if (loading) {
    return <div className="text-center py-8">Loading...</div>
  }

  return (
    <div className="max-w-4xl mx-auto mt-10">
      <div className="mb-6">
        <Link to="/" className="text-pastel-purple hover:underline">
          &larr; Back to Activities
        </Link>
      </div>

      <div className="bg-white shadow-md rounded-lg p-6">
        <h1 className="text-3xl font-bold mb-4 text-gray-800">{activity.lessonName}</h1>

        <div className="flex flex-wrap gap-2 mb-6">
          {activity.tags &&
            activity.tags.map((tag, index) => (
              <span key={index} className="bg-pastel-yellow text-gray-800 px-2 py-1 rounded-full text-sm">
                {tag}
              </span>
            ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div className="bg-pastel-gray bg-opacity-30 p-4 rounded">
            <h2 className="text-xl font-semibold mb-2 text-gray-800">Details</h2>
            <p>
              <strong>Grade Level:</strong> {activity.gradeLevel && activity.gradeLevel.join(", ")}
            </p>
            <p>
              <strong>Subject:</strong> {activity.subjects && activity.subjects.join(", ")}
            </p>
            <p>
              <strong>Duration:</strong> {activity.duration}
            </p>
            <p>
              <strong>Created by:</strong> {activity.username}
            </p>
          </div>

          <div className="bg-pastel-gray bg-opacity-30 p-4 rounded">
            <h2 className="text-xl font-semibold mb-2 text-gray-800">Description</h2>
            <p>{activity.description}</p>
          </div>
        </div>

        <div className="mb-6 bg-pastel-gray bg-opacity-30 p-4 rounded">
          <h2 className="text-xl font-semibold mb-2 text-gray-800">Objectives</h2>
          <p>{activity.objectives}</p>
        </div>

        <div className="mb-6 bg-pastel-gray bg-opacity-30 p-4 rounded">
          <h2 className="text-xl font-semibold mb-2 text-gray-800">Materials Needed</h2>
          <p>{activity.materialsNeeded}</p>
        </div>

        <div className="mb-6 bg-pastel-gray bg-opacity-30 p-4 rounded">
          <h2 className="text-xl font-semibold mb-2 text-gray-800">Instructions</h2>
          <p>{activity.instructions}</p>
        </div>

        {activity.files && activity.files.length > 0 && (
          <div className="mb-6 bg-pastel-gray bg-opacity-30 p-4 rounded">
            <h2 className="text-xl font-semibold mb-2 text-gray-800">Files</h2>
            <ul className="list-disc pl-5">
              {activity.files.map((file, index) => (
                <li key={index}>
                  <a
                    href={file.url}
                    className="text-pastel-purple hover:underline"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {file.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        )}

        {Auth.loggedIn() && (
          <div className="flex gap-4 mt-6">
            {isOwner ? (
              <>
                <button
                  onClick={handleDeleteActivity}
                  className="bg-pastel-pink text-gray-800 px-4 py-2 rounded hover:bg-opacity-80"
                >
                  Delete Activity
                </button>
                {/* <button
                  onClick={handleDownload}
                  className="bg-pastel-blue text-gray-800 px-4 py-2 rounded hover:bg-opacity-80"
                >
                  Download
                </button> */}
              </>
            ) : (
              <>
                <button
                  onClick={handleSaveActivity}
                  className="bg-pastel-green text-gray-800 px-4 py-2 rounded hover:bg-opacity-80"
                >
                  Save Activity
                </button>
                {/* <button
                  onClick={handleDownload}
                  className="bg-pastel-blue text-gray-800 px-4 py-2 rounded hover:bg-opacity-80"
                >
                  Download
                </button> */}
              </>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export default ActivityDetail
