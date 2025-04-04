import React from "react"

const Filter = ({ selectedCategories, handleCategoryChange }) => {
  const categories = [
    "Web Development",
    "Programming",
    "Data Science",
    "Artificial Intelligence",
    "CSS and Design",
    "Python",
  ]

  return (
    <div className="p-4 rounded-lg w-56 ml-6">
     <h4 className="text-black font-bold mb-4 text-lg">Categories</h4>
      {categories.map((category) => (
        <div key={category} className="flex items-center mb-4 mt-4">
          <input
            type="checkbox"
            id={category}
            checked={selectedCategories.includes(category)}
            onChange={() => handleCategoryChange(category)}
            className="mr-3 w-4 h-4"
          />
          <label htmlFor={category} className="text-black text-base">
            {category}
          </label>
        </div>
      ))}
    </div>
  )
}

export default Filter

