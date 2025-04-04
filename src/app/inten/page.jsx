'use client'

import React, { useState, useEffect } from "react"
import { FaBriefcase } from "react-icons/fa"
import { useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"
import { Header } from '../../components/landing-page'
import UserForm from "../../components/ui/user-form"

const Internships = () => {
  const [internships, setInternships] = useState([])
  const [hoveredInternship, setHoveredInternship] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)
  const [formEnabled,setFormEnabled] = useState(false);
  const [formDetails,setFormDetails] = useState(null)
  const searchParams = useSearchParams()
  const router = useRouter()
  const searchQuery = searchParams.get("search")?.toLowerCase() || ""

  useEffect(() => {
    fetchInternships()
  }, [])

  const fetchInternships = async () => {
    setIsLoading(true)
    setError(null)
    try {
      const response = await fetch('/api/internships')
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      const data = await response.json()
      setInternships(data)
    } catch (error) {
      console.error("Failed to fetch internships:", error)
      setError("Failed to load internships. Please try again later.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleMoreInfoClick = (internshipId) => {
    router.push(`/internship/${internshipId}`)
  }

  const InternshipCard = ({ internship }) => (
    <div
      key={internship.id}
      style={{
        position: "relative",
        width: "100%",
        paddingTop: "70%",
        borderRadius: "8px",
        overflow: "hidden",
        cursor: "pointer",
        boxShadow: "0 4px 10px rgba(0, 0, 0, 0.2)",
        border: "2px solid #3b82f6",
        margin: "8px",
        minWidth: "250px",
      }}
      onMouseEnter={() => setHoveredInternship(internship.id)}
      onMouseLeave={() => setHoveredInternship(null)}
      className="transform transition duration-300 hover:scale-105"
    >
      <img
        src={ internship.image || internship?.imageUrl}
        alt={internship.title}
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          objectFit: "cover",
        }}
      />
      <div
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          padding: "8px",
          background: "rgba(0, 0, 0, 0.8)",
          width: "100%",
          color: "white",
        }}
      >
        <h4 className="font-semibold text-sm">{internship.title}</h4>
        <p className="text-xs text-gray-300">{internship.company}</p>
        <p className="font-bold text-sm mt-1">{internship.stipend}</p>
      </div>
      {hoveredInternship === internship.id && (
        <div
          style={{
            position: "absolute",
            inset: 0,
            padding: "16px",
            backgroundColor: "rgba(255, 255, 255, 0.95)",
            zIndex: 10,
            borderRadius: "8px",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            textAlign: "center",
          }}
        >
          <h4 className="font-semibold text-sm">{internship.title}</h4>
          <p className="text-xs mt-2">
            {internship.company} · {internship.duration}
          </p>
          <p className="text-xs mt-2">{internship.description}</p>
          <ul className="text-xs mt-2">
            {internship.highlights &&
              internship.highlights.map((highlight, index) => (
                <li key={index} className="flex items-center mt-0">
                  <FaBriefcase className="mr-1 text-blue-500" /> {highlight}
                </li>
              ))}
          </ul>
          <div className="mt-4 w-full flex flex-col space-y-2">
            {/* <Link href={`/InternshipApplication?id=${internship.id}`} passHref> */}
              <button onClick={ () => {setFormEnabled(true),setFormDetails(internship)}} className="w-full bg-blue-500 hover:bg-blue-600 text-white text-xs font-bold py-2 px-4 rounded">
                Apply Now
              </button>
            {/* </Link> */}
            <button
              onClick={() => handleMoreInfoClick(internship.id)}
              className="mt-2 w-full bg-green-500 hover:bg-green-600 text-white text-xs font-bold py-2 px-4 rounded" 
            >
              More Info
            </button>
          </div>
        </div>
      )}
    </div>
  )

  if (isLoading) {
    return (
      <>
        <Header />
        <div className="min-h-screen flex flex-col items-center justify-center bg-gray-900 text-gray-100">
          <p className="text-xl">Loading internships...</p>
        </div>
      </>
    )
  }

  if (error) {
    return (
      <>
        <Header />
        <div className="min-h-screen flex flex-col items-center bg-blue-100 justify-center bg-gray-900 text-gray-100">
          <p className="text-xl text-red-500">{error}</p>
          <button
            onClick={fetchInternships}
            className="mt-4 bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
          >
            Try Again
          </button>
        </div>
      </>
    )
  }

  return (
    <div className="min-h-screen bg-blue-100">
      <Header />
      <section className="px-4 py-8">
        <h2 className="text-4xl font-bold mb-8 text-center text-black">
          All Internships
        </h2>
        {internships.length > 0 ? (
          <div className="md:grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {internships.map((internship) => (
              <InternshipCard key={internship.id} internship={internship} />
            ))}
          </div>
        ) : (
          <p className="text-center text-gray-700">No internships available</p>
        )}
      </section>
      {
        formEnabled && <UserForm 
         data={formDetails}
         open ={formEnabled}
         feature ="Internship"
         onClose ={() => setFormEnabled(false)}
         onSubmit={() => {}}        
        />
      }
    </div>
  )
}

export default Internships
