'use client'

import React, { useState, useRef, useEffect } from 'react'
import Link from "next/link"
import Image from "next/image"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faLinkedin, faInstagram, faGoogle } from '@fortawesome/free-brands-svg-icons'
import { faPhone } from '@fortawesome/free-solid-svg-icons'
import { BookOpen, Users, Award } from "lucide-react"
import { SignInButton, SignedIn, SignedOut, UserButton } from "@clerk/nextjs"
import { FaPlayCircle, FaCalendarAlt } from 'react-icons/fa'
import { Menu, X, Search } from "lucide-react"
import { useRouter } from 'next/navigation'
import { courses, events } from '../../src/Data'
import PaymentHandlerButton from '../../src/components/PaymentHandlerButton'
import { Helmet } from "react-helmet";


//import EnrollmentForm from '@/enrollpages'

const internships = [
  {
    id: 1,
    title: 'Software Development Internship',
    company: 'Learning Destiny',
    stipend: '500Rs/month',
    imageUrl: '/SDIntern.jpeg',
    description: 'Join our team to work on exciting software projects and enhance your skills.',
    lastUpdated: 'Last updated: September 2024',
    duration: '3 months',
    responsibilities: ['Developing web applications', 'Collaborating with team members', 'Participating in code reviews'],
  },
  {
    id: 2,
    title: 'Data Analyst Internship',
    company: 'Learning Destiny',
    stipend: '300Rs/month',
    imageUrl: '/DMIntern.jpeg',
    description: 'Gain hands-on experience in digital marketing strategies and social media management.',
    lastUpdated: 'Last updated: August 2024',
    duration: '6 months',
    responsibilities: ['Creating content for social media', 'Assisting in SEO strategies', 'Analyzing marketing data'],
  },
  {
    id: 3,
    title: 'Graphic Design Internship',
    company: 'Learning Destiny',
    stipend: '400Rs/month',
    imageUrl: '/GraphicIntern.png',
    description: 'Work with our design team to create engaging visuals for various projects.',
    lastUpdated: 'Last updated: January 2025',
    duration: '4 months',
    responsibilities: ['Designing graphics for social media', 'Assisting in branding projects', 'Participating in brainstorming sessions'],
  },
]

const workshops = [
  {
    id: 1,
    title: 'Full Stack Web Development Workshop',
    instructor: 'Jane Doe',
    price: '2,999 Rs',
    imageUrl: '/Full stack.jpg',
    description: 'A workshop to enhance your Website Development Skills.',
    lastUpdated: 'Last updated: September 2024',
    duration: '3 hours',
    lectureCount: 5,
    highlights: ['Interactive sessions', 'Expert feedback', 'Networking opportunities'],
  },
  {
    id: 2,
    title: 'Data Analysis with Python Workshop',
    instructor: 'John Smith',
    price: '3,499 Rs',
    imageUrl: 'https://framerusercontent.com/images/OPXPK3EVvWKTxyehPUHeWjtfkA.png',
    description: 'Learn the fundamentals of Data Analysis with Python in this hands-on workshop.',
    lastUpdated: 'Last updated: August 2024',
    duration: '4 hours',
    lectureCount: 6,
    highlights: ['Practical exercises', 'Portfolio building', 'Q&A session'],
  },
  {
    id: 3,
    title: 'Digital Marketing Bootcamp',
    instructor: 'Emily Johnson',
    price: '1,299 Rs',
    imageUrl: 'https://academy.skillgenic.in/wp-content/uploads/2020/07/1340caf6112d8998a65f47bbc026.png',
    description: 'An intensive workshop covering the latest digital marketing strategies.',
    lastUpdated: 'Last updated: July 2024',
    duration: '5 hours',
    lectureCount: 8,
    highlights: ['Hands-on projects', 'Real-world case studies', 'Certification'],
  },
]

