"use client"

import { useState } from "react"
import { useQuery } from "@apollo/client"
import { QUERY_ACTIVITIES } from "../utils/queries"
import ActivityCard from "../components/ActivityCard"
import SearchBar from "../components/SearchBar"

const Home = () => {
  const [searchTerm, setSearchTerm] = useState("")
  const { loading, error, data } = useQuery(QUERY_ACTIVITIES, {
    variables: { searchTerm },
    fetchPolicy: "network-only", 
  })

  const activities = data?.activities || []

  const handleSearch = (term) => {
    setSearchTerm(term)
  }

  return (
    <div className="bg-pastel-gray bg-opacity-30 p-6 rounded-lg">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">ABC Classroom</h1>
      <SearchBar onSearch={handleSearch} />

      {loading ? (
        <p className="text-center py-8">Loading activities...</p>
      ) : error ? (
        <div className="text-center py-8 text-red-600">
          <p>Error loading activities: {error.message}</p>
          <p className="mt-2">Please check your server connection and try again.</p>
        </div>
      ) : activities.length === 0 ? (
        <div className="text-center py-8 bg-white p-4 rounded shadow">
          <p>No activities found.</p>
          <p className="mt-2">{searchTerm ? "Try a different search term." : "Be the first to add an activity!"}</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {activities.map((activity) => (
            <ActivityCard key={activity._id} activity={activity} />
          ))}
        </div>
      )}
    </div>
  )
}

export default Home
