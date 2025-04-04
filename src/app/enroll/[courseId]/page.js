import CourseDetails from '../../../enrollpages/CourseDetails'
// import EnrollPage from '@/enrollpages/Enrollpage'
import React from 'react'

const page = ({params}) => {
  console.log(params,"param")
  return (
    <>
    <CourseDetails params={params.courseId}/>
    </>
  )
}

export default page