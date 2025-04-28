"use client"

import { useState } from "react"

const SearchBar = ({ onSearch }) => {
  const [searchTerm, setSearchTerm] = useState("")

  const handleSubmit = (e) => {
    e.preventDefault()
    onSearch(searchTerm)
  }

  return (
    <form onSubmit={handleSubmit} className="mb-8">
      <div className="flex">
        <input
          type="text"
          placeholder="Search by lesson name or tags..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="flex-grow p-2 border rounded-l focus:outline-none focus:ring-2 focus:ring-pastel-purple"
        />
        <button type="submit" className="bg-pastel-purple text-gray-800 px-4 py-2 rounded-r hover:bg-opacity-80">
          Search
        </button>
      </div>
    </form>
  )
}

export default SearchBar
