'use client';
import { Star, Clock, BookOpen, Info } from 'lucide-react'
import Link from 'next/link'
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card"
import { Button } from "@/components/ui/button"

const courses = [
  {
    courseId: 1,
    id: 1,
    title: "Vite + React + Tailwind",
    instructor: "Aditya Singh",
    rating: 4.1,
    ratingCount: 75,
    price: "6,999 Rs",
    imageUrl: "https://repository-images.githubusercontent.com/574161536/1c002254-32d8-48b5-a4de-c0ed1511f2ee",
    lastUpdated: "June 2024",
    duration: "80 hours",
    lectureCount: 15,
    description: "Master modern web development with Vite, React, and Tailwind CSS.",
    highlights: [
      'Fast Development with Vite',
      'Component-Based UI with React',
      'Rapid Styling with Tailwind CSS',
      'Modern JavaScript Features',
    ],
    roadmap: [
      {
        month: "Month 1",
        weeks: [
          {
            week: "Week 1: Prerequisites",
            topics: [
              'HTML Basics',
              'CSS Basics',
              'JavaScript Basics',
            ]
          },
          {
            week: "Week 2: React Basics",
            topics: [
              'Create React App',
              'JSX (JavaScript Syntax Extension)',
              'Props',
              'Handling States / useState Hook',
            ]
          },
        ]
      },
      {
        month: "Month 2",
        weeks: [
          {
            week: "Week 1: Advanced Topics",
            topics: [
              'Debugging and logging',
              'Fetching & displaying data from external API',
              'Browser\'s local storage',
            ]
          },
        ]
      },
      {
        month: "Month 3",
        weeks: [
          {
            week: "Project Assignment",
            topics: [
              'Developing a full-fledged React application',
              'Implementing state management with Redux',
              'Utilizing React Router for navigation',
              'Fetching and displaying data from APIs',
            ]
          }
        ]
      }
    ]
  },
  // Add more courses here...
]

const CourseCard = ({
  course
}) => {
  return (
    (<div
      className="bg-gray-800 rounded-lg shadow-md overflow-hidden transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/20">
      <img
        src={course.imageUrl}
        alt={course.title}
        className="w-full h-48 object-cover" />
      <div className="p-6">
        <h2 className="text-2xl font-bold mb-2 text-">{course.title}</h2>
        <p className="text-gray-400 mb-4">{course.instructor}</p>
        <div className="flex items-center mb-4">
          <Star className="text-yellow-400 mr-1" />
          <span className="font-bold mr-2 text-white">{course.rating}</span>
          <span className="text-gray-400">({course.ratingCount} ratings)</span>
        </div>
        <div className="flex items-center justify-between mb-4 text-gray-300">
          <div className="flex items-center">
            <Clock className="mr-2" />
            <span>{course.duration}</span>
          </div>
          <div className="flex items-center">
            <BookOpen className="mr-2" />
            <span>{course.lectureCount} lectures</span>
          </div>
        </div>
        <p className="text-gray-300 mb-4">{course.description}</p>
        <div className="flex justify-between items-center mb-4">
          <span className="text-2xl font-bold text-blue-400">{course.price}</span>
          <Link href="/dashboard" passHref>
            <Button className="bg-green-600 text-white hover:bg-green-700">
              Enroll Now
            </Button>
          </Link>
        </div>
        <HoverCard>
          <HoverCardTrigger asChild>
            <Button variant="outline" className="w-full">
              <Info className="mr-2 h-4 w-4" /> More Info
            </Button>
          </HoverCardTrigger>
          <HoverCardContent className="w-80 bg-gray-700 text-white border-gray-600">
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Course Highlights</h3>
              <ul className="list-disc list-inside space-y-1">
                {course.highlights.map((highlight, index) => (
                  <li key={index} className="text-sm">{highlight}</li>
                ))}
              </ul>
              <h3 className="text-lg font-semibold">Course Roadmap</h3>
              <div className="space-y-2">
                {course.roadmap.map((month, monthIndex) => (
                  <div key={monthIndex}>
                    <h4 className="font-medium text-blue-300">{month.month}</h4>
                    {month.weeks.map((week, weekIndex) => (
                      <div key={weekIndex} className="ml-2">
                        <h5 className="text-sm font-medium text-gray-300">{week.week}</h5>
                        <ul className="list-disc list-inside ml-2">
                          {week.topics.map((topic, topicIndex) => (
                            <li key={topicIndex} className="text-xs text-gray-400">{topic}</li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            </div>
          </HoverCardContent>
        </HoverCard>
      </div>
    </div>)
  );
}

export function CoursesPageComponent() {
  return (
    (<div className="min-h-screen bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold text-center mb-12 text-white">Our Courses</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {courses.map((course) => (
            <CourseCard key={course.id} course={course} />
          ))}
        </div>
      </div>
    </div>)
  );
}