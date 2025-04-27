"use client"
import { useParams, Link } from "react-router-dom"
import { useQuery, useMutation } from "@apollo/client"
import { QUERY_ACTIVITY } from "../utils/queries"
import { SAVE_ACTIVITY } from "../utils/mutations"
import Auth from "../utils/auth"

const ActivityDetail = () => {
  const { id } = useParams()
  const { loading, data } = useQuery(QUERY_ACTIVITY, {
    variables: { activityId: id },
  })
  const [saveActivity] = useMutation(SAVE_ACTIVITY)

  const activity = data?.activity || {}

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

  const handleDownload = () => {
    // In a real app, this would download the activity files
    alert("Download functionality would be implemented here.")
  }

  if (loading) {
    return <div>Loading...</div>
  }

  return (
    <div className="max-w-4xl mx-auto mt-10">
      <div className="mb-6">
        <Link to="/" className="text-blue-600 hover:underline">
          &larr; Back to Activities
        </Link>
      </div>

      <div className="bg-white shadow-md rounded-lg p-6">
        <h1 className="text-3xl font-bold mb-4">{activity.lessonName}</h1>

        <div className="flex flex-wrap gap-2 mb-6">
          {activity.tags &&
            activity.tags.map((tag, index) => (
              <span key={index} className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-sm">
                {tag}
              </span>
            ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <h2 className="text-xl font-semibold mb-2">Details</h2>
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

          <div>
            <h2 className="text-xl font-semibold mb-2">Description</h2>
            <p>{activity.description}</p>
          </div>
        </div>

        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-2">Objectives</h2>
          <p>{activity.objectives}</p>
        </div>

        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-2">Materials Needed</h2>
          <p>{activity.materialsNeeded}</p>
        </div>

        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-2">Instructions</h2>
          <p>{activity.instructions}</p>
        </div>

        {activity.files && activity.files.length > 0 && (
          <div className="mb-6">
            <h2 className="text-xl font-semibold mb-2">Files</h2>
            <ul className="list-disc pl-5">
              {activity.files.map((file, index) => (
                <li key={index}>
                  <a
                    href={file.url}
                    className="text-blue-600 hover:underline"
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
            <button
              onClick={handleSaveActivity}
              className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
            >
              Save Activity
            </button>
            <button onClick={handleDownload} className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
              Download
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

export default ActivityDetail
