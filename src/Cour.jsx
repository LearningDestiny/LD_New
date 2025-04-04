'use client'

import React, { useState, useEffect } from "react"
import { FaPlayCircle, FaSearch } from "react-icons/fa"
import { useRouter, useSearchParams } from "next/navigation"
import EnrollmentForm from "../src/enrollpages/EnrollmentForm"
import Filter from "../src/components/Filter"
import MobileMenu from "../src/components/MobileMenu"
import UserForm from "../src/components/ui/user-form"


const Courses = () => {
  const [courses, setCourses] = useState([])
  const [hoveredPopularCourse, setHoveredPopularCourse] = useState(null)
  const [hoveredAllCourse, setHoveredAllCourse] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [selectedCourse, setSelectedCourse] = useState(null)
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const searchParams = useSearchParams()
  const router = useRouter()

  useEffect(() => {
    fetchCourses()
  }, [])

  const fetchCourses = async () => {
    setIsLoading(true)
    setError(null)
    try {
      const response = await fetch('/api/courses')
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      const data = await response.json()
      setCourses(data)
    } catch (error) {
      console.error("Failed to fetch courses:", error)
      setError("Failed to load courses. Please try again later.")
    } finally {
      setIsLoading(false)
    }
  }

  const popularCourses = courses.slice(0, 3)

  const handleMoreInfoClick = (courseId) => {
    router.push(`/enroll/${courseId}`)
  }
  const handleEnrollClick = (course) => {
    setSelectedCourse(course)
    setIsFormOpen(true)
  }

  const closeEnrollmentForm = () => {
    setIsFormOpen(false)
    setSelectedCourse(null)
  }

  useEffect(() => {
    const initialCategories = searchParams.get("categories") ? searchParams.get("categories").split(",") : [];
    setSelectedCategories(initialCategories)
  }, [searchParams])

  const handleSearch = (e) => {
    e.preventDefault(); // Prevents page reload
    setSearchQuery(e.target.search.value); // Updates searchQuery correctly
  }

  const handleCategoryChange = (category) => {
    const updatedCategories = selectedCategories.includes(category)
      ? selectedCategories.filter((cat) => cat !== category)
      : [...selectedCategories, category]
    setSelectedCategories(updatedCategories)
    const newSearchParams = new URLSearchParams();
    if (updatedCategories.length > 0) {
      newSearchParams.set("categories", updatedCategories.join(","));
    }
    router.push(`?${newSearchParams.toString()}`, undefined, { scroll: false });
  };

  const filteredCourses = courses.filter((course) => {
    // Ensure course exists before accessing properties
    if (!course || !course.title) return false;

    const matchesSearchQuery =
      searchQuery === "" || course.title.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory =
      selectedCategories.length === 0 ||
      (course.categories && selectedCategories.some((category) => course.categories.includes(category)));

    return matchesSearchQuery && matchesCategory;
  });

  const CourseCard = ({ course, isHovered, setHovered, isPopular }) => (
    <div
      key={course.id}
      className="flex-shrink-0 w-64 md:w-auto bg-white text-black shadow-lg rounded-lg overflow-hidden transition-transform transform hover:scale-105 hover:shadow-2xl"
      onMouseEnter={() => setHovered(course.id)}
      onMouseLeave={() => setHovered(null)}
    >
      <img
        src={ course.image || course?.imageUrl}
        alt={course.title}
        className="w-full h-48 object-cover"
      />
      <div className="p-4 space-y-2">
        <h4 className="font-semibold text-lg truncate">{course.title}</h4>
        <p className="text-sm text-gray-500">{course.instructor}</p>
        <p className="font-bold text-lg text-indigo-900 mt-2">{course.price}</p>
      </div>
      {isHovered === course.id && (
        <div className="absolute inset-0 bg-black bg-opacity-90 p-4 flex flex-col justify-center space-y-3 overflow-auto">
          <h4 className="font-semibold text-white text-lg">{course.title}</h4>
          <p className="text-sm text-white">{course.lastUpdated}</p>
          <p className="text-sm text-white">
            {course.duration} total hours · {course.lectureCount} lectures · All Levels
          </p>
          <p className="text-sm text-white line-clamp-3">{course.description}</p>
          <ul className="text-sm text-white space-y-1">
            {course.highlights.map((highlight, index) => (
              <li key={index} className="flex items-center">
                <FaPlayCircle className="mr-1 text-blue-500" /> {highlight}
              </li>
            ))}
          </ul>
          <div className="flex space-x-2">
            <button
              onClick={() => handleMoreInfoClick(course.id)}
              className="mt-4 py-2 px-4 w-full font-semibold rounded bg-blue-600 text-white hover:bg-blue-800 transition duration-300"
            >
              More Info
            </button>
            <button
              onClick={() => handleEnrollClick(course)}
              className="mt-4 py-2 px-4 w-full font-semibold rounded bg-green-600 text-white hover:bg-green-800 transition duration-300"
            >
              Enroll Now
            </button>
          </div>
        </div>
      )}
    </div>
  )
  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-gray-900 to-gray-900 text-white">
        <p className="text-xl">Loading courses...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-gray-900 to-gray-900 text-white">
        <p className="text-xl text-red-500">{error}</p>
        <button
          onClick={fetchCourses}
          className="mt-4 bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
        >
          Try Again
        </button>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col bg-blue-100 from-gray-900 text-gray-100">
      <div className="container mx-auto flex flex-col py-12 px-4 md:px-8">
        <div className="flex justify-center mb-6">
          <form onSubmit={handleSearch} className="flex items-center">
            <input
              type="text"
              name="search"
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-55 px-4 py-2 rounded-l-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-black"
            />
            <button type="submit" className="bg-indigo-600 text-white px-4 py-2 rounded-r-md hover:bg-indigo-700 transition duration-300">
              <FaSearch size={20} />
            </button>
          </form>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          <div className="lg:w-3/4 pr-0 lg:pr-8">


            {searchQuery === "" && selectedCategories.length === 0 && (
              <section className="mb-12">
                <h2 className="text-4xl font-bold mb-8 text-center text-black">Popular Courses</h2>

                {/* Container: Enables horizontal scrolling on mobile, grid layout on desktop */}
                <div className="flex gap-6 overflow-x-auto md:grid md:grid-cols-3 md:gap-6 px-4 md:px-0">
                  {popularCourses.map((course) => (
                    /* Each course item: Ensures correct width on mobile, normal on desktop */
                    <div key={course.id} className="min-w-[80%] sm:min-w-[45%] md:min-w-0">
                      <CourseCard
                        course={course}
                        isHovered={hoveredPopularCourse}
                        setHovered={setHoveredPopularCourse}
                      />
                    </div>
                  ))}
                </div>
              </section>
            )}
            {/* All Courses Section */}
            {/* <section> */}
            <section className="flex flex-col lg:flex-row">
              {/* Main Content Section */}
              <div className="lg:w-3/4">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-3xl font-bold text-black flex-1 text-center">All Courses</h2>
                  <MobileMenu selectedCategories={selectedCategories} handleCategoryChange={handleCategoryChange} />
                </div>

                {/* Container: Enables horizontal scrolling on mobile, grid layout on desktop */}
                {/* <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 sm:gap-4"> */}
                <div className="flex gap-6 overflow-x-auto md:grid md:grid-cols-3 md:gap-6 px-4 md:px-0">
                  {filteredCourses.map((course) => (
                    <div
                      key={course.id}
                      className="w-full max-w-[120px] sm:max-w-none course-card"
                    >
                      <CourseCard
                        course={course}
                        isHovered={hoveredAllCourse}
                        setHovered={setHoveredAllCourse}
                      />
                    </div>
                  ))}
                </div>
              </div>
            </section>
          </div>
          {/* Filter Section - Desktop View */}
          <div className="lg:w-1/4 filter-section">
            <Filter selectedCategories={selectedCategories} handleCategoryChange={handleCategoryChange} />
          </div>
        </div>
      </div>

      {/* Enrollment Form Modal */}
      {isFormOpen && (
        // <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center">
        //   {/* <button
        //       onClick={closeEnrollmentForm}
        //       className="text-red-500 font-bold absolute top-2 right-2"
        //     >
        //       Close
        //     </button> */}
        //   <EnrollmentForm course={selectedCourse} onClose={closeEnrollmentForm} />
        // </div>
        <UserForm 
        feature="Course"
        open={isFormOpen}
        onClose={closeEnrollmentForm}
        onSubmit={() => {}}
        data = {selectedCourse}
        />
      )}
    </div>
  );
};

export default Courses
