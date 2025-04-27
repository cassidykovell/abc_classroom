"use client"

import { useState } from "react"
import { useQuery } from "@apollo/client"
import { QUERY_ACTIVITIES } from "../utils/queries"
import ActivityCard from "../components/ActivityCard"
import SearchBar from "../components/SearchBar"

const Home = () => {
  const [searchTerm, setSearchTerm] = useState("")
  const { loading, data } = useQuery(QUERY_ACTIVITIES, {
    variables: { searchTerm },
  })

  const activities = data?.activities || []

  const handleSearch = (term) => {
    setSearchTerm(term)
  }

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">ABC Classroom</h1>
      <SearchBar onSearch={handleSearch} />

      {loading ? (
        <p>Loading...</p>
      ) : activities.length === 0 ? (
        <p>No activities found.</p>
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
