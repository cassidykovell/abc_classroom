"use client"

import { useState } from "react"
import { useMutation } from "@apollo/client"
import { ADD_ACTIVITY } from "../utils/mutations"
import { useNavigate } from "react-router-dom"
import Auth from "../utils/auth"
import { Navigate } from "react-router-dom"

const UploadActivity = () => {
  const navigate = useNavigate()
  const [formState, setFormState] = useState({
    lessonName: "",
    subjects: [],
    gradeLevel: [],
    description: "",
    objectives: "",
    materialsNeeded: "",
    duration: "30 minutes",
    instructions: "",
    tags: "",
  })

  const [fileInputs, setFileInputs] = useState([{ id: 1, file: null }])
  const [addActivity] = useMutation(ADD_ACTIVITY)

  // If not logged in, redirect to login page
  if (!Auth.loggedIn()) {
    return <Navigate to="/login" />
  }

  const handleChange = (event) => {
    const { name, value } = event.target
    setFormState({
      ...formState,
      [name]: value,
    })
  }

  const handleCheckboxChange = (event) => {
    const { name, value, checked } = event.target
    if (checked) {
      setFormState({
        ...formState,
        [name]: [...formState[name], value],
      })
    } else {
      setFormState({
        ...formState,
        [name]: formState[name].filter((item) => item !== value),
      })
    }
  }

  const handleFileChange = (id, event) => {
    const newFileInputs = fileInputs.map((fileInput) => {
      if (fileInput.id === id) {
        return { ...fileInput, file: event.target.files[0] }
      }
      return fileInput
    })
    setFileInputs(newFileInputs)
  }

  const addFileInput = () => {
    const newId = fileInputs.length > 0 ? Math.max(...fileInputs.map((f) => f.id)) + 1 : 1
    setFileInputs([...fileInputs, { id: newId, file: null }])
  }

  const handleFormSubmit = async (event) => {
    event.preventDefault()

    try {
      // In a real app, you would upload files to a storage service here
      // and get back URLs to store in the database

      // For this simple version, we'll just store the activity without files
      const { data } = await addActivity({
        variables: {
          ...formState,
          tags: formState.tags.split(",").map((tag) => tag.trim()),
        },
      })

      navigate(`/activity/${data.addActivity._id}`)
    } catch (err) {
      console.error(err)
    }
  }

  const subjects = ["Math", "Science", "English", "History", "Art", "Music", "Physical Education", "Computer Science"]
  const gradeLevels = ["K", "1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12"]
  const durations = ["15 minutes", "30 minutes", "45 minutes", "1 hour", "1.5 hours", "2 hours", "1 day", "1 week"]

  return (
    <div className="max-w-2xl mx-auto mt-10">
      <h2 className="text-2xl font-bold mb-6">Upload Activity</h2>
      <form onSubmit={handleFormSubmit} className="space-y-6">
        <div>
          <label htmlFor="lessonName" className="block mb-1 font-medium">
            Lesson Name
          </label>
          <input
            type="text"
            name="lessonName"
            id="lessonName"
            value={formState.lessonName}
            onChange={handleChange}
            required
            className="w-full p-2 border rounded"
          />
        </div>

        <div>
          <label className="block mb-1 font-medium">Subjects</label>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
            {subjects.map((subject) => (
              <div key={subject} className="flex items-center">
                <input
                  type="checkbox"
                  id={`subject-${subject}`}
                  name="subjects"
                  value={subject}
                  onChange={handleCheckboxChange}
                  className="mr-2"
                />
                <label htmlFor={`subject-${subject}`}>{subject}</label>
              </div>
            ))}
          </div>
        </div>

        <div>
          <label className="block mb-1 font-medium">Grade Level</label>
          <div className="grid grid-cols-3 md:grid-cols-6 gap-2">
            {gradeLevels.map((grade) => (
              <div key={grade} className="flex items-center">
                <input
                  type="checkbox"
                  id={`grade-${grade}`}
                  name="gradeLevel"
                  value={grade}
                  onChange={handleCheckboxChange}
                  className="mr-2"
                />
                <label htmlFor={`grade-${grade}`}>{grade}</label>
              </div>
            ))}
          </div>
        </div>

        <div>
          <label htmlFor="description" className="block mb-1 font-medium">
            Description
          </label>
          <textarea
            name="description"
            id="description"
            value={formState.description}
            onChange={handleChange}
            required
            rows="3"
            className="w-full p-2 border rounded"
          ></textarea>
        </div>

        <div>
          <label htmlFor="objectives" className="block mb-1 font-medium">
            Objectives
          </label>
          <textarea
            name="objectives"
            id="objectives"
            value={formState.objectives}
            onChange={handleChange}
            required
            rows="3"
            className="w-full p-2 border rounded"
          ></textarea>
        </div>

        <div>
          <label htmlFor="materialsNeeded" className="block mb-1 font-medium">
            Materials Needed
          </label>
          <textarea
            name="materialsNeeded"
            id="materialsNeeded"
            value={formState.materialsNeeded}
            onChange={handleChange}
            rows="3"
            className="w-full p-2 border rounded"
          ></textarea>
        </div>

        <div>
          <label htmlFor="duration" className="block mb-1 font-medium">
            Duration
          </label>
          <select
            name="duration"
            id="duration"
            value={formState.duration}
            onChange={handleChange}
            className="w-full p-2 border rounded"
          >
            {durations.map((duration) => (
              <option key={duration} value={duration}>
                {duration}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="instructions" className="block mb-1 font-medium">
            Instructions
          </label>
          <textarea
            name="instructions"
            id="instructions"
            value={formState.instructions}
            onChange={handleChange}
            required
            rows="5"
            className="w-full p-2 border rounded"
          ></textarea>
        </div>

        <div>
          <label className="block mb-1 font-medium">Upload Files</label>
          {fileInputs.map((fileInput) => (
            <div key={fileInput.id} className="mb-2">
              <input
                type="file"
                onChange={(e) => handleFileChange(fileInput.id, e)}
                className="w-full p-2 border rounded"
              />
            </div>
          ))}
          <button type="button" onClick={addFileInput} className="mt-2 bg-gray-200 px-4 py-2 rounded hover:bg-gray-300">
            Add Another File
          </button>
        </div>

        <div>
          <label htmlFor="tags" className="block mb-1 font-medium">
            Tags (comma separated)
          </label>
          <input
            type="text"
            name="tags"
            id="tags"
            value={formState.tags}
            onChange={handleChange}
            placeholder="math, algebra, equations"
            className="w-full p-2 border rounded"
          />
        </div>

        <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700">
          Upload Activity
        </button>
      </form>
    </div>
  )
}

export default UploadActivity