export function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [isMounted, setIsMounted] = useState(false)
  const router = useRouter()

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen)
  }

  const handleSearch = (e) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      const courseExists = courses.some(course =>
        course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        course.description.toLowerCase().includes(searchQuery.toLowerCase())
      )

      if (courseExists) {
        router.push(`/Courses?search=${encodeURIComponent(searchQuery)}`)
      } else {
        router.push(`/Courses?search=${encodeURIComponent(searchQuery)}&notFound=true`)
      }
    }
  }

  // Set isMounted to true once the component is mounted
  useEffect(() => {
    setIsMounted(true)
  }, [])

  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }
  }, [isMobileMenuOpen])

  if (!isMounted) return null // Prevent rendering until client-side mounted```javascript

  return (
    <header className="relative z-50 px-4 lg:px-6 h-16 flex items-center bg-white text-indigo-900 shadow-md">
      {/* <div className="container mx-auto flex items-center justify-between">
        <Link href="/landing-page" className="flex items-center">
          <Image src="/TransparentLogo.png" alt="Learning Destiny Logo" width={32} height={32} className="mr-2" />
          <span className="text-lg font-semibold sm:inline">Learning Destiny Pvt. Ltd.</span>
        </Link> */}
      <div className="container mx-auto flex items-center justify-between">
        <Helmet>
          <meta charSet="utf-8" />
          <title>Learning Destiny</title>
          <link rel="canonical" href="https://learningdestiny.in/" />
        </Helmet>
        <Link href="/landing-page" className="flex items-center">
          <Image
            src="/Learning Destiny.png"
            alt="Learning Destiny Logo"
            width={1000}
            height={150}
            className="h-12 w-auto"
          />
        </Link>

        <div className="flex items-center space-x-4">
          <nav className="hidden md:flex items-center space-x-6">
            <Link className="text-sm font-medium hover:text-indigo-600" href="/Courses">Courses</Link>
            <Link
              className="text-sm font-medium hover:text-indigo-600"
              href="https://learningdestiny.edumilestones.com/"
              onClick={toggleMobileMenu}
            >
              Abroad
            </Link>
            <Link className="text-sm font-medium hover:text-indigo-600" href="/Events">Events</Link>
            <Link className="text-sm font-medium hover:text-indigo-600" href="/workshop">Workshops</Link>
            <Link className="text-sm font-medium hover:text-indigo-600" href="/inten">Internship</Link>
            <Link className="text-sm font-medium hover:text-indigo-600" href="/Careers">Careers</Link>
            <Link className="text-sm font-medium hover:text-indigo-600" href="/dashboard">Dashboard</Link>
            <SignedIn>
              <Link className="text-sm font-medium hover:text-indigo-600" href="/Refer-and-Earn">Refer & Earn</Link>
            </SignedIn>
            <SignedOut>
              <SignInButton>
                <button className="text-sm font-medium bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition duration-300">
                  Sign In
                </button>
              </SignInButton>
            </SignedOut>
            <SignedIn>
              <UserButton />
            </SignedIn>
          </nav>

          <button onClick={toggleMobileMenu} className="md:hidden">
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {isMobileMenuOpen && (
        <div className="absolute top-10 left-0 w-full bg-white shadow-lg py-4 px-4 md:hidden">
          <form onSubmit={handleSearch} className="mb-4">
            <div className="flex items-center">
              <input
                type="text"
                placeholder="Search courses..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-4 py-2 rounded-l-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              <button type="submit" className="bg-indigo-600 text-white px-4 py-2 rounded-r-md hover:bg-indigo-700 transition duration-300">
                <Search size={20} />
              </button>
            </div>
          </form>
          <nav className="flex flex-col space-y-4">
            <Link className="text-sm font-medium hover:text-indigo-600" href="/Courses" onClick={toggleMobileMenu}>Courses</Link>
            <Link
              className="text-sm font-medium hover:text-indigo-600"
              href="https://learningdestiny.edumilestones.com/"
              onClick={toggleMobileMenu}
            >
              Abroad
            </Link>
            <Link className="text-sm font-medium hover:text-indigo-600" href="/Events" onClick={toggleMobileMenu}>Events</Link>
            <Link className="text-sm font-medium hover:text-indigo-600" href="/workshop" onClick={toggleMobileMenu}>Workshops</Link>
            <Link className="text-sm font-medium hover:text-indigo-600" href="/inten" onClick={toggleMobileMenu}>Internship</Link>
            <Link className="text-sm font-medium hover:text-indigo-600" href="/Careers" onClick={toggleMobileMenu}>Careers</Link>
            <Link className="text-sm font-medium hover:text-indigo-600" href="/dashboard" onClick={toggleMobileMenu}>Dashboard</Link>
            <SignedIn>
              <Link className="text-sm font-medium hover:text-indigo-600" href="/Refer-and-Earn" onClick={toggleMobileMenu}>Refer & Earn</Link>
            </SignedIn>
            <SignedOut>
              <SignInButton>
                <button className="text-sm font-medium bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition duration-300 w-full">
                  Sign In
                </button>
              </SignInButton>
            </SignedOut>
            <SignedIn>
              <UserButton />
            </SignedIn>
          </nav>
        </div>
      )}
    </header>
  )
}
function HeroSection() {
  const images = [
    '/image1.jpeg',
    '/image2.jpeg',
    '/image3.jpeg',
  ];

  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [images.length]);

  return (
    <div className="relative w-full h-screen">
      <div
        className="absolute inset-0 bg-cover bg-center z-0"
        style={{
          backgroundImage: `url('${images[currentIndex]}')`,
          backgroundSize: 'cover',
          backgroundRepeat: 'no-repeat',
          opacity: 0.9,

        }}
      >
        <div className="absolute inset-0 bg-black opacity-50 backdrop-blur-sm"></div>
      </div>
      <section className="relative w-full h-full py-12 mx-auto flex items-center justify-center md:py-24 lg:py-32 xl:py-48 z-10">
        <div className="container px-4 md:px-6 m-auto">
          <div className="flex flex-col md:flex-row items-center justify-between max-w-6xl mx-auto">
            <div className="mb-8 md:mb-0 md:mr-8 w-full md:w-auto flex justify-center">
              <Image
                src="/Transparent-Logo.png"
                alt="Learning Destiny"
                width={200}
                height={200}
                className="animate-fade-in"
              />
            </div>
            <div className="text-center md:text-left">
              <h1 className="text-4xl md:text-6xl font-extrabold mb-6 animate-fade-in tracking-tight text-white">
                Transforming Education, Shaping Careers.
              </h1>
              <p className="text-xl md:text-2xl font-light mb-4 max-w-3xl text-white">
                We provide more than courses—we build communities, nurture talents, and create opportunities.
              </p>
              <div className="space-x-0 md:space-x-4 flex flex-col md:flex-row items-center">
                <Link href="/sign-in" className="inline-block bg-primary text-white py-3 px-6 rounded-lg shadow-lg hover:bg-primary-dark transition duration-300 mb-4 md:mb-0">
                  Get Started
                </Link>
                <Link href="/AboutUs" className="inline-block bg-transparent border-2 border-white text-white py-3 px-6 rounded-lg hover:bg-white hover:text-primary transition duration-300">
                  Learn More
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

function KeyFeatures() {
  return (
    <section className="w-full mx-auto py-12 md:py-24 lg:py-32 bg-gray-100">
      <div className="container mx-auto px-4 md:px-6">
        <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl text-center mb-12">
          Key Features of Learning Destiny
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 text-center">
          <Feature
            icon={BookOpen}
            title="Comprehensive Courses"
            description="Access a wide range of courses tailored to your learning needs."
          />
          <Feature
            icon={Users}
            title="Collaborative Learning"
            description="Engage with peers and instructors in interactive learning environments."
          />
          <Feature
            icon={Award}
            title="Certifications"
            description="Earn recognized certifications to boost your career prospects."
          />
        </div>
      </div>
    </section>
  )
}

function Feature({ icon: Icon, title, description }) {
  return (
    <div className="flex flex-col items-center">
      <Icon className="text-blue-500 mb-4" size={40} />
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </div>
  )
}

function PopularCourses() {
  const [hoveredCourse, setHoveredCourse] = useState(null)
  const [selectedCourse, setSelectedCourse] = useState(null)
  const scrollRef = useRef(null)
  const router = useRouter()

  const popularCourses = courses.slice(0, 6)

  const handleEnrollClick = (courseId) => {
    router.push(`/enroll/${courseId}`)
  }

  const handleMoreInfoClick = (course) => {
    setSelectedCourse(course)
  }

  const closeEnrollmentForm = () => {
    setSelectedCourse(null)
  }

  return (
    <section className="w-full mx-auto py-8 md:py-14 lg:py-20 bg-gray-900">
      <div className="container mx-auto px-4 md:px-6 max-w-7xl">
        <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl text-center mb-12 text-white">
          Popular Courses
        </h2>
        <div className="relative">
          <div
            ref={scrollRef}
            className="flex overflow-x-auto pb-6 custom-scrollbar"
          >
            {/* <div className="flex-shrink-0 w-4 md:w-6" aria-hidden="true"></div> */}
            {popularCourses.map((course) => (
              <div
                key={course.id}
                className="relative flex-shrink-0 w-64 mx-3 bg-white rounded-lg shadow-lg overflow-hidden snap-start transform transition-transform duration-300 hover:scale-105"
                onMouseEnter={() => setHoveredCourse(course.id)}
                onMouseLeave={() => setHoveredCourse(null)}
              >
                <div className="relative h-48">
                  <Image
                    src={course.imageUrl}
                    alt={course.title}
                    layout="fill"
                    objectFit="cover"
                    className="rounded-t-lg"
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-50 flex items-end p-4 rounded-t-lg">
                    <div>
                      <h3 className="text-white font-semibold">{course.title}</h3>
                      <p className="text-gray-300 text-sm">{course.instructor}</p>
                    </div>
                  </div>
                </div>
                <div className="p-4">
                  <p className="font-bold text-lg text-indigo-600">{course.price}</p>
                  <p className="text-sm text-gray-600 mt-2">
                    {course.duration} total hours · {course.lectureCount} lectures
                  </p>
                  {hoveredCourse === course.id && (
                    <div className="absolute inset-0 bg-white bg-opacity-95 p-4 flex flex-col justify-between transition-opacity duration-300 rounded-lg overflow-auto">
                      <div>
                        <h4 className="font-semibold text-sm text-gray-900">{course.title}</h4>
                        <p className="text-xs mt-1 text-gray-600">{course.lastUpdated}</p>
                        <p className="text-xs mt-2 text-gray-700">{course.description}</p>
                        <ul className="text-xs mt-2 space-y-1">
                          {course.highlights.slice(0, 3).map((highlight, index) => (
                            <li key={index} className="flex items-start text-gray-700">
                              <FaPlayCircle className="mr-2 text-indigo-500 flex-shrink-0 mt-1" size={12} />
                              <span>{highlight}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div className="mt-4 space-y-2">
                        <button
                          onClick={() => handleEnrollClick(course.id)}
                          className="w-full py-2 px-4 bg-green-600 text-white rounded hover:bg-green-700 transition duration-300 font-semibold"
                        >
                          More Info
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
            <div className="flex-shrink-0 w-4 md:w-6" aria-hidden="true"></div>
          </div>
        </div>
        <div className="text-center mt-8">
          <Link href="/Courses" passHref>
            <button className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-md text-lg font-semibold transition-colors duration-300">
              See More Courses
            </button>
          </Link>
        </div>
      </div>
    </section>
  )
}


function Internship() {
  const [hoveredInternship, setHoveredInternship] = useState(null);

  return (
    <section className="w-full mx-auto py-8 md:py-14 lg:py-20 bg-white">
      <div className="container mx-auto px-4 md:px-6 max-w-7xl">
        <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl text-center mb-12 text-indigo-500">
          Internship Opportunities
        </h2>
        <div className="relative">
          <div className="flex overflow-x-auto pb-8 px-4 md:px-6 snap-x snap-mandatory scroll-smooth">
            <div className="flex-shrink-0 w-4 md:w-6" aria-hidden="true"></div>
            {internships.map((internship) => (
              <div
                key={internship.id}
                className="relative flex-shrink-0 w-64 mx-3 bg-white rounded-lg shadow-lg overflow-hidden snap-start transform transition-transform duration-300 hover:scale-105"
                onMouseEnter={() => setHoveredInternship(internship.id)}
                onMouseLeave={() => setHoveredInternship(null)}
              >
                <div className="relative h-48 overflow-hidden rounded-t-lg">
                  <Image
                    src={internship.imageUrl}
                    alt={internship.title}
                    layout="fill"
                    objectFit="cover"
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-50 flex items-end p-4">
                    <div>
                      <h3 className="text-white font-semibold">{internship.title}</h3>
                      <p className="text-gray-300 text-sm">{internship.company}</p>
                    </div>
                  </div>
                </div>
                <div className="p-4">
                  <p className="font-bold text-lg text-indigo-600">{internship.stipend}</p>
                  <p className="text-sm text-gray-600 mt-2">{internship.duration}</p>
                  {hoveredInternship === internship.id && (
                    <div className="absolute inset-0 bg-white bg-opacity-95 p-4 rounded-lg flex flex-col justify-between transition-opacity duration-300 overflow-auto">
                      <div>
                        <p className="text-sm text-gray-600">{internship.description}</p>
                        <ul className="mt-2 space-y-1">
                          {internship.responsibilities.map((responsibility, index) => (
                            <li key={index} className="flex items-start text-sm text-gray-600">
                              <FaPlayCircle className="mr-2 text-indigo-500 flex-shrink-0 mt-1" size={12} />
                              <span>{responsibility}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div className="flex flex-col space-y-2 mt-4">
                        <Link href={`/internship/${internship.id}`} passHref>
                          <button className="bg-green-500 hover:bg-green-600 text-white w-full py-2 rounded-md text-sm font-semibold transition-colors duration-300">
                            More Info
                          </button>
                        </Link>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
            <div className="flex-shrink-0 w-4 md:w-6" aria-hidden="true"></div>
          </div>
        </div>
        <div className="text-center mt-8">
          <Link href="/inten" passHref>
            <button className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-md text-lg font-semibold transition-colors duration-300">
              See More Internships
            </button>
          </Link>
        </div>
      </div>
    </section>
  )
}

function Workshop() {
  const router = useRouter();
  const [hoveredWorkshop, setHoveredWorkshop] = useState(null);

  const priceValue = (price) => {
    if (price === 'Free') {
      return 0;
    } else {
      const priceFloat = parseFloat(price.replace(/[^0-9.-]+/g, '').replace(',', ''));
      return priceFloat;

    }
  };

  return (
    <section className="w-full mx-auto py-8 md:py-14 lg:py-20 bg-blue-100">
      <div className="container mx-auto px-4 md:px-6 max-w-7xl">
        <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl text-center mb-12 text-indigo-900">
          Upcoming Workshops
        </h2>
        <div className="relative">
          <div className="flex overflow-x-auto pb-8 px-4 md:px-6 snap-x snap-mandatory scroll-smooth">
            <div className="flex-shrink-0 w-4 md:w-6" aria-hidden="true"></div>
            {workshops.map((workshop) => (
              <div
                key={workshop.id}
                className="relative flex-shrink-0 w-64 mx-3 bg-white rounded-lg shadow-lg overflow-hidden snap-start transform transition-transform duration-300 hover:scale-105"
                onMouseEnter={() => setHoveredWorkshop(workshop.id)}
                onMouseLeave={() => setHoveredWorkshop(null)}
              >
                <div className="relative h-48 overflow-hidden rounded-t-lg">
                  <Image
                    src={workshop.imageUrl}
                    alt={workshop.title}
                    layout="fill"
                    objectFit="cover"
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-50 flex items-end p-4 rounded-t-lg">
                    <div>
                      <h3 className="text-white font-semibold">{workshop.title}</h3>
                      <p className="text-gray-300 text-sm">{workshop.instructor}</p>
                    </div>
                  </div>
                </div>
                <div className="p-4">
                  <p className="font-bold text-lg text-indigo-600">{workshop.price}</p>
                  <p className="text-sm text-gray-600 mt-2">{workshop.duration}</p>
                  {hoveredWorkshop === workshop.id && (
                    <div className="absolute inset-0 bg-white bg-opacity-90 p-4 rounded-lg flex flex-col justify-between overflow-auto transition-opacity duration-300">
                      <div>
                        <p className="text-sm text-gray-600">{workshop.description}</p>
                        <ul className="mt-2 space-y-1">
                          {workshop.highlights.map((highlight, index) => (
                            <li key={index} className="flex items-center text-sm text-gray-600">
                              <FaPlayCircle className="mr-2 text-indigo-500 flex-shrink-0" size={12} />
                              <span>{highlight}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div className="mt-4 w-full flex flex-col space-y-2">
                        {/* <PaymentHandlerButton finalAmt={priceValue(workshop.price)}
                          className="mt-2 w-full bg-blue-500 text-white py-2 rounded lg:py-2 sm:py-2"
                        /> */}
                        <button
                          onClick={() => router.push(`/workshops/${workshop.id}`)}
                          className="w-full bg-green-500 hover:bg-green-600 text-white text-sm font-bold py-2 px-4 rounded transition-colors duration-300"
                        >
                          More Info
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
            <div className="flex-shrink-0 w-4 md:w-6" aria-hidden="true"></div>
          </div>
        </div>
        <div className="text-center mt-8">
          <Link href="/workshop" passHref>
            <button className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-md text-lg transition-colors duration-300">
              See More Workshops
            </button>
          </Link>
        </div>
      </div>
    </section>
  )
}
function Events() {
  const router = useRouter();
  const [hoveredEvent, setHoveredEvent] = useState(null);

  const priceValue = (price) => {
    if (price === 'Free') {
      return 0;
    } else {
      const priceFloat = parseFloat(price.replace(/[^0-9.-]+/g, '').replace(',', ''));
      return priceFloat;
    }
  };

  return (
    <section className="w-full mx-auto py-8 md:py-14 lg:py-20 bg-gray-100">
      <div className="container mx-auto px-4 md:px-6 max-w-7xl">
        <h2 className="text-2xl sm:text-3xl lg:text-5xl font-bold tracking-tighter text-center mb-8 sm:mb-12 text-indigo-900">
          Upcoming Events
        </h2>
        <div className="relative">
          <div className="flex overflow-x-auto pb-8 px-4 md:px-6 snap-x snap-mandatory scroll-smooth">
            <div className="flex-shrink-0 w-4 md:w-6" aria-hidden="true"></div>
            {events.map((event) => (
              <div
                key={event.id}
                className="relative flex-shrink-0 w-64 mx-3 bg-white rounded-lg shadow-lg overflow-hidden snap-start transform transition-transform duration-300 hover:scale-105"
                onMouseEnter={() => setHoveredEvent(event.id)}
                onMouseLeave={() => setHoveredEvent(null)}
              >
                <div className="relative h-48 overflow-hidden rounded-t-lg">
                  <Image
                    src={event.imageUrl}
                    alt={event.title}
                    layout="fill"
                    objectFit="cover"
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-50 flex items-end p-4 rounded-t-lg">
                    <div>
                      <h3 className="text-white font-semibold">{event.title}</h3>
                      <p className="text-gray-300 text-sm">{event.date}</p>
                    </div>
                  </div>
                </div>
                <div className="p-4">
                  <p className="font-bold text-lg text-indigo-600">{event.price}</p>
                  <p className="text-sm text-gray-600 mt-2">{event.duration}</p>
                  {hoveredEvent === event.id && (
                    <div className="absolute inset-0 bg-white bg-opacity-90 p-4 rounded-lg flex flex-col justify-between overflow-auto transition-opacity duration-300">
                      <div>
                        <h4 className="font-semibold text-sm text-indigo-900">{event.title}</h4>
                        <p className="text-xs mt-1 text-gray-600">{event.location}</p>
                        <p className="text-xs mt-2 text-gray-600">
                          {event.date} · {event.duration}
                        </p>
                        <p className="text-xs mt-2 text-gray-600">{event.description}</p>
                        <ul className="text-xs mt-2 space-y-1">
                          {event.highlights.map((highlight, index) => (
                            <li key={index} className="flex items-center text-gray-600">
                              <FaCalendarAlt className="mr-1 text-indigo-500" /> {highlight}
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div className="mt-4 w-full flex flex-col space-y-2">
                    {event.id === 1 && (
                      <button
                        className="mt-2 w-full bg-blue-600 text-white py-2 rounded-lg text-sm"
                      >
                        Get For Free
                      </button>
                    )}
                    <button
                      onClick={() => router.push(`/event/${event.id}`)}
                      className="w-full bg-green-600 text-white py-2 rounded-md text-sm"
                    >
                      More Info
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}
            <div className="flex-shrink-0 w-4 md:w-6" aria-hidden="true"></div>
          </div>
        </div>
        <div className="text-center mt-8">
          <Link href="/Events" passHref>
            <button className="bg-indigo-600 text-white px-6 py-3 rounded-md text-lg">
              See More Events
            </button>
          </Link>
        </div>
      </div>
    </section>
  )
}
function CallToAction() {
  return (
    <footer className="bg-blue-200 text-black py-8">
      <div className="container mx-auto px-4 md:px-6 max-w-7xl"> {/* Update 4 */}
        <div className="flex flex-col lg:flex-row justify-between items-start mb-6"> {/* Update 5 */}
          <div className="flex flex-col">
            <div className="flex items-center space-x-4">
              <Image
                src="/Transparent-Logo.png"
                alt="Learning Destiny Logo"
                width={250}
                height={250}
                className="w-55 h-auto"
              />
              <p className="text-black text-base">
                Learners who are transforming their lives through education.<br />
                <span className="font-semibold"> Start your journey today!</span>
              </p>
            </div>
            <p className="text-black text-sm mt-2 max-w-[250px]">
              For Websites, Apps, Student Events, Summer Internships, Research Papers, Mini & Major Projects and end-to-end marketing services,
              Contact us @ +91 9059898900
            </p>
          </div>
          {/* </div> */}
          <div className="flex flex-col md:flex-row w-full lg:w-1/3 space-y-6 md:space-y-0 md:space-x-8"> {/* Update 5 */}
            <div className="flex flex-col items-center md:items-start">
              <h3 className="text-lg font-semibold mb-2">Learn</h3>
              <ul className="space-y-1">
                <li>
                  <Link href="/Courses" className="text-black hover:text-blue-700 transition-colors duration-300">
                    Courses
                  </Link>
                </li>
                <li>
                  <Link href="/Login" className="text-black hover:text-blue-700 transition-colors duration-300">
                    Login
                  </Link>
                </li>
              </ul>
            </div>
            <div className="flex flex-col items-center md:items-start">
              <h3 className="text-lg font-semibold mb-2">Connect</h3>
              <ul className="space-y-1">
                <li>
                  <a href="tel:+919059898900" className="text-black hover:text-blue-700 transition-colors duration-300 text-center md:text-left">
                    <h3 className="text-lg mb-2 text-center md:text-left">+91 9059898900</h3>
                  </a>
                </li>
                <li>
                  <Link href="/ContactUs" className="text-black hover:text-blue-700 transition-colors duration-300">
                    <h3 className="text-lg font-semibold mb-2 text-center md:text-left">Address</h3>
                    <p className="text-center md:text-left">
                      2-4-149, 2nd Floor, JR Edifice,<br />
                      Snehapuri x Road, Nagole,<br />
                      Medchal Dist., Hyderabad - 500035, TG.
                    </p>
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>
        <div className="flex justify-center space-x-4 my-6">
          <a href="https://www.linkedin.com/company/learning-destiny-pvt-ltd/mycompany/" aria-label="LinkedIn" target="_blank" rel="noopener noreferrer" className="text-black hover:text-blue-700 transition-colors duration-300">
            <FontAwesomeIcon icon={faLinkedin} className="text-xl" />
          </a>
          <a href="https://www.instagram.com/learning_destiny/?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw%3D%3D" aria-label="Instagram" target="_blank" rel="noopener noreferrer" className="text-black hover:text-blue-700 transition-colors duration-300">
            <FontAwesomeIcon icon={faInstagram} className="text-xl" />
          </a>
          <a href="mailto:learningdestiny.info@gmail.com" aria-label="Gmail" target="_blank" rel="noopener noreferrer" className="text-black hover:text-blue-700 transition-colors duration-300">
            <FontAwesomeIcon icon={faGoogle} className="text-xl" />
          </a>
          <a href="tel:+919059898900" aria-label="Phone" target="_blank" rel="noopener noreferrer" className="text-black hover:text-blue-700 transition-colors duration-300">
            <FontAwesomeIcon icon={faPhone} className="text-xl" />
          </a>
        </div>
        <div className="text-center text-black text-xs">
          <p className="mb-1">&copy; {new Date().getFullYear()} Learning Destiny Pvt. Ltd. All rights reserved.</p>
          <span>
            By signing up, you agree to our{" "}
            <Link href="/Terms" className="underline underline-offset-2 hover:text-blue-700 transition-colors duration-300">
              Terms & Conditions
            </Link>
            <Link href="/policy" className="underline underline-offset-2 hover:text-blue-700 transition-colors duration-300">
              Privacy policies
            </Link>
            <Link href="/shipping" className="underline underline-offset-2 hover:text-blue-700 transition-colors duration-300">
              Shipping and delivery
            </Link>
            <Link href="/cancallation" className="underline underline-offset-2 hover:text-blue-700 transition-colors duration-300">
              Cancellation and refund
            </Link>
          </span>
        </div>
      </div>
    </footer>
  )
}

export default function LandingPage() {
  return (
    <div>
      <Header />
      <HeroSection />
      <KeyFeatures />
      <PopularCourses />

      <Internship />
      <Workshop />
      <Events />
      <CallToAction />
    </div>
  )
};
