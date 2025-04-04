"use client"

import { useState } from "react"
import { FaBars } from "react-icons/fa"
import Filter from "./Filter"

const MobileMenu = ({ selectedCategories, handleCategoryChange }) => {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div className="lg:hidden">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center text-black ml-2"
        aria-label="Toggle categories"
      >
        <FaBars className="w-6 h-6" />
      </button>
      {isOpen && (
        <div className="absolute left-0 right-0 bg-white shadow-md z-50 mt-2">
          <Filter selectedCategories={selectedCategories} handleCategoryChange={handleCategoryChange} />
        </div>
      )}
    </div>
  )
}

export default MobileMenu

