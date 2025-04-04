import { Header } from '../../components/landing-page'
import Cour from '../../Cour'
import React from 'react'

export async function generateMetadata() {
  return {
    title: "Courses",
    description: "Get in touch with us at Learning Destiny. We'd love to hear from you!",
    openGraph: {
      title: "Courses - Learning Destiny",
      description: "Get in touch with us at Learning Destiny. We'd love to hear from you!",
      url: "https://learningdestiny.in/Courses",
      images: [
        {
          url: "https://learningdestiny.in/HomeBG.png",
          width: 1200,
          height: 630,
          alt: "Courses Banner",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: "Courses - Learning Destiny",
      description: "Get in touch with us at Learning Destiny. We'd love to hear from you!",
      images: ["https://learningdestiny.in/HomeBG.png"],
    },
  };
}

const page = () => {
  return (
    <>
    <Header/>
    <Cour/>
    </>
  )
}

export default page